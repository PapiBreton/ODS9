// src/pages/Liste.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import FiltreMots from "../components/FiltreMots";
import MotList from "../components/MotList";
import AnagramModal from "../components/AnagramModal";
import useAnagrams from "../utils/useAnagrammes";

export default function Liste() {
  const { fetchAnagrams } = useAnagrams();

  // pagination & data
  const [mots, setMots] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMots, setTotalMots] = useState(0);

  // filtres
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lettresObligatoires, setLettresObligatoires] = useState("");
  const [lettresInterdites, setLettresInterdites] = useState("");
  const [finMot, setFinMot] = useState("");
  const [minLength, setMinLength] = useState("2");
  const [maxLength, setMaxLength] = useState("8");

  // debounce sur la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // reset liste et page à chaque changement de filtre
  useEffect(() => {
    setMots([]);
    setPage(1);
  }, [
    debouncedSearch,
    lettresObligatoires,
    lettresInterdites,
    finMot,
    minLength,
    maxLength,
  ]);

  // fetch des mots (remplace ou concatène selon page)
  const fetchMots = useCallback(async () => {
    try {
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
      if (!res.ok) throw new Error("Erreur de réseau");

      const { mots: newMots, totalPages: tp, total } = await res.json();
      setTotalPages(tp);
      setTotalMots(total);
      setMots((prev) => (page === 1 ? newMots : [...prev, ...newMots]));
    } catch (err) {
      console.error(err);
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

  // déclencher le fetch
  useEffect(() => {
    fetchMots();
  }, [fetchMots]);

  // infinite scroll via IntersectionObserver
  const loaderRef = useRef(null);
  useEffect(() => {
    if (page >= totalPages) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => Math.min(p + 1, totalPages));
        }
      },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, totalPages]);

  // modal anagrammes
  const [showModal, setShowModal] = useState(false);
  const [modalAnas, setModalAnas] = useState([]);
  const [motPourAnagrammes, setMotPourAnagrammes] = useState("");

  const handleShowAnagrams = async (mot) => {
    const anas = await fetchAnagrams(mot);
    setModalAnas(anas);
    setMotPourAnagrammes(mot);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAnas([]);
    setMotPourAnagrammes("");
  };

  // Réinitialisation globale filtres + pagination + scroll + debounce
  const handleResetAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setLettresObligatoires("");
    setLettresInterdites("");
    setFinMot("");
    setMinLength("2");
    setMaxLength("8");
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          onReset={handleResetAll}
        />

        <div className="mb-2 text-center">
          {totalMots > 5 && (
            <p className="mt-1 text-secondary">Total : {totalMots} mots</p>
          )}
        </div>

        <MotList mots={mots} onMotClick={handleShowAnagrams} />

        <div ref={loaderRef} style={{ height: 1 }} />

        {page < totalPages && (
          <p className="text-center text-info">Chargement...</p>
        )}
        {totalMots > 0 && page >= totalPages && (
          <p className="text-center text-white">
            Vous avez atteint la fin ({totalMots}{" "}
            {totalMots === 1 ? "mot" : "mots"}).
          </p>
        )}
        {totalMots === 0 && (
          <p className="text-center text-white">
            Aucune solution trouvée avec ces filtres !
          </p>
        )}
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
