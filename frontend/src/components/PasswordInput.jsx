import { useState, useId } from "react";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: "18px", height: "18px", display: "block" }}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: "18px", height: "18px", display: "block" }}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
    maxWidth: "400px",
    fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#7a7a8c",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "14px 48px 14px 16px",
    background: "#1a1a24",
    border: "1px solid #2a2a38",
    borderRadius: "12px",
    color: "#f0eee8",
    fontSize: "15px",
    letterSpacing: "0.04em",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
    WebkitAppearance: "none",
  },
  inputFocused: {
    borderColor: "#c8f064",
    boxShadow: "0 0 0 3px rgba(200, 240, 100, 0.15)",
  },
  toggle: {
    position: "absolute",
    right: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    background: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "#4a4a5e",
    cursor: "pointer",
    transition: "color 0.18s ease, background 0.18s ease",
    outline: "none",
  },
  toggleFocused: {
    color: "#c8f064",
    background: "rgba(200, 240, 100, 0.08)",
    outline: "2px solid rgba(200, 240, 100, 0.5)",
    outlineOffset: "1px",
  },
  toggleHovered: {
    color: "#c8f064",
    background: "rgba(200, 240, 100, 0.08)",
  },
};

export default function PasswordInput({
  id,
  placeholder = "Enter your password",
  name = "password",
  autoComplete = "current-password",
  onChange,
  value,
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [btnFocused, setBtnFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const toggle = () => setVisible((v) => !v);

  const inputStyle = {
    ...styles.input,
    ...(focused ? styles.inputFocused : {}),
  };

  const toggleStyle = {
    ...styles.toggle,
    ...(btnHovered ? styles.toggleHovered : {}),
    ...(btnFocused ? styles.toggleFocused : {}),
  };

  return (
    <div style={styles.wrapper}>
      
      <div style={styles.inputWrapper}>
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
        />

        <button
          type="button"
          onClick={toggle}
          style={toggleStyle}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={inputId}
          onFocus={() => setBtnFocused(true)}
          onBlur={() => setBtnFocused(false)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}