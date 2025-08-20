import React from "react";
import "./styles.css";

export default function IconButton({
  children,
  onClick,
  title,
  disabled,
  ariaExpanded,
  className = "",
}) {
  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-expanded={ariaExpanded}
    >
      {children}
    </button>
  );
}
