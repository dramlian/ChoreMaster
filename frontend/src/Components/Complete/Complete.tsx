import { Container, Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap';   
import { useState, useEffect } from 'react';
import type { ChoreResponseDto } from '../../Models/ChoreResponseDto';
import type { User } from '../../Models/User';
import type { CompleteChoreDto } from '../../Models/CompleteChoreDto';
import { useApi } from '../../contexts/ApiContext';

interface CompleteProps {
    show: boolean;
    onHide: () => void;
    chore: ChoreResponseDto | null;
    onCompleted?: () => void;
}

function Complete({ show, onHide, chore, onCompleted }: CompleteProps) {
    const { getAllUsers, completeChore } = useApi();
    const [users, setUsers] = useState<User[]>([]);
    const [completeData, setCompleteData] = useState<CompleteChoreDto>({
        choreId: chore?.id || 0,
        fromUserId: chore?.assignedTo.id || 0,
        toUserId: undefined
    });


    useEffect(() => {
        if (chore) {
            setCompleteData({
                choreId: chore.id,
                fromUserId: chore.assignedTo.id || 0,
                toUserId: undefined
            });
        }
    }, [chore]);

    useEffect(() => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value) || undefined;
        
        setCompleteData(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            console.log('Complete Payload:', JSON.stringify(completeData, null, 2));
            const result = await completeChore(completeData);
            console.log('Chore completed successfully:', result);
            

            if (onCompleted) {
                onCompleted();
            }
            
            onHide();
        } catch (error) {
            console.error('Error completing chore:', error);
            alert('Failed to complete chore. Please try again.');
        }
    };

    const currentUser = users.find(user => user.id === chore?.assignedTo.id);

    if (!chore) {
        return null;
    }

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Complete Chore</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col>
                            <Alert variant="info">
                                <strong>Completing Chore:</strong> {chore.name}
                            </Alert>
                            
                            <Form className='mt-3' onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="fromUserId">
                                    <Form.Label>From User (Current Assignee)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={currentUser ? `${currentUser.username} (${currentUser.email})` : 'Unknown User'}
                                        disabled
                                    />
                                    <Form.Text className="text-muted">
                                        This is the user currently assigned to the chore.
                                    </Form.Text>
                                </Form.Group>

                                {chore.isReassignedable && (
                                    <Form.Group className="mb-3" controlId="toUserId">
                                        <Form.Label>Reassign To (Optional)</Form.Label>
                                        <Form.Select 
                                            name="toUserId"
                                            value={completeData.toUserId || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Keep current assignment</option>
                                            {users
                                                .filter(user => user.id !== chore.assignedTo.id) // Don't show current assignee
                                                .map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.username} ({user.email})
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                        <Form.Text className="text-muted">
                                            Optionally reassign this chore to another user after completion.
                                        </Form.Text>
                                    </Form.Group>
                                )}

                                {!chore.isReassignedable && (
                                    <Alert variant="warning">
                                        This chore cannot be reassigned to another user.
                                    </Alert>
                                )}

                                <Button 
                                    variant="success" 
                                    type="submit" 
                                >
                                    Complete Chore
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default Complete;
