// src/pages/Liste.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import Navbar from "../components/Navbar";
import FiltreMots from "../components/FiltreMots";
import MotList from "../components/MotList";
import useAnagrams from "../utils/useAnagrams";

// Lazy loading de la modale
const AnagramModal = lazy(() => import("../components/AnagramModal"));

export default function Liste() {
  const { fetchAnagrams } = useAnagrams();

  // --------------------
  // ÉTATS
  // --------------------
  const [mots, setMots] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [totalMots, setTotalMots] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    lettresObligatoires: "",
    lettresInterdites: "",
    finMot: "",
    minLength: "2",
    maxLength: "8",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modale
  const [modalState, setModalState] = useState({
    show: false,
    mot: "",
    anagrammes: [],
  });

  const abortRef = useRef(null);
  const loaderRef = useRef(null);

  // --------------------
  // GESTION DES FILTRES + DEBOUNCE
  // --------------------
  useEffect(() => {
    setMots([]);
    setPagination((p) => ({ ...p, page: 1, totalPages: 1 }));

    const { minLength, maxLength, search } = filters;
    if (maxLength && parseInt(maxLength) < parseInt(minLength)) {
      setDebouncedSearch("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // --------------------
  // FETCH DES MOTS
  // --------------------
  const fetchMots = useCallback(async () => {
    const { page } = pagination;
    const {
      search,
      lettresObligatoires,
      lettresInterdites,
      finMot,
      minLength,
      maxLength,
    } = filters;

    if (maxLength && parseInt(maxLength) < parseInt(minLength)) return;

    setIsLoading(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        startsWith: debouncedSearch,
        contains: lettresObligatoires,
        excludes: lettresInterdites,
        endsWith: finMot,
        minLength,
        maxLength,
      });

      const res = await fetch(`/api/mots?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Erreur réseau");

      const { mots: newMots, totalPages, total } = await res.json();

      const motsNormalises = newMots.map((item, index) => ({
        id: item._id || `${item.mot}-${page}-${index}`,
        mot: item.mot || item,
        definition: item.definition || "",
        anagramCount: item.anagramCount || 0,
        normalized: item.normalized || "",
      }));

      setPagination((p) => ({ ...p, totalPages }));
      setTotalMots(total);
      setMots((prev) =>
        page === 1 ? motsNormalises : [...prev, ...motsNormalises]
      );
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, debouncedSearch, filters]);

  useEffect(() => {
    fetchMots();
  }, [fetchMots]);

  // --------------------
  // SCROLL INFINI
  // --------------------
  useEffect(() => {
    if (pagination.page >= pagination.totalPages || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setPagination((p) => ({
            ...p,
            page: Math.min(p.page + 1, p.totalPages),
          }));
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [pagination, isLoading]);

  // --------------------
  // MODALE ANAGRAMMES
  // --------------------
  const handleShowAnagrams = useCallback(
    async (mot) => {
      const anas = await fetchAnagrams(mot);
      setModalState({ show: true, mot, anagrammes: anas });
    },
    [fetchAnagrams]
  );

  const handleCloseModal = useCallback(() => {
    setModalState({ show: false, mot: "", anagrammes: [] });
  }, []);

  // --------------------
  // RESET FILTRES
  // --------------------
  const handleResetAll = useCallback(() => {
    setFilters({
      search: "",
      lettresObligatoires: "",
      lettresInterdites: "",
      finMot: "",
      minLength: "2",
      maxLength: "8",
    });
    setPagination({ page: 1, totalPages: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // --------------------
  // RENDER
  // --------------------
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="mb-4 text-center">📘 ODS-9 sans conjugaisons</h3>

        <FiltreMots
          {...filters}
          setSearch={(v) => setFilters((f) => ({ ...f, search: v }))}
          setLettresObligatoires={(v) =>
            setFilters((f) => ({ ...f, lettresObligatoires: v }))
          }
          setLettresInterdites={(v) =>
            setFilters((f) => ({ ...f, lettresInterdites: v }))
          }
          setFinMot={(v) => setFilters((f) => ({ ...f, finMot: v }))}
          setMinLength={(v) => setFilters((f) => ({ ...f, minLength: v }))}
          setMaxLength={(v) => setFilters((f) => ({ ...f, maxLength: v }))}
          onReset={handleResetAll}
        />

        {totalMots > 5 && (
          <p className="mt-1 text-secondary text-center">
            Total : {totalMots} mots
          </p>
        )}

        <MotList mots={mots} onMotClick={handleShowAnagrams} />

        <div ref={loaderRef} style={{ height: 1 }} />

        {isLoading && <p className="text-center text-info">Chargement...</p>}
        {totalMots > 0 &&
          pagination.page >= pagination.totalPages &&
          !isLoading && (
            <p className="text-center text-white mt-3">
              Vous avez atteint la fin ({totalMots}{" "}
              {totalMots === 1 ? "mot" : "mots"}).
            </p>
          )}
        {totalMots === 0 && !isLoading && (
          <p className="text-center text-white">
            Aucune solution trouvée avec ces filtres !
          </p>
        )}
      </div>

      <Suspense fallback={<div>Chargement de la modale...</div>}>
        {modalState.show && (
          <AnagramModal
            show={modalState.show}
            motPourAnagrammes={modalState.mot}
            anagrammes={modalState.anagrammes}
            onClose={handleCloseModal}
          />
        )}
      </Suspense>
    </>
  );
}
