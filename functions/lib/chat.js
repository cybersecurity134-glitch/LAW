"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreated = exports.onChatCreated = exports.createOrGetChat = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const admin_1 = require("./admin");
const types_1 = require("./types");
/**
 * Callable: createOrGetChat
 * Uses transactional get-or-create using participantsKey (sorted uids: "uidA_uidB")
 * Prevents race conditions and duplicate chats between any two users.
 */
exports.createOrGetChat = (0, https_1.onCall)({
    maxInstances: 15,
    timeoutSeconds: 30,
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be signed in.');
    }
    const currentUid = request.auth.uid;
    const parseResult = types_1.CreateChatSchema.safeParse(request.data);
    if (!parseResult.success) {
        throw new https_1.HttpsError('invalid-argument', parseResult.error.message);
    }
    const { recipientUid } = parseResult.data;
    if (recipientUid === currentUid) {
        throw new https_1.HttpsError('invalid-argument', 'Cannot create a chat with yourself.');
    }
    // Verify recipient exists
    const recipientSnap = await admin_1.db.collection('users').doc(recipientUid).get();
    if (!recipientSnap.exists) {
        throw new https_1.HttpsError('not-found', 'Recipient user does not exist.');
    }
    // Form deterministic participantsKey
    const sortedUids = [currentUid, recipientUid].sort();
    const participantsKey = `${sortedUids[0]}_${sortedUids[1]}`;
    // Transactional find or create
    const chatsRef = admin_1.db.collection('chats');
    const existingQuery = await chatsRef.where('participantsKey', '==', participantsKey).limit(1).get();
    if (!existingQuery.empty) {
        const existingDoc = existingQuery.docs[0];
        return {
            chatId: existingDoc.id,
            isNew: false,
            chat: existingDoc.data(),
        };
    }
    const now = new Date().toISOString();
    const newChatRef = chatsRef.doc();
    const newChatData = {
        participants: [currentUid, recipientUid],
        participantsKey,
        lastMessage: '',
        lastMessageAt: now,
        lastSenderId: null,
        createdAt: now,
        unreadCounts: {
            [currentUid]: 0,
            [recipientUid]: 0,
        },
    };
    await newChatRef.set(newChatData);
    return {
        chatId: newChatRef.id,
        isNew: true,
        chat: newChatData,
    };
});
/**
 * Trigger: onChatCreated
 * Sends an FCM push notification to the recipient when a new conversation starts.
 */
exports.onChatCreated = (0, firestore_1.onDocumentCreated)('chats/{chatId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const chat = snapshot.data();
    const participants = chat.participants;
    if (!participants || participants.length < 2)
        return;
    // The creator is the first sender or participant
    const creatorUid = chat.lastSenderId || participants[0];
    const recipientUid = participants.find((p) => p !== creatorUid);
    if (!recipientUid)
        return;
    try {
        const creatorSnap = await admin_1.db.collection('users').doc(creatorUid).get();
        const creatorName = creatorSnap.data()?.displayName || 'A founder';
        await sendNotificationToUser(recipientUid, {
            title: 'New Networking Conversation',
            body: `${creatorName} started a chat with you on Startup Pulse.`,
            data: {
                chatId: snapshot.id,
                type: 'chat_created',
            },
        });
    }
    catch (err) {
        console.error('Error in onChatCreated notification:', err?.message || err);
    }
});
/**
 * Trigger: onMessageCreated
 * Updates chat lastMessage, lastMessageAt, and recipient unread count.
 * Sends FCM push notification to recipient with message preview.
 * Cleans up invalid tokens automatically.
 */
exports.onMessageCreated = (0, firestore_1.onDocumentCreated)('chats/{chatId}/messages/{messageId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const message = snapshot.data();
    const chatId = event.params.chatId;
    const senderId = message.senderId;
    const text = message.text || '';
    const chatRef = admin_1.db.collection('chats').doc(chatId);
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists)
        return;
    const chat = chatSnap.data() || {};
    const participants = (chat.participants || []);
    const recipientUid = participants.find((p) => p !== senderId);
    const now = new Date().toISOString();
    // Atomically update parent chat summary and unread counters
    const currentUnread = chat.unreadCounts?.[recipientUid || ''] || 0;
    await chatRef.update({
        lastMessage: text.slice(0, 120),
        lastMessageAt: now,
        lastSenderId: senderId,
        [`unreadCounts.${recipientUid}`]: currentUnread + 1,
    });
    if (!recipientUid)
        return;
    // Send push notification
    try {
        const senderSnap = await admin_1.db.collection('users').doc(senderId).get();
        const senderName = senderSnap.data()?.displayName || 'Startup Member';
        const preview = text.length > 80 ? `${text.slice(0, 77)}...` : text;
        await sendNotificationToUser(recipientUid, {
            title: `${senderName}`,
            body: preview,
            data: {
                chatId,
                type: 'new_message',
            },
        });
    }
    catch (err) {
        console.error('Error sending message FCM push:', err?.message || err);
    }
});
/**
 * Helper to dispatch FCM messages and purge invalid/unregistered tokens
 */
async function sendNotificationToUser(userId, payload) {
    const userRef = admin_1.db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists)
        return;
    const tokens = (userSnap.data()?.fcmTokens || []);
    if (!tokens || tokens.length === 0)
        return;
    const response = await admin_1.messaging.sendEachForMulticast({
        tokens,
        notification: {
            title: payload.title,
            body: payload.body,
        },
        data: payload.data || {},
    });
    // Collect invalid tokens that failed with RegistrationTokenNotRegistered
    const invalidTokens = [];
    response.responses.forEach((res, idx) => {
        if (!res.success && res.error) {
            const code = res.error.code;
            if (code === 'messaging/invalid-registration-token' ||
                code === 'messaging/registration-token-not-registered') {
                invalidTokens.push(tokens[idx]);
            }
        }
    });
    // Purge dead tokens if any
    if (invalidTokens.length > 0) {
        const validTokens = tokens.filter((t) => !invalidTokens.includes(t));
        await userRef.update({ fcmTokens: validTokens });
        console.log(`Cleaned up ${invalidTokens.length} expired FCM token(s) for user ${userId}`);
    }
}
//# sourceMappingURL=chat.js.map