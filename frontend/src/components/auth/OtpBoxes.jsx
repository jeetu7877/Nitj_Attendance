// src/components/auth/OtpBoxes.jsx
import { useRef } from "react";

export default function OtpBoxes({ value = "", onChange, length = 6 }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const update = (arr) => onChange(arr.join(""));

  const handleChange = (e, i) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = digits.slice();
    arr[i] = ch;
    update(arr);
    if (ch && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const arr = text.split("").concat(Array(length).fill("")).slice(0, length);
    update(arr);
    const next = Math.min(text.length, length - 1);
    inputs.current[next]?.focus();
  };

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          className="otp-box"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
