import { useEffect, useState, useCallback } from "react";
import useAnagrams from "../utils/useAnagrammes";
import Navbar from "./Navbar";
import Pagination from "./Pagination";
import MotList from "../components/MotList";
import AnagramModal from "../components/AnagramModal";

export default function Liste() {
  const { fetchAnagrams } = useAnagrams();
  const [mots, setMots] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMots, setTotalMots] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [motPourAnagrammes, setMotPourAnagrammes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAnas, setModalAnas] = useState([]);
  const limit = 13;

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

  const handleShowAnagrams = async (mot) => {
    const anas = await fetchAnagrams(mot);
    setMotPourAnagrammes(mot);
    setModalAnas(anas);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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

        <MotList mots={mots} onMotClick={handleShowAnagrams} />

        <Pagination
          page={page}
          totalPages={totalPages}
          onFirst={() => setPage(1)}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          onLast={() => setPage(totalPages)}
        />

        <p className="mt-3 text-info text-center">
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
