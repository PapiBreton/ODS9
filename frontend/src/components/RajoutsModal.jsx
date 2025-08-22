import { Modal, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "./styles.css";
const RajoutsModal = ({ show, handleClose, mots }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rajouts trouvés</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mots.length === 0 ? (
          <p>Aucun rajout trouvé.</p>
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
