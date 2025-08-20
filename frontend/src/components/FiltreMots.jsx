// src/components/FiltreMots.jsx
export default function FiltreMots({
  search,
  setSearch,
  lettresObligatoires,
  setLettresObligatoires,
  lettresInterdites,
  setLettresInterdites,
  finMot,
  setFinMot,
}) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Début du mot..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toUpperCase())}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Lettres obligatoires..."
        value={lettresObligatoires}
        onChange={(e) => setLettresObligatoires(e.target.value.toUpperCase())}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Lettres interdites..."
        value={lettresInterdites}
        onChange={(e) => setLettresInterdites(e.target.value.toUpperCase())}
      />
      <input
        type="text"
        className="form-control"
        placeholder="Fin du mot..."
        value={finMot}
        onChange={(e) => setFinMot(e.target.value.toUpperCase())}
      />
    </div>
  );
}
