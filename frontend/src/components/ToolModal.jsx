export default function ToolModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#111",
  color: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "420px",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  color: "#fff",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};
