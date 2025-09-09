import { useState, useRef, useCallback } from 'react';

/**
 * AudioRecordingHook
 * - Records mic audio with MIME fallbacks (Edge/Chrome: webm/opus; Safari: ogg/mp4 fallback)
 * - Returns base64 (no data URL prefix) from stopRecording()
 * - Exposes "container" so you can pass it to your STT function if desired
 */
export interface AudioRecordingHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>; // base64 only (no data: prefix)
  error: string | null;
  container: string | null; // "webm" | "ogg" | "mp4" | null
}

export const useAudioRecording = (): AudioRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [container, setContainer] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const chosenMime = useRef<string>('');

  const pickMime = () => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus', // best (Edge/Chrome)
      'audio/ogg;codecs=opus',  // good fallback (Safari often OK)
      'audio/mp4',              // additional fallback (some Safari builds)
      'audio/webm',
      'audio/ogg'
    ];
    for (const m of candidates) {
      // @ts-ignore
      if (MediaRecorder.isTypeSupported?.(m)) return m;
    }
    return '';
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Must be HTTPS (or localhost) and user must grant mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const mimeType = pickMime();
      chosenMime.current = mimeType;
      console.log('[Audio] Chosen MIME:', mimeType || '(browser default)');

      // Derive a simple container label for server
      if (mimeType.includes('ogg')) setContainer('ogg');
      else if (mimeType.includes('webm')) setContainer('webm');
      else if (mimeType.includes('mp4')) setContainer('mp4');
      else setContainer(null);

      mediaRecorder.current = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onerror = (e: any) => {
        console.error('[Audio] MediaRecorder error:', e?.error || e);
        setError(e?.error?.message || 'MediaRecorder error');
      };

      mediaRecorder.current.onstart = () => {
        console.log('[Audio] Recording started');
      };

      // Collect in ~250ms chunks (more robust than 100ms on some setups)
      mediaRecorder.current.start(250);
      setIsRecording(true);
    } catch (err: any) {
      const msg = err?.message ?? 'Failed to start recording (permission/HTTPS?)';
      setError(msg);
      console.error('[Audio] Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || !isRecording) {
        console.warn('[Audio] stopRecording called but not recording');
        return resolve(null);
      }

      mediaRecorder.current.onstop = async () => {
        try {
          console.log('[Audio] Recording stopped. Chunks:', chunks.current.length);

          if (!chunks.current.length) {
            console.error('[Audio] No audio chunks recorded!');
            setError('No audio captured. Please try again.');
            // Stop tracks anyway
            mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
            setIsRecording(false);
            return resolve(null);
          }

          const blobType = chosenMime.current || 'audio/webm';
          const blob = new Blob(chunks.current, { type: blobType });
          console.log('[Audio] Blob:', { type: blob.type, size: blob.size });

          // Convert Blob -> data URL -> base64
          const reader = new FileReader();
          reader.onerror = (e) => {
            console.error('[Audio] FileReader error:', e);
            setError('Failed to read audio blob');
            mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
            setIsRecording(false);
            resolve(null);
          };
          reader.onloadend = () => {
            const result = reader.result as string; // "data:audio/...;base64,XXXX"
            const base64 = result.split(',')[1] || '';
            mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
            setIsRecording(false);
            resolve(base64);
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          console.error('[Audio] Error processing recording:', e);
          setError('Failed to process recording');
          mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
          setIsRecording(false);
          resolve(null);
        }
      };

      try {
        mediaRecorder.current.stop();
      } catch (e) {
        console.error('[Audio] mediaRecorder.stop() failed:', e);
        setError('Failed to stop recording');
        mediaRecorder.current?.stream?.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        resolve(null);
      }
    });
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error, container };
};
