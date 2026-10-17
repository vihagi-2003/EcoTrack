import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Complaints() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadComplaints = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.complaints || [];

      setComplaints(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadComplaints();
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setSubmitting(true);

      await api.post("/complaints", form);

      setForm({
        subject: "",
        description: "",
        priority: "Medium",
      });

      setMessage(
        "Your complaint has been submitted successfully."
      );

      if (isAdmin) {
        await loadComplaints();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to submit complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (complaint) => {
    if (!isAdmin) {
      setError("Only Admin can delete complaints.");
      return;
    }

    const id = complaint._id || complaint.id;

    if (
      !window.confirm(
        `Delete complaint "${complaint.subject}"?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(`/complaints/${id}`);

      setComplaints((previous) =>
        previous.filter(
          (item) => String(item._id || item.id) !== String(id)
        )
      );

      setMessage("Complaint deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to delete complaint."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getPriorityClass = (priority) =>
    (priority || "Medium").toLowerCase();

  const getStatusClass = (status) =>
    (status || "Pending").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaints & Feedback</h1>
          <p>
            Share your feedback and help us improve waste
            management services.
          </p>
        </div>
      </div>

      {error && (
        <div className="complaint-alert complaint-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="complaint-alert complaint-alert-success">
          {message}
        </div>
      )}

      <div className="complaint-form-card">
        <div className="complaint-form-heading">
          <div className="complaint-heading-icon">✉</div>
          <div>
            <h2>Submit a Complaint</h2>
            <p>Fill in the details below.</p>
          </div>
        </div>

        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="complaint-field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter complaint subject"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </div>

          <div className="complaint-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Explain your complaint or feedback..."
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>

          <div className="complaint-field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <button
            type="submit"
            className="complaint-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "✉ Submit Complaint"}
          </button>
        </form>
      </div>

      {isAdmin && (
        <section className="complaints-list-section">
          <div className="complaints-list-header">
            <div>
              <h2>Submitted Complaints</h2>
              <p>Review complaints submitted by users.</p>
            </div>

            <button
              type="button"
              className="complaint-refresh-btn"
              onClick={loadComplaints}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          <div className="complaint-count">
            Total complaints: {complaints.length}
          </div>

          {loading && (
            <div className="complaint-empty">
              Loading complaints...
            </div>
          )}

          {!loading && complaints.length === 0 && !error && (
            <div className="complaint-empty">
              <div className="complaint-empty-icon">✉</div>
              <h3>No Complaints Yet</h3>
              <p>Submitted complaints will appear here.</p>
            </div>
          )}

          {!loading && complaints.length > 0 && (
            <div className="complaints-grid">
              {complaints.map((complaint) => {
                const id = complaint._id || complaint.id;

                return (
                  <article className="complaint-card" key={id}>
                    <div className="complaint-card-top">
                      <h3>{complaint.subject || "Untitled Complaint"}</h3>

                      <span
                        className={`complaint-priority ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority || "Medium"}
                      </span>
                    </div>

                    <p className="complaint-description">
                      {complaint.description || "No description provided."}
                    </p>

                    <div className="complaint-meta">
                      <div>
                        <span className="complaint-meta-label">
                          Status
                        </span>
                        <span
                          className={`complaint-status ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </div>

                      <div>
                        <span className="complaint-meta-label">
                          Submitted
                        </span>
                        <span className="complaint-date">
                          {complaint.createdAt
                            ? new Date(
                                complaint.createdAt
                              ).toLocaleDateString("en-GB")
                            : "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="complaint-delete-btn"
                      disabled={deletingId === id}
                      onClick={() => handleDelete(complaint)}
                    >
                      {deletingId === id
                        ? "Deleting..."
                        : "🗑 Delete Complaint"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}