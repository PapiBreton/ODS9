import React, { useState } from "react";
import IconButton from "./IconButton";
import "./styles.css";

export default function MotList({
  mots,
  onMotClick,
  cacherMot,
  setHoveredId,
  enCours,
}) {
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
              {/* Colonne mot (raccourcie à gauche) */}
              <IconButton
                className="mot-col"
                title={hasAnas ? "Voir les anagrammes" : "Aucune anagramme"}
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
              {/* Compteur */}
              <span className="count">
                {hasAnas && <small>{mot.anagramCount}</small>}
              </span>
              {/* Icône définition au milieu */}
              <IconButton
                className="def-col"
                title="Voir définition"
                onClick={() => toggleDefinition(mot._id)}
                ariaExpanded={isOpen}
              >
                <span className={`arrow-icon ${isOpen ? "open" : ""}`}>📖</span>
              </IconButton>

              {/* Bouton cacher à droite */}
              <button
                className="btn btn-outline-danger btn-sm btn-cacher mb-2"
                onClick={() => cacherMot && cacherMot(mot._id)}
                onMouseEnter={() => setHoveredId && setHoveredId(mot._id)}
                onMouseLeave={() => setHoveredId && setHoveredId(null)}
                disabled={enCours === mot._id}
                title="Cacher"
              >
                <span className="d-inline d-sm-none">Cacher</span>
                <span className="d-none d-sm-inline">
                  {enCours === mot._id ? "..." : "Cacher"}
                </span>
              </button>
            </div>

            {/* Définition avec animation */}
            <div
              className={`definition-inline ${isOpen ? "show" : ""}`}
              id={"mot-definition-" + mot._id}
            >
              <small className="text-secondary">{mot.definition}</small>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
