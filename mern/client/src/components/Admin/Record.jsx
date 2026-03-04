import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Modal, Toast, ToastContainer, Alert } from "react-bootstrap";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    region: "",
    rating: 0,
    fee: 0,
    sales: 0,
  });

  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;

      setIsNew(false);

      try {
        const response = await fetch(`http://localhost:5050/record/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch agent");

        const json = await response.json();
        setForm(json.data);
      } catch (err) {
        console.error(err);
        navigate("/admin");
      }
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // Open modal instead of immediately submitting
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Confirmed action (Create or Update)
  const handleConfirm = async () => {
    const payload = isNew
      ? form
      : {
          region: form.region,
          rating: form.rating,
          fee: form.fee,
          sales: form.sales,
        };

    try {
      const response = await fetch(
        isNew
          ? "http://localhost:5050/record"
          : `http://localhost:5050/record/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Request failed");

      setToastMessage(isNew ? "Agent created successfully!" : "Agent updated successfully!");
      setToastVariant("success");
      setShowToast(true);

      setShowModal(false);

      // Redirect to agents list after short delay
      setTimeout(() => navigate("/admin/agents"), 1000);
    } catch (err) {
      console.error("Error saving agent:", err);
      setToastMessage("Failed to save agent: " + err.message);
      setToastVariant("danger");
      setShowToast(true);
      setShowModal(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        {isNew ? "Create Agent" : "Edit Agent"}
      </h3>

      <Form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={form.name}
            disabled={!isNew}
            onChange={(e) => updateForm({ name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Region</Form.Label>
          <Form.Select
            value={form.region}
            onChange={(e) => updateForm({ region: e.target.value })}
            required
          >
            <option value="">Select a region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            value={form.rating}
            onChange={(e) => updateForm({ rating: Number(e.target.value) })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Fee</Form.Label>
          <Form.Control
            type="number"
            value={form.fee}
            onChange={(e) => updateForm({ fee: Number(e.target.value) })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Sales</Form.Label>
          <Form.Control
            type="number"
            value={form.sales}
            onChange={(e) => updateForm({ sales: Number(e.target.value) })}
          />
        </Form.Group>

        <Button type="submit" variant="success">
          Save Agent
        </Button>
      </Form>

      {/* ---------- Confirmation Modal ---------- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {isNew ? "Create" : "Update"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {isNew ? "create" : "update"} this agent?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Toast ---------- */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant === "success" ? "success" : "danger"}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}