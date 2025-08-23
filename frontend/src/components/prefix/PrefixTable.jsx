export default function PrefixTable({ prefixes, onEdit, onDelete }) {
  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>Préfixe</th>
          <th>Mot</th>
          <th>Solution</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prefixes.map((item, idx) => (
          <tr key={idx}>
            <td>
              <span className="badge bg-primary">{item.prefix}</span>
            </td>
            <td>{item.word}</td>
            <td>{item.solution}</td>
            <td>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => onEdit(item)}
              >
                Modifier
              </button>
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => onDelete(item)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
