import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useApi } from '../../contexts/ApiContext';

interface DeleteProps {
    show: boolean;
    onHide: () => void;
    choreId: number | null;
    onDeleteSuccess?: () => void;
}

function Delete({ show, onHide, choreId, onDeleteSuccess }: DeleteProps) {
    const { deleteChore } = useApi();
    const [loading, setLoading] = useState<boolean>(false);

    const handleConfirmDelete = async () => {
        if (choreId === null) return;

        setLoading(true);
        try {
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
        } finally {
            setLoading(false);
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
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Delete;
