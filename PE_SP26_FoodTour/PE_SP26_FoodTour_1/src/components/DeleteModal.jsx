import { Modal, Button } from 'react-bootstrap';

function DeleteModal({ show, tourName, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-6 fw-bold w-100 text-center">Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-3">
        Are you sure you want to delete tour {tourName}?
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center pb-4 gap-5">
        <Button id="btnConfirmYes" variant="secondary" onClick={onConfirm}>
          Yes
        </Button>
        <Button id="btnConfirmClose" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
