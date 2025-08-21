import React from "react";
import "./FiltreMots.css";

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
  const handleReset = () => {
    setSearch("");
    setLettresObligatoires("");
    setLettresInterdites("");
    setFinMot("");
  };

  return (
    <div className="card filtre-card p-3 mb-4 shadow-sm">
      <div className="row g-3">
        {/* Recherche par début */}
        <div className="col-md-3">
          <label
            className="form-label fw-bold text-primary"
            htmlFor="searchStartsWith"
          >
            Commence par
          </label>
          <input
            type="text"
            id="searchStartsWith"
            className="form-control input-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lettres obligatoires */}
        <div className="col-md-3">
          <label
            className="form-label fw-bold text-success"
            htmlFor="searchContains"
          >
            Contient
          </label>
          <input
            type="text"
            id="searchContains"
            className="form-control input-success"
            value={lettresObligatoires}
            onChange={(e) => setLettresObligatoires(e.target.value)}
          />
        </div>

        {/* Lettres interdites */}
        <div className="col-md-3">
          <label
            className="form-label fw-bold text-danger"
            htmlFor="searchExcludes"
          >
            Sans lettres
          </label>
          <input
            type="text"
            id="searchExcludes"
            className="form-control input-danger"
            value={lettresInterdites}
            onChange={(e) => setLettresInterdites(e.target.value)}
          />
        </div>

        {/* Fin du mot */}
        <div className="col-md-3">
          <label
            className="form-label fw-bold text-primary"
            htmlFor="searchEndsWith"
          >
            Finit par
          </label>
          <input
            type="text"
            id="searchEndsWith"
            className="form-control input-primary"
            value={finMot}
            onChange={(e) => setFinMot(e.target.value)}
          />
        </div>
      </div>

      {/* Bouton reset */}
      <div className="mt-3 text-end">
        <button className="btn btn-gradient btn-sm" onClick={handleReset}>
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}
