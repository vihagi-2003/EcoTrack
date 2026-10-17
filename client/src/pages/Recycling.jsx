import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const categories = [
  "Organic",
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Electronic",
  "Other",
];

export default function Recycling() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    category: "Plastic",
    quantity: "1",
    partner: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadRecords = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/recycling");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.records ||
          response.data?.recyclings ||
          [];

      setRecords(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load recycling records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadRecords();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const quantity = Number(form.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Please enter a quantity greater than zero.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/recycling", {
        category: form.category,
        quantity,
        partner: form.partner.trim(),
      });

      setForm({
        category: "Plastic",
        quantity: "1",
        partner: "",
      });

      setMessage("Recycling record added successfully.");
      await loadRecords();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to add recycling record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    if (!isAdmin) {
      setError("Access denied. Only Admin can delete records.");
      return;
    }

    const id = record._id || record.id;

    if (
      !window.confirm(
        `Delete the ${record.category || ""} recycling record?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(`/recycling/${id}`);

      setRecords((previous) =>
        previous.filter(
          (item) => String(item._id || item.id) !== String(id)
        )
      );

      setMessage("Recycling record deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to delete recycling record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesCategory =
        categoryFilter === "All" ||
        record.category === categoryFilter;

      const matchesSearch =
        !term ||
        String(record.category || "").toLowerCase().includes(term) ||
        String(record.partner || "").toLowerCase().includes(term) ||
        String(record.status || "").toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [records, search, categoryFilter]);

  const totalQuantity = records.reduce(
    (total, record) => total + (Number(record.quantity) || 0),
    0
  );

  if (!isAdmin) {
    return (
      <div className="recycling-page">
        <div className="recycling-access-denied">
          <div className="recycling-access-icon">🔒</div>
          <h2>Access Denied</h2>
          <p>
            Only administrators can access the Recycling page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recycling-page">
      <div className="recycling-header">
        <div>
          <h1>Recycling Management</h1>
          <p>
            Manage recyclable waste, categories, quantities and partners.
          </p>
        </div>

        <button
          type="button"
          className="recycling-refresh-btn"
          onClick={loadRecords}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div className="recycling-alert recycling-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="recycling-alert recycling-alert-success">
          {message}
        </div>
      )}

      <div className="recycling-stats">
        <div className="recycling-stat-card">
          <div className="recycling-stat-icon">♻️</div>
          <div>
            <p>Total Records</p>
            <h2>{records.length}</h2>
          </div>
        </div>

        <div className="recycling-stat-card">
          <div className="recycling-stat-icon">⚖️</div>
          <div>
            <p>Total Quantity</p>
            <h2>{totalQuantity.toLocaleString()} kg</h2>
          </div>
        </div>

        <div className="recycling-stat-card">
          <div className="recycling-stat-icon">🌱</div>
          <div>
            <p>Categories Used</p>
            <h2>
              {new Set(records.map((record) => record.category)).size}
            </h2>
          </div>
        </div>
      </div>

      <section className="recycling-form-card">
        <div className="recycling-section-heading">
          <div>
            <h2>Add Recycling Record</h2>
            <p>Enter the details of the recyclable waste.</p>
          </div>
        </div>

        <form className="recycling-form" onSubmit={handleSubmit}>
          <div className="recycling-field">
            <label htmlFor="recycling-category">Waste Category</label>
            <select
              id="recycling-category"
              value={form.category}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  category: e.target.value,
                }))
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="recycling-field">
            <label htmlFor="recycling-quantity">Quantity (kg)</label>
            <input
              id="recycling-quantity"
              type="number"
              min="0.1"
              step="0.1"
              required
              value={form.quantity}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  quantity: e.target.value,
                }))
              }
              placeholder="Enter quantity"
            />
          </div>

          <div className="recycling-field">
            <label htmlFor="recycling-partner">Recycling Partner</label>
            <input
              id="recycling-partner"
              type="text"
              value={form.partner}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  partner: e.target.value,
                }))
              }
              placeholder="Enter partner name (optional)"
            />
          </div>

          <button
            type="submit"
            className="recycling-add-btn"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "+ Add Record"}
          </button>
        </form>
      </section>

      <section className="recycling-records-section">
        <div className="recycling-records-header">
          <div>
            <h2>Recycling Records</h2>
            <p>View and manage registered recycling records.</p>
          </div>

          <span className="recycling-count">
            {filteredRecords.length} records
          </span>
        </div>

        <div className="recycling-filters">
          <input
            type="search"
            placeholder="Search category, partner or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search recycling records"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="recycling-empty">
            Loading recycling records...
          </div>
        )}

        {!loading && records.length === 0 && !error && (
          <div className="recycling-empty">
            <div className="recycling-empty-icon">♻️</div>
            <h3>No Recycling Records</h3>
            <p>Add a record using the form above to get started.</p>
          </div>
        )}

        {!loading &&
          records.length > 0 &&
          filteredRecords.length === 0 && (
            <div className="recycling-empty">
              <h3>No Matching Records</h3>
              <p>Try changing your search or category filter.</p>
            </div>
          )}

        {!loading && filteredRecords.length > 0 && (
          <div className="recycling-record-grid">
            {filteredRecords.map((record) => {
              const id = record._id || record.id;
              const status = record.status || "Pending";

              return (
                <article className="recycling-record-card" key={id}>
                  <div className="recycling-record-top">
                    <div className="recycling-category-icon">
                      {record.category === "Organic"
                        ? "🌿"
                        : record.category === "Plastic"
                        ? "🧴"
                        : record.category === "Paper"
                        ? "📄"
                        : record.category === "Glass"
                        ? "🍾"
                        : record.category === "Metal"
                        ? "🔩"
                        : record.category === "Electronic"
                        ? "🔌"
                        : "♻️"}
                    </div>

                    <span
                      className={`recycling-status ${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </span>
                  </div>

                  <h3>{record.category || "Other"}</h3>

                  <div className="recycling-quantity">
                    {Number(record.quantity) || 0}
                    <span> kg</span>
                  </div>

                  <div className="recycling-partner">
                    <span>Recycling Partner</span>
                    <strong>{record.partner || "No partner assigned"}</strong>
                  </div>

                  {record.createdAt && (
                    <p className="recycling-date">
                      Added:{" "}
                      {new Date(record.createdAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  )}

                  <button
                    type="button"
                    className="recycling-delete-btn"
                    disabled={deletingId === id}
                    onClick={() => handleDelete(record)}
                  >
                    {deletingId === id
                      ? "Deleting..."
                      : " Delete Record"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}