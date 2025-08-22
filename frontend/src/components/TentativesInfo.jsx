export default function TentativesInfo({ tentatives, onRelancer }) {
  return (
    <div className="text-center mb-3">
      <button className="btn btn-outline-info mt-2" onClick={onRelancer}>
        🔄 Forcer une nouvelle tentative
      </button>
      <p className="text-warning mt-2">
        Tentatives automatiques : {tentatives}
      </p>
    </div>
  );
}
