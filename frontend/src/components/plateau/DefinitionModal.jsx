import { Modal, Button } from "react-bootstrap";
import "./anagrammesJeu.css"; // Ton animation personnalisée

export default function DefinitionModal({ mot, definition, show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered animation>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="text-dark fw-bold">{mot}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {definition ? (
          <p>{definition}</p>
        ) : (
          <p className="text-muted">Chargement de la définition...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
