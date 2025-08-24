// src/components/FiltreMots.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./FiltreMots.css";

function FiltreMots({
  search,
  setSearch,
  lettresObligatoires,
  setLettresObligatoires,
  lettresInterdites,
  setLettresInterdites,
  finMot,
  setFinMot,
  minLength,
  setMinLength,
  maxLength,
  setMaxLength,
  onReset,
}) {
  const [errorLength, setErrorLength] = useState("");

  // Validation min ≤ max
  useEffect(() => {
    if (
      minLength !== "" &&
      maxLength !== "" &&
      Number(minLength) > Number(maxLength)
    ) {
      setErrorLength(
        "La longueur min doit être inférieure ou égale à la longueur max"
      );
    } else {
      setErrorLength("");
    }
  }, [minLength, maxLength]);

  // Handler de reset stabilisé
  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <div className="card filtre-card p-3 mb-3 shadow-sm">
      <div className="row g-3 align-items-end">
        {/* Commence par */}
        <div className="col-12 col-md-6 col-lg-3">
          <label
            htmlFor="searchStartsWith"
            className="form-label fw-bold text-primary"
          >
            Commence par
          </label>
          <input
            type="text"
            id="searchStartsWith"
            className="form-control input-primary"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Contient */}
        <div className="col-12 col-md-6 col-lg-3">
          <label
            htmlFor="searchContains"
            className="form-label fw-bold text-success"
          >
            Obligatoires
          </label>
          <input
            type="text"
            id="searchContains"
            className="form-control input-success"
            autoComplete="off"
            value={lettresObligatoires}
            onChange={(e) => setLettresObligatoires(e.target.value)}
          />
        </div>

        {/* Sans lettres */}
        <div className="col-12 col-md-6 col-lg-3">
          <label
            htmlFor="searchExcludes"
            className="form-label fw-bold text-danger"
          >
            Interdites
          </label>
          <input
            type="text"
            id="searchExcludes"
            className="form-control input-danger"
            autoComplete="off"
            value={lettresInterdites}
            onChange={(e) => setLettresInterdites(e.target.value)}
          />
        </div>

        {/* Finit par */}
        <div className="col-12 col-md-6 col-lg-3">
          <label
            htmlFor="searchEndsWith"
            className="form-label fw-bold text-primary"
          >
            Finit par
          </label>
          <input
            type="text"
            id="searchEndsWith"
            className="form-control input-primary"
            autoComplete="off"
            value={finMot}
            onChange={(e) => setFinMot(e.target.value)}
          />
        </div>

        {/* Longueurs min / max */}
        <div className="d-flex justify-content-center gap-3 mt-3">
          <div className="flex-shrink-1" style={{ maxWidth: "260px" }}>
            <input
              type="number"
              id="minLength"
              className="form-control input-secondary"
              autoComplete="off"
              placeholder="2"
              min="2"
              value={minLength}
              onChange={(e) => setMinLength(e.target.value)}
              aria-describedby="error-length"
            />
          </div>
          <div className="flex-shrink-1" style={{ maxWidth: "260px" }}>
            <input
              type="number"
              id="maxLength"
              className="form-control input-secondary"
              autoComplete="off"
              placeholder="8"
              max="8"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              aria-describedby="error-length"
            />
          </div>
        </div>
      </div>

      {errorLength && (
        <div id="error-length" className="text-danger mt-2">
          {errorLength}
        </div>
      )}

      <div className="mt-3 text-center">
        <button
          className="btn btn-gradient btn-sm"
          onClick={handleReset}
          disabled={!!errorLength}
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}

// Empêche le re-rendu si les props n'ont pas changé
export default React.memo(FiltreMots, (prevProps, nextProps) => {
  return (
    prevProps.search === nextProps.search &&
    prevProps.lettresObligatoires === nextProps.lettresObligatoires &&
    prevProps.lettresInterdites === nextProps.lettresInterdites &&
    prevProps.finMot === nextProps.finMot &&
    prevProps.minLength === nextProps.minLength &&
    prevProps.maxLength === nextProps.maxLength &&
    prevProps.onReset === nextProps.onReset
  );
});
