// src/pages/Liste.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import FiltreMots from "../components/FiltreMots";
import MotList from "../components/MotList";
import AnagramModal from "../components/AnagramModal";
import useAnagrams from "../utils/useAnagrammes";

export default function Liste() {
  const { fetchAnagrams } = useAnagrams();
  const [mots, setMots] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMots, setTotalMots] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lettresObligatoires, setLettresObligatoires] = useState("");
  const [lettresInterdites, setLettresInterdites] = useState("");
  const [finMot, setFinMot] = useState("");
  const [minLength, setMinLength] = useState("2");
  const [maxLength, setMaxLength] = useState("8");

  // Déclenchement différé de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Réinitialisation des résultats quand les filtres changent
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

  // Récupération des mots depuis l'API
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
      // Normalisation : on s'assure que chaque élément est { id, mot }
      const motsNormalises = newMots.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return {
            id: item._id || `${item.mot}-${page}-${index}`,
            mot: item.mot,
            definition: item.definition || "",
            anagramCount: item.anagramCount || 0,
            normalized: item.normalized || "",
          };
        }
        return {
          id: `${item}-${page}-${index}`,
          mot: item,
        };
      });

      setTotalPages(tp);
      setTotalMots(total);
      setMots((prev) =>
        page === 1 ? motsNormalises : [...prev, ...motsNormalises]
      );
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

  useEffect(() => {
    fetchMots();
  }, [fetchMots]);

  // Scroll infini
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

  // Gestion de la modale d’anagrammes
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

  // Réinitialisation des filtres
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
          <p className="text-center text-white mt-3">
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
