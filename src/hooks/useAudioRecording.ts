import { useState, useRef, useCallback } from 'react';

export interface AudioRecordingHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>; // returns base64 (no data URL prefix)
  error: string | null;
}

export const useAudioRecording = (): AudioRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const chosenMime = useRef<string>(''); // remember which container we’re using

  const pickMime = () => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/ogg'
    ];
    for (const m of candidates) {
      if ((MediaRecorder as any).isTypeSupported?.(m)) return m;
    }
    return ''; // fallback: let browser choose
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
      });

      const mimeType = pickMime();
      chosenMime.current = mimeType;

      mediaRecorder.current = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      mediaRecorder.current.start(100);
      setIsRecording(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to start recording');
      console.error('Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || !isRecording) return resolve(null);

      mediaRecorder.current.onstop = async () => {
        try {
          const blob = new Blob(chunks.current, { type: chosenMime.current || 'audio/webm' });

          // Convert Blob -> data URL -> base64 (without prefix)
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string; // "data:audio/...;base64,XXXX"
            const base64 = result.split(',')[1] || '';
            // stop tracks
            mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
            setIsRecording(false);
            resolve(base64);
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          console.error('Error processing recording:', e);
          setError('Failed to process recording');
          setIsRecording(false);
          resolve(null);
        }
      };

      mediaRecorder.current.stop();
    });
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error };
};
