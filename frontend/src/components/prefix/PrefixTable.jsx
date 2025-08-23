import { useState } from "react";

export default function PrefixList({ prefixes, onEdit, onDelete }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSolution = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="container pt-3 pb-4">
      <ul className="list-group">
        {prefixes.map((item, idx) => (
          <li
            key={idx}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              idx % 2 === 0
                ? "list-group-item-light"
                : "list-group-item-secondary"
            }`}
          >
            {/* Solution visible uniquement si cliqué */}
            <div className="d-flex justify-content-center">
              {openIndex === idx && <strong>{item.solution}</strong>}
            </div>
            {/* Mot cliquable */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleSolution(idx)}
            >
              <strong>{item.word}</strong>
            </div>
            {/* Boutons */}
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onEdit(item)}
              >
                ✏️ Modifier
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(item)}
              >
                🗑️ Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
