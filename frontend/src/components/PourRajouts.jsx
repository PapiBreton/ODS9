import React, { useState } from "react";
import RajoutsModal from "./RajoutsModal";

const RechercheRajouts = () => {
  const [mot, setMot] = useState("");
  const [rajouts, setRajouts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const chercherRajouts = async () => {
    try {
      const res = await fetch(`/api/dicoComplet/${encodeURIComponent(mot)}`);
      const result = await res.json();
      setRajouts(result.data || []);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur:", err);
      setRajouts([]);
      setShowModal(true);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Recherche de rajouts</h2>
      <input
        type="text"
        id="mot-input-rajouts"
        className="form-control mb-2"
        value={mot}
        onChange={(e) => setMot(e.target.value)}
        placeholder="Entrez un mot"
      />
      <button className="btn btn-primary" onClick={chercherRajouts}>
        Rechercher
      </button>

      <RajoutsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        mots={rajouts}
      />
    </div>
  );
};

export default RechercheRajouts;
