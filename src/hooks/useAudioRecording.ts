import { useState, useRef, useCallback } from 'react';

export interface AudioRecordingHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  error: string | null;
}

export const useAudioRecording = (): AudioRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || !isRecording) {
        resolve(null);
        return;
      }

      mediaRecorder.current.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks.current, { type: 'audio/webm;codecs=opus' });
          
          // Convert to base64
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          // Cleanup
          const tracks = mediaRecorder.current?.stream?.getTracks();
          tracks?.forEach(track => track.stop());
          
          setIsRecording(false);
          resolve(base64Audio);
        } catch (err) {
          console.error('Error processing recording:', err);
          setError('Failed to process recording');
          setIsRecording(false);
          resolve(null);
        }
      };

      mediaRecorder.current.stop();
    });
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error
  };
};