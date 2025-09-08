import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

function ChoreList() {
    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Chore</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Do the dishes</td>
                                <td>Pending</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Take out the trash</td>
                                <td>Completed</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default ChoreList
