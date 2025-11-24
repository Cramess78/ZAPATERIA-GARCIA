import { useEffect } from "react";

export default function Notificacion({ mensaje, tipo = "error", onClose }) {
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, onClose]);

  if (!mensaje) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "1rem 1.5rem",
        backgroundColor: tipo === "error" ? "#fee" : "#efe",
        color: tipo === "error" ? "#c33" : "#3c3",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        maxWidth: "400px",
        border: `1px solid ${tipo === "error" ? "#fcc" : "#cfc"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <span>{mensaje}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontSize: "1.2rem",
          padding: "0",
          lineHeight: "1",
        }}
      >
        ×
      </button>
    </div>
  );
}

