// components/MotList.js
export default function MotList({ mots, onMotClick }) {
  if (mots.length === 0) <p className="text-muted">Aucun mot trouvé.</p>;

  return (
    <ul className="list-group mb-4">
      {mots.map((m) => (
        <li key={m._id} className="list-group-item">
          <span
            role="button"
            className="text-primary fw-bold me-2"
            onClick={() => onMotClick(m.mot)}
          >
            {m.mot}
          </span>
          {":"}
          <small className="text-muted ms-2">{m.definition}</small>
        </li>
      ))}
    </ul>
  );
}
