import React, { useState } from "react";
import IconButton from "./IconButton";
import "./styles.css";

export default function MotList({ mots, onMotClick, onRajoutsClick }) {
  const [openDefs, setOpenDefs] = useState({});

  const toggleDefinition = (id) => {
    setOpenDefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ul className="list-group">
      {mots.map((mot) => {
        const isOpen = !!openDefs[mot._id];
        const hasAnas = mot.anagramCount > 1;

        return (
          <li className="list-group-item pb-0 li-mot" key={mot._id}>
            <div className="ligne-principale">
              {/* Colonne mot */}
              <IconButton
                className="mot-col"
                onClick={() => hasAnas && onMotClick(mot.normalized)}
                disabled={!hasAnas}
              >
                <span
                  className={`mot-texte fw-bold ${
                    hasAnas ? "text-primary" : "text-black"
                  }`}
                >
                  {mot.mot}
                </span>
              </IconButton>

              {/* Compteur d'anagrammes */}
              <span className="count">
                {hasAnas && <small>{mot.anagramCount}</small>}
              </span>

              {/* Icône définition */}
              <IconButton
                className="def-col"
                title="Voir définition"
                onClick={() => toggleDefinition(mot._id)}
                ariaExpanded={isOpen}
              >
                <span className={`arrow-icon ${isOpen ? "open" : ""}`}>📖</span>
              </IconButton>

              {/* Bouton Rajouts */}
              <button
                className="btn btn-outline-danger btn-sm btn-cacher mb-2"
                onClick={() => onRajoutsClick(mot.mot)}
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
                {mot.definition || "Pas de définition disponible."}
              </small>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
