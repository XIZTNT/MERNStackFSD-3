import { Card, Row, Col, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useSessionCheck from "../../hooks/sessioncheck"; // <-- HOOK SESSION CHECK IMPORT

const AdminHome = () => {
  const navigate = useNavigate();

  useSessionCheck(); // <-- SESSION CHECK
  
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="justify-content-center">
        {/* Agents Card */}
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

        {/* Transactions Card */}
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

        {/* Reports Card */}
        <Col md={5} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Reports</Card.Title>
              <Card.Text>
                View agent and transaction reports with charts.
              </Card.Text>
              <Button
                variant="info"
                className="mt-auto"
                onClick={() => navigate("/admin/report")}
              >
                Go to Reports
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;