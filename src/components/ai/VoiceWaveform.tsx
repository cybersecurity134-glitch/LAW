import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Trash2, Check, Volume2 } from 'lucide-react';

interface VoiceWaveformProps {
  isRecording: boolean;
  recordingDuration: number;
  audioStream: MediaStream | null;
  onStop: () => void;
  onCancel: () => void;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isRecording,
  recordingDuration,
  audioStream,
  onStop,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (!isRecording || !audioStream) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const rawHeight = dataArray[i];
          // Scale bar height cleanly to canvas height
          const barHeight = Math.max(4, (rawHeight / 255) * (canvas.height - 6));

          // Liquid amber/purple gradient
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#f97316');
          gradient.addColorStop(1, '#eab308');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          const y = (canvas.height - barHeight) / 2;
          ctx.roundRect(x, y, Math.max(2, barWidth - 2), barHeight, [3]);
          ctx.fill();

          x += barWidth + 2;
          if (x > canvas.width) break;
        }
      };

      draw();
    } catch (e) {
      console.warn("AudioContext visualization not available:", e);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, audioStream]);

  return (
    <div className="flex items-center gap-3 w-full bg-orange-500/10 dark:bg-[#7C5CFF]/15 border border-orange-500/30 dark:border-[#7C5CFF]/30 px-3 py-2 rounded-2xl backdrop-blur-md animate-fadeIn">
      {/* Recording indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-100">
          {formatDuration(recordingDuration)}
        </span>
      </div>

      {/* Real-time audio waveform canvas */}
      <div className="flex-1 h-8 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={240}
          height={32}
          className="w-full h-8"
        />
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
          title="Cancel recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onStop}
          className="px-3 py-1.5 rounded-full bg-orange-500 dark:bg-[#7C5CFF] text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
          title="Finish and send voice message"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
