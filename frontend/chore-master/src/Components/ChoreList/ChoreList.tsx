import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import type { ChoreResponseDto } from '../../Models/ChoreResponseDto';
import type { User } from '../../Models/User';
import Manage from '../Manage/Manage';
import Complete from '../Complete/Complete';
import { useApi } from '../../contexts/ApiContext';

function ChoreList() {
    const { getAllChores, getChoresByUser, deleteChore, getAllUsers } = useApi();
    const [chores, setChores] = useState<ChoreResponseDto[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
    const [modalClosed, setModalClosed] = useState<boolean>(false);
    const [editChore, setEditChore] = useState<ChoreResponseDto | undefined>(undefined);
    const [completeChore, setCompleteChore] = useState<ChoreResponseDto | undefined>(undefined);

    useEffect(() => {
        // Fetch users when component mounts
        const fetchUsers = async () => {
            try {
                const userData = await getAllUsers();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [getAllUsers]);

    useEffect(() => {
        const fetchChores = async () => {
            setLoading(true);
            try {
                let data: ChoreResponseDto[];
                if (selectedUserId === 0) {
                    data = await getAllChores();
                } else {
                    data = await getChoresByUser(selectedUserId);
                }
                setChores(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchChores();
    }, [selectedUserId, modalClosed, getAllChores, getChoresByUser]); // Re-fetch when selectedUserId changes or modal closes

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserId(parseInt(e.target.value) || 0);
    };

    const handleDeleteChore = async (choreId: number) => {
        if (!window.confirm('Are you sure you want to delete this chore?')) {
            return;
        }

        try {
            const success = await deleteChore(choreId);
            if (success) {
                // Remove the deleted chore from the state
                setChores(prevChores => prevChores.filter(chore => chore.id !== choreId));
                console.log(`Chore ${choreId} deleted successfully`);
            } else {
                console.error('Failed to delete chore');
                alert('Failed to delete chore. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting chore:', error);
            alert('Error deleting chore. Please try again.');
        }
    };

    const handleShowModal = () => {
        setEditChore(undefined);
        setShowModal(true);
    };

    const handleShowEditModal = (chore: ChoreResponseDto) => {
        setEditChore(chore);
        setShowModal(true);
    };

    const handleShowCompleteModal = (chore: ChoreResponseDto) => {
        setCompleteChore(chore);
        setShowCompleteModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditChore(undefined);
        setModalClosed(prev => !prev); // Toggle flag to trigger useEffect
    };

    const handleCloseCompleteModal = () => {
        setShowCompleteModal(false);
        setCompleteChore(undefined);
        setModalClosed(prev => !prev); // Toggle flag to trigger useEffect
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const formatTimeLeft = (timeLeft: string) => {
        const isOverdue = timeLeft.startsWith('-');
        // Extract just the hours part using regex
        const match = timeLeft.match(/(\d+)\.(\d+):/);
        const totalHours = match ? parseInt(match[1]) * 24 + parseInt(match[2]) : 0;
        
        return isOverdue ? `Overdue (${totalHours}h)` : `${totalHours}h`;
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <p>Loading chores...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <p className="text-danger">Error loading chores: {error}</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Chore List</h2>
                        <Button variant="success" onClick={handleShowModal}>
                            Create Chore
                        </Button>
                    </div>

                    <Form.Group className="mb-3" controlId="userFilter">
                        <Form.Label>Filter by User</Form.Label>
                        <Form.Select 
                            value={selectedUserId}
                            onChange={handleUserChange}
                        >
                            <option value={0}>All Users</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.email})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Last Completed</th>
                                <th>Threshold (days)</th>
                                <th>Time Left</th>
                                <th>Reassignable</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chores.map((chore) => (
                                <tr key={chore.id}>
                                    <td>{chore.id}</td>
                                    <td>{chore.name}</td>
                                    <td>{formatDate(chore.lastCompleted)}</td>
                                    <td>{chore.threshold}</td>
                                    <td className={chore.timeLeft.startsWith('-') ? 'text-danger' : 'text-success'}>
                                        {formatTimeLeft(chore.timeLeft)}
                                    </td>
                                    <td>{chore.isReassignedable ? 'Yes' : 'No'}</td>
                                    <td>
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowCompleteModal(chore)}
                                        >
                                            Complete
                                        </Button>
                                        <Button 
                                            variant="warning" 
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowEditModal(chore)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleDeleteChore(chore.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Create/Edit Chore Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editChore ? 'Edit Chore' : 'Create New Chore'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Manage 
                        onChoreCreated={handleCloseModal} 
                        editChore={editChore}
                    />
                </Modal.Body>
            </Modal>

            {/* Complete Chore Modal */}
            <Modal show={showCompleteModal} onHide={handleCloseCompleteModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Complete Chore</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {completeChore && (
                        <Complete 
                            chore={completeChore}
                            onCompleted={handleCloseCompleteModal} 
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default ChoreList