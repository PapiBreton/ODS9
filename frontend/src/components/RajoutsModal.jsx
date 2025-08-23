import { Modal, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "./styles.css";
const RajoutsModal = ({ show, handleClose, mots, motPourRajouts }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rajouts</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mots.length === 0 ? (
          <p>
            Aucun rajout trouvé avec{" "}
            <span className="fw-bold">{motPourRajouts}</span>.
          </p>
        ) : (
          <ListGroup>
            {mots.map((mot, index) => (
              <ListGroup.Item key={index}>{mot}</ListGroup.Item>
            ))}
          </ListGroup>
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
