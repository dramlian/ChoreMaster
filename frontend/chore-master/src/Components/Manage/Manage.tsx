
import { Container, Button, Form, Row, Col, Modal } from 'react-bootstrap';   
import { useState, useEffect } from 'react';
import type { ChoreDto } from '../../Models/ChoreDto';
import type { ChoreResponseDto } from '../../Models/ChoreResponseDto';
import type { User } from '../../Models/User';
import { useApi } from '../../contexts/ApiContext';

interface ManageProps {
    show: boolean;
    onHide: () => void;
    onChoreCreated?: () => void;
    editChore?: ChoreResponseDto;
}

function Manage({ show, onHide, onChoreCreated, editChore }: ManageProps) {
    const { createChore, updateChore, getAllUsers } = useApi();
    const isEditMode = Boolean(editChore); // Determine edit mode from presence of editChore
    const [choreData, setChoreData] = useState<ChoreDto>({
        name: '',
        threshold: 0,
        assignedToUserID: 0,
        isReassignedable: true
    });

    const [users, setUsers] = useState<User[]>([]);

    // Initialize form with edit data when in edit mode
    useEffect(() => {
        if (editChore) {
            setChoreData({
                name: editChore.name,
                threshold: editChore.threshold,
                assignedToUserID: editChore.assignedTo.id || 0,
                isReassignedable: editChore.isReassignedable
            });
        }
    }, [editChore]);

    // Fetch users when component mounts
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

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        
        let newValue;
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number' || name === 'assignedToUserID') {
            newValue = parseInt(value) || 0;
        } else {
            newValue = value;
        }
        
        setChoreData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            let result;
            if (isEditMode && editChore) {
                // Create edit payload without assigned user
                const editPayload = {
                    name: choreData.name,
                    threshold: choreData.threshold,
                    isReassignedable: choreData.isReassignedable
                };
                console.log('Edit Payload:', JSON.stringify(editPayload, null, 2));
                result = await updateChore(editChore.id, editPayload);
                console.log('Chore updated successfully:', result);
            } else {
                // Create the full JSON payload for creation
                const payload: ChoreDto = {
                    name: choreData.name,
                    threshold: choreData.threshold,
                    assignedToUserID: choreData.assignedToUserID,
                    isReassignedable: choreData.isReassignedable
                };
                console.log('Create Payload:', JSON.stringify(payload, null, 2));
                result = await createChore(payload);
                console.log('Chore created successfully:', result);
            }
            
            // Reset form only in create mode
            if (!isEditMode) {
                setChoreData({
                    name: '',
                    threshold: 0,
                    assignedToUserID: 0,
                    isReassignedable: true
                });
            }
            
            // Call the callback if provided (this will trigger refresh)
            if (onChoreCreated) {
                onChoreCreated();
            }
            
            // Close the modal
            onHide();
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} chore:`, error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} chore. Please try again.`);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Chore' : 'Create New Chore'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col>
                            <Form className='mt-3' onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="choreName">
                                    <Form.Label>Chore Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter chore name" 
                                        name="name"
                                        value={choreData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="choreThreshold">
                                    <Form.Label>Threshold (days)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="Enter threshold in days"
                                        name="threshold"
                                        value={choreData.threshold}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>

                                {!isEditMode && (
                                    <Form.Group className="mb-3" controlId="assignedUserId">
                                        <Form.Label>Assigned User</Form.Label>
                                        <Form.Select 
                                            name="assignedToUserID"
                                            value={choreData.assignedToUserID}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.username} ({user.email})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3" controlId="isReassignedable">
                                    <Form.Check 
                                        type="checkbox" 
                                        label="Is Reassignedable"
                                        name="isReassignedable"
                                        checked={choreData.isReassignedable}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    {isEditMode ? 'Update Chore' : 'Create Chore'}
                                </Button>
                            </Form>

                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default Manage;
