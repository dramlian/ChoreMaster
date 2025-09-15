import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import type { ChoreResponseDto } from '../../Models/ChoreResponseDto';
import type { User } from '../../Models/User';
import Manage from '../Manage/Manage';
import Complete from '../Complete/Complete';
import Delete from '../Delete/Delete';
import { useApi } from '../../contexts/ApiContext';
import History from '../History/History';

function ChoreList() {
    const { getAllChores, getChoresByUser, getAllUsers } = useApi();
    const [chores, setChores] = useState<ChoreResponseDto[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showManageModal, setShowManageModal] = useState<boolean>(false);
    const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
    const [editChore, setEditChore] = useState<ChoreResponseDto | undefined>(undefined);
    const [completeChore, setCompleteChore] = useState<ChoreResponseDto | null>(null);
    const [deleteChoreId, setDeleteChoreId] = useState<number | null>(null);
    const [choreHistoryId, setChoreHistoryId] = useState<number | null>(null);

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
    }, [selectedUserId, refreshTrigger, getAllChores, getChoresByUser]); // Re-fetch when selectedUserId changes or refresh is triggered

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserId(parseInt(e.target.value) || 0);
    };

    const handleDeleteChore = (choreId: number) : void => {
        setDeleteChoreId(choreId);
        setShowDeleteModal(true);
    };

    const handleDeleteSuccess = (deletedChoreId: number) : void => {
        // Remove the deleted chore from the state
        setChores(prevChores => prevChores.filter(chore => chore.id !== deletedChoreId));
        setRefreshTrigger(prev => !prev);
    };

    const handleManageSuccess = () : void => {
        setRefreshTrigger(prev => !prev);
    };

    const handleCompleteSuccess = () : void => {
        setRefreshTrigger(prev => !prev);
    };

    const handleShowManageModal = () : void => {
        setEditChore(undefined);
        setShowManageModal(true);
    };

    const handleShowEditModal = (chore: ChoreResponseDto) : void => {
        setEditChore(chore);
        setShowManageModal(true);
    };

    const handleShowCompleteModal = (chore: ChoreResponseDto)  : void => {
        setCompleteChore(chore);
        setShowCompleteModal(true);
    };

    const handleCloseManageModal = () : void => {
        setShowManageModal(false);
        setEditChore(undefined);
    };

    const handleCloseCompleteModal = () : void => {
        setShowCompleteModal(false);
        setCompleteChore(null);
    };

    const handleCloseDeleteModal = () : void => {
        setShowDeleteModal(false);
        setDeleteChoreId(null);
    };

    function handleChoreHistory(id: number): void {
        setShowHistoryModal(true);
        setChoreHistoryId(id);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const formatTimeLeft = (timeLeft: string) => {
        const isOverdue = timeLeft.startsWith('-');

        const match = timeLeft.match(/(?:(\d+)\.)?(\d+):/);
        let totalDays = match && match[1] ? parseInt(match[1]) : 0;
        const totalHours = match ? parseInt(match[2]) : 0;


        if (!isOverdue && totalDays === 0) {
            return `Due Soon (${totalHours}h)`;
        }

        if (totalDays !== 0 && totalHours >= 12) {
            totalDays += 1;
        }

        return isOverdue ? `Overdue (${totalDays}d)` : `${totalDays}d`;
    };

    const isNotDisplayedOnPhone = () : boolean => {
        return window.innerWidth > 768; // Example breakpoint for mobile devices
    }

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
                        <Button variant="success" onClick={handleShowManageModal}>
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
                                {isNotDisplayedOnPhone() && <th>ID</th>}
                                <th>Name</th>
                                {isNotDisplayedOnPhone() && <th>Last Completed</th>}
                                {isNotDisplayedOnPhone() && <th>Threshold (days)</th>}
                                <th>Time Left</th>
                                {isNotDisplayedOnPhone() && <th>Reassignable</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chores.map((chore) => (
                                <tr key={chore.id}>
                                    {isNotDisplayedOnPhone() && <td>{chore.id}</td>}
                                    <td>{chore.name}</td>
                                    {isNotDisplayedOnPhone() && <td>{formatDate(chore.lastCompleted)}</td>}
                                    {isNotDisplayedOnPhone() && <td>{chore.threshold}</td>}
                                    <td className={chore.timeLeft.startsWith('-') ? 'text-danger' : 'text-success'}>
                                        {formatTimeLeft(chore.timeLeft)}
                                    </td>
                                    {isNotDisplayedOnPhone() && <td>{chore.isReassignedable ? 'Yes' : 'No'}</td>}
                                    <td className="d-flex flex-column gap-1">
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
                                            className="me-2"
                                            onClick={() => handleDeleteChore(chore.id)}
                                        >
                                            Delete
                                        </Button>

                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleChoreHistory(chore.id)}
                                        >
                                            History
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Manage Chore Modal */}
            <Manage 
                show={showManageModal}
                onHide={handleCloseManageModal}
                onChoreCreated={handleManageSuccess}
                editChore={editChore}
            />

            {/* Complete Chore Modal */}
            <Complete 
                show={showCompleteModal}
                onHide={handleCloseCompleteModal}
                chore={completeChore}
                onCompleted={handleCompleteSuccess}
            />

            {/* Delete Confirmation Modal */}
            <Delete
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                choreId={deleteChoreId}
                onDeleteSuccess={() => deleteChoreId && handleDeleteSuccess(deleteChoreId)}
            />

            <History showHistoryModal={showHistoryModal} setShowHistoryModal={setShowHistoryModal} choreId={choreHistoryId} />
        </Container>
    )
}

export default ChoreList