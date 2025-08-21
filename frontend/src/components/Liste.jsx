import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import FiltreMots from "../components/FiltreMots";
import MotList from "../components/MotList";
import Pagination from "../components/Pagination";
import AnagramModal from "../components/AnagramModal";
import useAnagrams from "../utils/useAnagrammes";

export default function Liste() {
  const { fetchAnagrams } = useAnagrams();
  const [mots, setMots] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMots, setTotalMots] = useState(0);

  // Filtres
  const [search, setSearch] = useState("");
  const [lettresObligatoires, setLettresObligatoires] = useState("");
  const [lettresInterdites, setLettresInterdites] = useState("");
  const [finMot, setFinMot] = useState("");
  // src/pages/Liste.jsx
  const [minLength, setMinLength] = useState("2");
  const [maxLength, setMaxLength] = useState("8");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [motPourAnagrammes, setMotPourAnagrammes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAnas, setModalAnas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const limit = 15;

  // Débounce sur la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Récupération des mots
  const fetchMots = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        startsWith: debouncedSearch,
        contains: lettresObligatoires,
        excludes: lettresInterdites,
        endsWith: finMot,
        minLength,
        maxLength,
      });
      const res = await fetch(`/api/mots?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des mots");

      const data = await res.json();
      setMots(data.mots);
      setTotalPages(data.totalPages);
      setTotalMots(data.total);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    lettresObligatoires,
    lettresInterdites,
    finMot,
    minLength,
    maxLength,
  ]);

  useEffect(() => {
    fetchMots();
  }, [fetchMots]);

  // Ouverture modale anagrammes
  const handleShowAnagrams = async (mot) => {
    const anas = await fetchAnagrams(mot);
    setModalAnas(anas);
    setMotPourAnagrammes(mot);
    setShowModal(true);
  };

  // Fermeture modale
  const handleCloseModal = () => {
    setShowModal(false);
    setModalAnas([]);
    setMotPourAnagrammes("");
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="mb-4 text-center">📘 ODS-9 sans conjugaisons</h3>

        <FiltreMots
          search={search}
          setSearch={setSearch}
          lettresObligatoires={lettresObligatoires}
          setLettresObligatoires={setLettresObligatoires}
          lettresInterdites={lettresInterdites}
          setLettresInterdites={setLettresInterdites}
          finMot={finMot}
          setFinMot={setFinMot}
          minLength={minLength}
          setMinLength={setMinLength}
          maxLength={maxLength}
          setMaxLength={setMaxLength}
        />

        {loading && <p className="text-center text-info">Chargement...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && !error && mots.length === 0 && (
          <p className="text-center text-muted">Aucun mot trouvé.</p>
        )}

        <MotList mots={mots} onMotClick={handleShowAnagrams} />

        <Pagination
          page={page}
          totalPages={totalPages}
          onFirst={() => setPage(1)}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          onLast={() => setPage(totalPages)}
        />

        <p className="mt-3 text-secondary text-center">
          Nombre total de mots : {totalMots}
        </p>
      </div>

      <AnagramModal
        show={showModal}
        anagrammes={modalAnas}
        onClose={handleCloseModal}
        motPourAnagrammes={motPourAnagrammes}
      />
    </>
  );
}
