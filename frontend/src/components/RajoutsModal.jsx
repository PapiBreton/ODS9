// src/components/RajoutsModal.jsx
import { Modal, Button } from "react-bootstrap";

export default function RajoutsModal({
  show,
  handleClose,
  mots,
  motPourRajouts,
}) {
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          Rajouts possibles pour{" "}
          <span className="text-primary">{motPourRajouts}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {mots && mots.length > 0 ? (
          <ul className="list-group">
            {mots.map((mot, index) => {
              // Gestion des deux formats : string ou objet
              const texteMot =
                typeof mot === "object" && mot !== null ? mot.mot : mot;

              return (
                <li key={`${texteMot}-${index}`} className="list-group-item">
                  {texteMot}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted mb-0">Aucun rajout trouvé pour ce mot.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
