
import { Container, Button, Form, Row, Col } from 'react-bootstrap';   
import { useState, useEffect } from 'react';
import type { ChoreDto } from '../../Models/ChoreDto';
import type { User } from '../../Models/User';

function Manage() {
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
                const response = await fetch('http://localhost:5272/api/users/all');
                if (response.ok) {
                    const userData = await response.json();
                    setUsers(userData);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

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
            const response = await fetch('http://localhost:5272/api/chores/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Chore created successfully:', result);
                // Reset form
                setChoreData({
                    name: '',
                    threshold: 0,
                    assignedToUserID: 0,
                    isReassignedable: true
                });
            } else {
                console.error('Failed to create chore:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating chore:', error);
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
