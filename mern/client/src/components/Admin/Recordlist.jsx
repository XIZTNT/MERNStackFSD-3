import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import useSessionCheck from "../../hooks/sessioncheck"; // <-- HOOK SESSION CHECK IMPORT

/* ---------- Single Table Row ---------- */
const Record = ({ record, onDeleteClick }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">
    <td className="p-4 align-middle">{record.name}</td>
    <td className="p-4 align-middle">{record.region}</td>
    <td className="p-4 align-middle">{record.rating}</td>
    <td className="p-4 align-middle">${record.fee}</td>
    <td className="p-4 align-middle">{record.sales}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center h-9 rounded-md px-3 border hover:bg-slate-100"
          to={`/admin/edit/${record._id}`}
        >
          Edit
        </Link>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDeleteClick(record)}
        >
          Delete
        </Button>
      </div>
    </td>
  </tr>
);

/* ---------- Record List ---------- */
export default function RecordList() {
  useSessionCheck(); // <-- SESSION CHECK
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/record");
        if (!response.ok) throw new Error("Failed to fetch agents");

        const json = await response.json();
        if (json.success) setRecords(json.data);
        else throw new Error(json.message || "Unknown backend error");
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getRecords();
  }, []);

  /* ---------- Delete Logic ---------- */
  async function confirmDelete() {
    if (!recordToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5050/record/${recordToDelete._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete agent");

      setRecords((prev) =>
        prev.filter((record) => record._id !== recordToDelete._id)
      );

      setToastMessage(`Deleted agent: ${recordToDelete.name}`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to delete agent: " + err.message);
      setShowToast(true);
    } finally {
      setShowModal(false);
      setRecordToDelete(null);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Rocket Elevators – Agents</h3>
      {/* ---------- Create Employee Button ---------- */}
      <div className="flex justify-end px-4 mb-4">
        <NavLink
          className="inline-flex items-center justify-center text-md font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to="/admin/create"
        >
          Create Agent
        </NavLink>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr>
                <th className="h-12 px-4 text-left">Name</th>
                <th className="h-12 px-4 text-left">Region</th>
                <th className="h-12 px-4 text-left">Rating</th>
                <th className="h-12 px-4 text-left">Fee</th>
                <th className="h-12 px-4 text-left">Sales</th>
                <th className="h-12 px-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading agents...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <Record
                    key={record._id}
                    record={record}
                    onDeleteClick={(r) => {
                      setRecordToDelete(r);
                      setShowModal(true);
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Delete Confirmation Modal ---------- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{recordToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No / Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes / Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Toast ---------- */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}