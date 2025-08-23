import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import PrefixTable from "./PrefixTable";
import Navbar from "../Navbar";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Prefixlist = () => {
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editSolution, setEditSolution] = useState("");
  const [currentLetter, setCurrentLetter] = useState("A");
  const [letterCounts, setLetterCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prefixToDelete, setPrefixToDelete] = useState(null);

  // 🔁 Charger les comptes
  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/prefixes/counts");
      const data = await res.json();
      setLetterCounts(data.counts || data);
    } catch (err) {
      console.error("Erreur lors du chargement des comptes :", err);
    }
  };

  // 🔁 Charger les mots
  const fetchByLetter = async (letter = currentLetter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prefixes/alpha/${letter}`);
      const data = await res.json();
      setPrefixes(data.data);
    } catch (err) {
      console.error("Erreur lors du chargement des mots :", err);
      setPrefixes([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Initialisation
  useEffect(() => {
    fetchCounts();
    fetchByLetter();
  }, []);

  // 🔁 Changement de lettre
  useEffect(() => {
    fetchByLetter();
  }, [currentLetter]);

  const openEditModal = (item) => {
    setSelectedPrefix(item);
    setEditWord(item.word);
    setEditSolution(item.solution);
  };

  const saveEdit = async () => {
    try {
      await fetch(`/api/prefixes/${selectedPrefix._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: editWord, solution: editSolution }),
      });
      setSelectedPrefix(null);
      await fetchByLetter();
      await fetchCounts();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const handleDeleteClick = (item) => {
    setPrefixToDelete(item);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!prefixToDelete || !prefixToDelete._id) {
      console.error("ID de suppression invalide :", prefixToDelete);
      return;
    }

    try {
      await fetch(`/api/prefixes/${prefixToDelete._id}`, { method: "DELETE" });
      await fetchByLetter();
      await fetchCounts();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    } finally {
      setShowConfirmModal(false);
      setPrefixToDelete(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h3 className="mb-4 text-center">📚 Préfixes par lettre</h3>

        <div className="mb-3 d-flex flex-wrap">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`btn me-2 mb-2 ${
                currentLetter === letter
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              disabled={!letterCounts || letterCounts[letter] === 0}
              onClick={() => setCurrentLetter(letter)}
            >
              {letter} ({letterCounts?.[letter] ?? 0})
            </button>
          ))}
        </div>

        <h5 className="mb-3 text-center">
          Lettre sélectionnée : {currentLetter}
        </h5>

        {loading ? (
          <p>Chargement des mots...</p>
        ) : prefixes.length === 0 ? (
          <p>Aucun mot trouvé pour cette lettre.</p>
        ) : (
          <PrefixTable
            prefixes={prefixes}
            onEdit={openEditModal}
            onDelete={handleDeleteClick}
          />
        )}

        {selectedPrefix && (
          <EditModal
            item={selectedPrefix}
            word={editWord}
            solution={editSolution}
            onChangeWord={setEditWord}
            onChangeSolution={setEditSolution}
            onClose={() => setSelectedPrefix(null)}
            onSave={saveEdit}
          />
        )}

        {showConfirmModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmer la suppression</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirmModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Voulez-vous vraiment supprimer le mot{" "}
                    <strong>{prefixToDelete?.word}</strong> ?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Prefixlist;
