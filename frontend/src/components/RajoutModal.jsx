import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./styles.css"; // Assure-toi que ce fichier contient les styles personnalisés

const RajoutsModal = ({ show, handleClose, mots }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🔤 Rajouts trouvés</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mots.length === 0 ? (
          <p className="text-muted text-center">Aucun rajout trouvé.</p>
        ) : (
          <div className="rajouts-grid">
            {mots.map((mot, index) => (
              <span key={index} className="rajout-badge">
                {mot}
              </span>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RajoutsModal;
