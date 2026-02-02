export default function ToolsDock({ onOpen }) {
  return (
    <div style={dock}>
      <button onClick={() => onOpen("focus")}>⏱</button>
      <button onClick={() => onOpen("reminder")}>⏰</button>
      <button onClick={() => onOpen("calc")}>🧮</button>
      <button onClick={() => onOpen("board")}>🧠</button>
    </div>
  );
}

const dock = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60px",
  background: "#000",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTop: "1px solid #222",
  zIndex: 999,
};

dock.button = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "22px",
};
