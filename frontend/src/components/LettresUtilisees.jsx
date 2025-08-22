export default function LettresUtilisees({
  search,
  obligatoires,
  interdites,
  finMot,
  total,
}) {
  return (
    <div className="text-center mb-3">
      <p>
        <strong>🔤 Lettres utilisées :</strong>
        <br />
        Commence par : <span className="badge bg-primary">{search}</span> |
        Contient : <span className="badge bg-success">{obligatoires}</span> |
        Exclut : <span className="badge bg-danger">{interdites}</span> | Finit
        par : <span className="badge bg-warning text-dark">{finMot}</span>
      </p>
      <p className="text-white">
        Total : {total} mot{total > 1 ? "s" : ""}
      </p>
    </div>
  );
}
