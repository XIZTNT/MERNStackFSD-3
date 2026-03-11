import { useEffect, useState } from "react";
import { Table, Form, Button, Modal, Toast, ToastContainer } from "react-bootstrap";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ amount: "", agent_id: "" });

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("success");

  // Fetch last 10 transactions & agents
  useEffect(() => {
    async function fetchData() {
      try {
        const transRes = await fetch("http://localhost:5050/transaction-data");
        if (!transRes.ok) throw new Error("Failed to fetch transactions");
        const transJson = await transRes.json();
        setTransactions(transJson.data || []);

        const agentRes = await fetch("http://localhost:5050/record"); // agents endpoint
        if (!agentRes.ok) throw new Error("Failed to fetch agents");
        const agentJson = await agentRes.json();
        setAgents(agentJson.data || []);
      } catch (err) {
        console.error(err);
        setToastMessage("Error loading data: " + err.message);
        setToastVariant("danger");
        setShowToast(true);
      }
    }
    fetchData();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open modal on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Confirm transaction submission
  const handleConfirm = async () => {
    if (!form.agent_id || form.amount <= 0) {
      setToastMessage("Please select an agent and enter a positive amount.");
      setToastVariant("danger");
      setShowToast(true);
      setShowModal(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/transaction-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: form.agent_id,
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit transaction");

      // Add transaction to table (optional: refetch last 10)
      const agentName = agents.find((a) => a._id === form.agent_id)?.name || "";
      const newTransaction = {
        _id: Date.now(),
        date: new Date().toISOString(),
        amount: Number(form.amount),
        agent_name: agentName,
      };
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]);

      setToastMessage("Transaction submitted successfully!");
      setToastVariant("success");
      setShowToast(true);
      setForm({ amount: "", agent_id: "" });
    } catch (err) {
      console.error(err);
      setToastMessage("Error submitting transaction: " + err.message);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Transactions</h3>

      {/* ---------- Transactions Table ---------- */}
      <div className="border rounded-lg overflow-auto mb-6">
        <Table striped bordered hover size="sm" className="mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleString()}</td>
                  <td>${t.amount}</td>
                  <td>{t.agent_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-2">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ---------- Transaction Form ---------- */}
      <Form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3">
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Agent</Form.Label>
          <Form.Select name="agent_id" value={form.agent_id} onChange={handleChange} required>
            <option value="">Select an agent</option>
            {agents.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success">
          Submit Transaction
        </Button>
      </Form>

      {/* ---------- Confirmation Modal ---------- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to submit this transaction for ${form.amount}?
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