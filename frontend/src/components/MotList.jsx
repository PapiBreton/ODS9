// src/components/MotList.jsx
import { useState, memo } from "react";
import IconButton from "./IconButton";
import RajoutsModal from "./RajoutsModal";
import "./styles.css";

function MotList({ mots, onMotClick }) {
  // MODAL RAJOUTS
  const [rajoutsModal, setRajoutsModal] = useState({
    visible: false,
    mot: "",
    motsRajoutes: [],
  });

  // Ouvre la modale avec les rajouts pour un mot donné
  const handleShowRajouts = async (motTexte) => {
    try {
      const res = await fetch(
        `/api/dicoComplet/${encodeURIComponent(motTexte)}`
      );
      if (!res.ok) throw new Error("Erreur réseau");
      const result = await res.json();
      setRajoutsModal({
        visible: true,
        mot: motTexte,
        motsRajoutes: result.data || [],
      });
    } catch {
      setRajoutsModal({
        visible: true,
        mot: motTexte,
        motsRajoutes: [],
      });
    }
  };

  const handleCloseRajouts = () => {
    setRajoutsModal({
      visible: false,
      mot: "",
      motsRajoutes: [],
    });
  };
  // Définition de l'état pour gérer l'affichage des définitions
  const [openDefs, setOpenDefs] = useState({});

  const toggleDefinition = (id) => {
    setOpenDefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <>
      <ul className="list-group">
        {mots.map(({ id, mot, definition, anagramCount, normalized }) => {
          const isOpen = !!openDefs[id];
          const hasAnas = anagramCount > 1;
          return (
            <li key={id} className="list-group-item pb-0 li-mot">
              <div className="ligne-principale">
                {/* Colonne mot */}
                <IconButton
                  className="mot-col"
                  onClick={() => hasAnas && onMotClick(normalized)}
                  disabled={!hasAnas}
                >
                  <span
                    className={`mot-texte fw-bold ${
                      hasAnas ? "text-primary" : "text-black"
                    }`}
                  >
                    {mot}
                  </span>
                </IconButton>

                {/* Compteur d'anagrammes */}
                <span className="count">
                  {hasAnas && <small>+ {anagramCount - 1}</small>}
                </span>

                {/* Icône définition */}
                <IconButton
                  className="def-col"
                  title="Voir définition"
                  onClick={() => toggleDefinition(id)}
                  ariaExpanded={isOpen}
                >
                  <span className={`arrow-icon ${isOpen ? "open" : ""}`}>
                    📖
                  </span>
                </IconButton>

                {/* Bouton Rajouts */}
                <button
                  className="btn btn-outline-danger btn-sm btn-cacher mb-2"
                  onClick={() => handleShowRajouts(mot)}
                  title="Rajouts"
                >
                  <span className="d-inline d-sm-none">Rajouts</span>
                  <span className="d-none d-sm-inline">Rajouts</span>
                </button>
              </div>

              {/* Définition affichée */}
              <div
                className={`definition-inline ${isOpen ? "show" : ""}`}
                id={"mot-definition-" + mot._id}
              >
                <small className="text-secondary">
                  {definition || "Pas de définition disponible."}
                </small>
              </div>
            </li>
          );
        })}
      </ul>

      {rajoutsModal.visible && (
        <RajoutsModal
          show={rajoutsModal.visible}
          handleClose={handleCloseRajouts}
          mots={rajoutsModal.motsRajoutes}
          motPourRajouts={rajoutsModal.mot}
        />
      )}
    </>
  );
}

// Empêche le re-rendu si les props n'ont pas changé
export default memo(MotList, (prevProps, nextProps) => {
  return (
    prevProps.mots === nextProps.mots &&
    prevProps.onMotClick === nextProps.onMotClick
  );
});
