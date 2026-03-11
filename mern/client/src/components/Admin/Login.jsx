import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Toast, ToastContainer, Card } from "react-bootstrap";
import { loginUser } from "../../services/loginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
//After login, user is stored and displayed in the navbar. A toast also confirms successful login before redirecting to the admin dashboard.
    try {
      const data = await loginUser(email, password);

      // Save user for navbar display
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setSuccess("Login successful!");
      setShowToast(true);

      // Small delay so user sees success message
      setTimeout(() => {
        navigate("/admin");
        //Wait 1.5 seconds before hiding the toast to ensure it shows on the admin page
      }, 1500);

    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <Card className="mx-auto mt-5" style={{ width: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Rocket Elevators Employee Login
          </Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">
            Welcome back!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Login;