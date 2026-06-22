// src/hooks/useCamera.js
import { useState, useRef, useCallback, useEffect } from "react";

export default function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [error, setError] = useState(null);

  const start = useCallback(async (mode) => {
    const facing = mode || facingMode;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      setError(null);
    } catch (err) {
      setError("Camera access denied or unavailable.");
    }
  }, [facingMode]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const flip = useCallback(() => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    start(next);
  }, [facingMode, start]);

  const capture = useCallback((quality = 0.8) => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg", quality);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, active, error, start, stop, flip, capture, facingMode };
}
