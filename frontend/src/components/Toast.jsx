export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#1f1f1f",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        maxWidth: "300px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: "8px" }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          color: "#aaa",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        close
      </button>
    </div>
  );
}
