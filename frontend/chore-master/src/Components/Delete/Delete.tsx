import { Modal, Button } from 'react-bootstrap';
import { useApi } from '../../contexts/ApiContext';

interface DeleteProps {
    show: boolean;
    onHide: () => void;
    choreId: number | null;
    onDeleteSuccess?: () => void;
}

function Delete({ show, onHide, choreId, onDeleteSuccess }: DeleteProps) {
    const { deleteChore } = useApi();

    const handleConfirmDelete = async () => {
        try {
            if (choreId === null) return;
            const success = await deleteChore(choreId);
            if (success) {
                console.log(`Chore ${choreId} deleted successfully`);
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
                onHide();
            } else {
                console.error('Failed to delete chore');
                alert('Failed to delete chore. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting chore:', error);
            alert('Error deleting chore. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this chore?</p>
                <p className="text-muted">This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Delete;
