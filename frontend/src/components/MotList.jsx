import React, { useState, useEffect, useRef } from "react";
import "./MotList.css";

function MotList({ mots, onMotClick }) {
  const [listeMots, setListeMots] = useState([]);
  const [enCours, setEnCours] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (mots) {
      setListeMots(mots);
    }
  }, [mots]);

  const cacherMot = async (id) => {
    setEnCours(id);

    const ref = itemRefs.current[id];
    if (ref) {
      ref.classList.add("fade-out");
    }

    setTimeout(async () => {
      try {
        const response = await fetch(`/api/mots/${id}/cacher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Erreur lors de la requête");

        setListeMots((prev) => prev.filter((mot) => mot._id !== id));
      } catch (error) {
        console.error("Erreur :", error.message);
      } finally {
        setEnCours(null);
      }
    }, 500); // durée identique à la transition CSS
  };

  return (
    <ul className="list-group">
      {listeMots.map((mot, index) => (
        <li
          className="list-group-item pb-0"
          key={mot._id}
          ref={(el) => (itemRefs.current[mot._id] = el)}
          style={{
            transition: "all 0.5s ease",
            backgroundColor:
              hoveredId === mot._id
                ? "#dac27dff" // couleur survolée
                : index % 2 === 0
                ? "#f9f9f9"
                : "#e0e0e0",
          }}
        >
          <span
            className="text-primary fw-bold cursor-pointer"
            onClick={() => onMotClick(mot.mot)}
          >
            {mot.mot}
          </span>
          <span className="text-primary ms-2">{" : "}</span>
          <small className="text-muted ms-2">{mot.definition}</small>
          <button
            className="btn btn-outline-warning btn-sm mb-1 d-flex justify-content-end float-end"
            onClick={() => cacherMot(mot._id)}
            onMouseEnter={() => setHoveredId(mot._id)}
            onMouseLeave={() => setHoveredId(null)}
            disabled={enCours === mot._id}
          >
            {enCours === mot._id ? "..." : "Cacher"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default MotList;
