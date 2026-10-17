
import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const dashboardItems = [
  { title: "Users", countKey: "users", endpoint: "/auth/users" },
  { title: "Requests", countKey: "requests", endpoint: "/requests" },
  {
    title: "Pending",
    countKey: "pending",
    endpoint: "/requests",
    filter: "Pending",
  },
  {
    title: "Completed",
    countKey: "completed",
    endpoint: "/requests",
    filter: "Completed",
  },
  {
    title: "Complaints",
    countKey: "complaints",
    endpoint: "/complaints",
  },
  {
    title: "Recycling",
    countKey: "recycling",
    endpoint: "/recycling",
  },
];

const hiddenFields = ["password", "__v"];

function extractArray(response) {
  if (Array.isArray(response)) return response;

  if (!response || typeof response !== "object") return [];

  const keys = [
    "data",
    "users",
    "requests",
    "complaints",
    "recycling",
    "results",
    "items",
    "records",
  ];

  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  for (const key of keys) {
    if (
      response[key] &&
      typeof response[key] === "object"
    ) {
      const nested = extractArray(response[key]);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function isPending(status) {
  return ["pending", "requested", "new"].includes(
    normalizeStatus(status)
  );
}

function isCompleted(status) {
  return [
    "completed",
    "collected",
    "resolved",
    "complete",
  ].includes(normalizeStatus(status));
}

function readableKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.map(formatValue).join(", ")
      : "-";
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !hiddenFields.includes(key))
      .map(
        ([key, item]) =>
          `${readableKey(key)}: ${formatValue(item)}`
      )
      .join(" | ");
  }

  return String(value);
}

function getId(record) {
  return record?._id || record?.id;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    users: 0,
    requests: 0,
    pending: 0,
    completed: 0,
    complaints: 0,
    recycling: 0,
  });

  const [selected, setSelected] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  const selectedItem = dashboardItems.find(
    (item) => item.title === selected
  );

  const loadSummary = useCallback(async () => {
    try {
      const response = await api.get("/dashboard/summary");
      const data = response.data?.data || response.data || {};

      setSummary((previous) => ({
        ...previous,
        users: Number(data.users ?? previous.users),
        requests: Number(data.requests ?? previous.requests),
        pending: Number(data.pending ?? previous.pending),
        completed: Number(data.completed ?? previous.completed),
        complaints: Number(data.complaints ?? previous.complaints),
        recycling: Number(data.recycling ?? previous.recycling),
      }));
    } catch (err) {
      console.error(
        "Summary error:",
        err.response?.data || err.message
      );
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const viewDetails = async (item) => {
    setSelected(item.title);
    setDetails([]);
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.get(item.endpoint);
      let records = extractArray(response.data);

      if (item.filter === "Pending") {
        records = records.filter((record) =>
          isPending(record.status)
        );
      }

      if (item.filter === "Completed") {
        records = records.filter((record) =>
          isCompleted(record.status)
        );
      }

      setDetails(records);

      setSummary((previous) => ({
        ...previous,
        [item.countKey]: records.length,
      }));
    } catch (err) {
      console.error(
        "Details error:",
        err.response?.status,
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          `Failed to load ${item.title}. HTTP ${
            err.response?.status || "network error"
          }.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (!selectedItem) return;

    if (!isAdmin) {
      setError("Only an Admin can delete records.");
      return;
    }

    const id = getId(record);

    if (!id) {
      setError("Record ID was not found.");
      return;
    }

    if (
      !window.confirm(
        `Delete this ${selectedItem.title} record? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(String(id));
    setError("");
    setMessage("");

    try {
      await api.delete(`${selectedItem.endpoint}/${id}`);

      const updated = details.filter(
        (item) => String(getId(item)) !== String(id)
      );

      setDetails(updated);

      setSummary((previous) => ({
        ...previous,
        [selectedItem.countKey]: updated.length,
      }));

      setMessage("Record deleted successfully.");

      await loadSummary();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          `Delete failed. HTTP ${
            err.response?.status || "network error"
          }.`
      );
    } finally {
      setDeletingId("");
    }
  };

  const closeDetails = () => {
    setSelected("");
    setDetails([]);
    setError("");
    setMessage("");
  };

  return (
    <main className="dashboard">
      <header className="dashboard-heading">
        <h1>Welcome, {user?.name || "User"}</h1>
        <p>Smart Waste Collection &amp; Recycling Management</p>
      </header>

      <section className="grid">
        {dashboardItems.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <strong>{summary[item.countKey]}</strong>

            <div className="card-action">
              <button
                type="button"
                className="view-btn"
                onClick={() => viewDetails(item)}
                disabled={loading || Boolean(deletingId)}
              >
                View Details
              </button>
            </div>
          </article>
        ))}
      </section>

      {selected && (
        <section className="details-section">
          <div className="details-header">
            <div>
              <h2>{selected} Details</h2>
              {!loading && !error && (
                <p>Total records: {details.length}</p>
              )}
            </div>

            <button
              type="button"
              className="close-btn"
              onClick={closeDetails}
              disabled={Boolean(deletingId)}
            >
              Close ✕
            </button>
          </div>

          {loading && <p>Loading details...</p>}

          {error && <p className="error">{error}</p>}

          {message && <p className="success">{message}</p>}

          {!loading && !error && details.length === 0 && (
            <p>
              No {selected.toLowerCase()} records found.
            </p>
          )}

          {!loading && details.length > 0 && (
            <div className="details-list">
              {details.map((record, index) => {
                const id = getId(record);

                const fields = Object.entries(record).filter(
                  ([key]) => !hiddenFields.includes(key)
                );

                return (
                  <article
                    className="detail-item"
                    key={id || index}
                  >
                    <div className="detail-item-heading">
                      <h3>
                        {record.name ||
                          record.title ||
                          record.wasteType ||
                          record.category ||
                          `${selected} #${index + 1}`}
                      </h3>

                      {record.status && (
                        <span className="detail-status">
                          {record.status}
                        </span>
                      )}
                    </div>

                    <div className="detail-fields">
                      {fields.map(([key, value]) => (
                        <div
                          className="detail-field"
                          key={key}
                        >
                          <strong>{readableKey(key)}</strong>
                          <span>{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>

                    {isAdmin && id && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(record)}
                        disabled={Boolean(deletingId)}
                      >
                        {deletingId === String(id)
                          ? "Deleting..."
                          : "Delete Record"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
