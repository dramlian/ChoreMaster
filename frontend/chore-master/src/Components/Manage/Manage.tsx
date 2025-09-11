
import { Container, Button, Form, Row, Col } from 'react-bootstrap';   
import { useState, useEffect } from 'react';
import type { ChoreDto } from '../../Models/ChoreDto';
import type { User } from '../../Models/User';
import { useApi } from '../../contexts/ApiContext';

interface ManageProps {
    onChoreCreated?: () => void;
}

function Manage({ onChoreCreated }: ManageProps) {
    const { createChore, getAllUsers } = useApi();
    const [choreData, setChoreData] = useState<ChoreDto>({
        name: '',
        threshold: 0,
        assignedToUserID: 0,
        isReassignedable: true
    });

    const [users, setUsers] = useState<User[]>([]);

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
        
        // Create the JSON payload
        const payload: ChoreDto = {
            name: choreData.name,
            threshold: choreData.threshold,
            assignedToUserID: choreData.assignedToUserID,
            isReassignedable: choreData.isReassignedable
        };

        console.log('JSON Payload:', JSON.stringify(payload, null, 2));
        
        try {
            const result = await createChore(payload);
            console.log('Chore created successfully:', result);
            // Reset form
            setChoreData({
                name: '',
                threshold: 0,
                assignedToUserID: 0,
                isReassignedable: true
            });
            // Call the callback if provided
            if (onChoreCreated) {
                onChoreCreated();
            }
        } catch (error) {
            console.error('Error creating chore:', error);
            alert('Failed to create chore. Please try again.');
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="mt-3">Create New Chore</h2>
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

                        <Form.Group className="mb-3" controlId="assignedUserId">
                            <Form.Label>Assigned User</Form.Label>
                            <Form.Select 
                                name="assignedToUserID"
                                value={choreData.assignedToUserID}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0}>
                                    Select a user
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

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
                            Create Chore
                        </Button>
                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default Manage;
