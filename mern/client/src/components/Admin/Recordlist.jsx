import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Single Table Row ---------- */
// Displays a single agent record as a table row
const Record = ({ record, deleteRecord }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">
    <td className="p-4 align-middle">{record.name}</td>
    <td className="p-4 align-middle">{record.region}</td>
    <td className="p-4 align-middle">{record.rating}</td>
    <td className="p-4 align-middle">${record.fee}</td>
    <td className="p-4 align-middle">{record.sales}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        {/* Edit button navigates to the edit page for this agent */}
        <Link
          className="inline-flex items-center justify-center h-9 rounded-md px-3 border hover:bg-slate-100"
          to={`/admin/edit/${record._id}`}
        >
          Edit
        </Link>

        {/* Delete button calls deleteRecord handler */}
        <button
          className="inline-flex items-center justify-center h-9 rounded-md px-3 border hover:bg-slate-100"
          type="button"
          onClick={() => deleteRecord(record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

/* ---------- Record List ---------- */
// Main component that fetches and displays all agents in a table
export default function RecordList() {
  // State for all agent records
  const [records, setRecords] = useState([]);
  // Loading state for fetch
  const [loading, setLoading] = useState(true);
  // Error state for fetch
  const [error, setError] = useState(null);

  // Fetch agents once on component mount
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/record");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }

        const json = await response.json();

        // Update state with the array of agents from backend
        if (json.success) {
          setRecords(json.data); // <-- important: new API wraps data in json.data
        } else {
          throw new Error(json.message || "Unknown backend error");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getRecords();
  }, []);

  // Delete agent by ID
  async function deleteRecord(id) {
    try {
      const response = await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete agent");
      }

      // Remove deleted agent from state so UI updates
      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete agent: " + err.message);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Rocket Elevators – Agents
      </h3>

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
                // Map over the array of agents and render a row for each
                records.map((record) => (
                  <Record
                    key={record._id}
                    record={record}
                    deleteRecord={deleteRecord}
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
    </>
  );
}
