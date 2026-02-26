import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;

      setIsNew(false);

      const response = await fetch(
        `http://localhost:5050/record/${params.id}`
      );

      if (!response.ok) {
        console.error("Failed to fetch agent");
        navigate("/admin");
        return;
      }

      const json = await response.json();
      setForm(json.data);
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

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

      if (!response.ok) {
        throw new Error("Request failed");
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error saving agent:", err);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        {isNew ? "Create Agent" : "Edit Agent"}
      </h3>

      <form onSubmit={onSubmit} className="border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            disabled={!isNew}
            onChange={(e) => updateForm({ name: e.target.value })}
            className="mt-1 block w-full rounded-md border p-2 disabled:bg-slate-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Region</label>
          <select
            value={form.region}
            onChange={(e) => updateForm({ region: e.target.value })}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select a region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Rating</label>
          <input
            type="number"
            value={form.rating}
            onChange={(e) => updateForm({ rating: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Fee</label>
          <input
            type="number"
            value={form.fee}
            onChange={(e) => updateForm({ fee: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sales</label>
          <input
            type="number"
            value={form.sales}
            onChange={(e) => updateForm({ sales: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-md border px-4 py-2 hover:bg-slate-100"
        >
          Save Agent
        </button>
      </form>
    </>
  );
}
