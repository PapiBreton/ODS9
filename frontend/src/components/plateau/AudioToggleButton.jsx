export default function AudioToggleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn btn-outline-warning my-3 text-center"
    >
      🔊 Activer le son du jeu
    </button>
  );
}
