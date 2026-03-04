import { Card, Row, Col, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Agent Management</Card.Title>
              <Card.Text>
                View, create, edit and delete agents.
              </Card.Text>
              <Button
                variant="primary"
                className="mt-auto"
                onClick={() => navigate("/admin/agents")}
              >
                Go to Agents
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Transactions</Card.Title>
              <Card.Text>
                View the latest transactions and create new ones.
              </Card.Text>
              <Button
                variant="success"
                className="mt-auto"
                onClick={() => navigate("/admin/transaction")}
              >
                Go to Transactions
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;