import { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";

function Liste() {
  const [mots, setMots] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMots, setTotalMots] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 14;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMots = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        startsWith: debouncedSearch,
      });
      const res = await fetch(`/api/mots?${params.toString()}`);
      const data = await res.json();
      setMots(data.mots);
      setTotalPages(data.totalPages);
      setTotalMots(data.total);
    } catch (err) {
      console.error(err);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchMots();
  }, [fetchMots]);

  const handlePrev = useCallback(() => setPage((p) => p - 1), []);
  const handleNext = useCallback(() => setPage((p) => p + 1), []);
  const handleFirst = useCallback(() => setPage(1), []);
  const handleLast = useCallback(() => setPage(totalPages), [totalPages]);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h1 className="mb-4">📘 ODS-9 sans conjugaisons</h1>

        <input
          id="searchDico"
          type="text"
          className="form-control mb-3"
          placeholder="Début du mot..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
        />

        {mots.length === 0 ? (
          <p className="text-muted">Aucun mot trouvé.</p>
        ) : (
          <ul className="list-group mb-4">
            {mots.map((m) => (
              <li key={m._id} className="list-group-item">
                <strong>{m.mot}</strong> : {m.definition}
              </li>
            ))}
          </ul>
        )}

        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={handleFirst}
            disabled={page === 1}
          >
            ⏮ Début
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={page === 1}
          >
            ◀ Précédent
          </button>
          <span className="mx-2">
            Page {page} sur {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Suivant ▶
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handleLast}
            disabled={page === totalPages}
          >
            Fin ⏭
          </button>
        </div>
        <p className="mt-3 text-info text-center">
          Nombre total de mots : {totalMots}
        </p>
      </div>
    </>
  );
}

export default Liste;
