import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "450px",
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

export default function Schedules() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/requests");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.requests || [];

      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load collection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getId = (request) => request._id || request.id;

  const getLocation = (request) =>
    request.location ||
    request.collectionLocation ||
    request.address ||
    request.collection_location ||
    "-";

  const getLatitude = (request) =>
    request.latitude ?? request.lat;

  const getLongitude = (request) =>
    request.longitude ?? request.lng;

  const getDate = (request) =>
    request.preferredDate ||
    request.collectionDate ||
    request.date;

  const hasValidCoordinates = (request) => {
    const lat = Number(getLatitude(request));
    const lng = Number(getLongitude(request));

    return (
      getLatitude(request) !== null &&
      getLatitude(request) !== undefined &&
      getLatitude(request) !== "" &&
      getLongitude(request) !== null &&
      getLongitude(request) !== undefined &&
      getLongitude(request) !== "" &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  const validRequests = requests.filter(hasValidCoordinates);

  const markAsCollected = async (request) => {
    const id = getId(request);

    if (
      !window.confirm(
        `Mark "${getLocation(request)}" as collected?`
      )
    ) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      const response = await api.put(`/requests/${id}`, {
        status: "Collected",
      });

      const updatedRequest = {
        ...request,
        ...(response.data?.request || response.data),
        status:
          response.data?.request?.status ||
          response.data?.status ||
          "Collected",
      };

      setRequests((previous) =>
        previous.map((item) =>
          String(getId(item)) === String(id)
            ? updatedRequest
            : item
        )
      );

      setSelected((previous) =>
        previous && String(getId(previous)) === String(id)
          ? updatedRequest
          : previous
      );

      setMessage("Request marked as collected successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update collection status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRequest = async (request) => {
    if (!isAdmin) {
      setError("Only Admin can delete collection requests.");
      return;
    }

    const id = getId(request);

    if (
      !window.confirm(
        `Delete the collection request at "${getLocation(request)}"?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(`/requests/${id}`);

      setRequests((previous) =>
        previous.filter(
          (item) => String(getId(item)) !== String(id)
        )
      );

      setSelected((previous) =>
        previous && String(getId(previous)) === String(id)
          ? null
          : previous
      );

      setMessage("Collection request deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to delete collection request."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loadError) {
    return (
      <div className="schedules-page">
        <p className="schedule-error">
          Google Map load failed. Check your Google Maps API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="schedules-page">
        <h2>Loading Google Map...</h2>
      </div>
    );
  }

  return (
    <div className="schedules-page">
      <div className="schedules-header">
        <div>
          <h1>Collection Schedules</h1>
          <p>View and manage waste collection requests.</p>
        </div>

        <button
          className="schedule-refresh-btn"
          type="button"
          onClick={loadRequests}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {isAdmin && (
        <p className="schedule-info">
          Admin access: You can delete collection requests.
        </p>
      )}

      {error && <p className="schedule-error">{error}</p>}
      {message && <p className="schedule-success">{message}</p>}

      <section className="schedule-section">
        <h2>📍 Collection Request Map</h2>

        <div className="schedule-map">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              selected && hasValidCoordinates(selected)
                ? {
                    lat: Number(getLatitude(selected)),
                    lng: Number(getLongitude(selected)),
                  }
                : center
            }
            zoom={8}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {validRequests.map((request) => (
              <Marker
                key={getId(request)}
                position={{
                  lat: Number(getLatitude(request)),
                  lng: Number(getLongitude(request)),
                }}
                title={getLocation(request)}
                onClick={() => setSelected(request)}
              />
            ))}

            {selected && hasValidCoordinates(selected) && (
              <InfoWindow
                position={{
                  lat: Number(getLatitude(selected)),
                  lng: Number(getLongitude(selected)),
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="schedule-info-window">
                  <h3>📍 {getLocation(selected)}</h3>
                  <p>
                    <strong>Waste Type:</strong>{" "}
                    {selected.wasteType || "-"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {getDate(selected)
                      ? new Date(getDate(selected)).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selected.status || "Pending"}
                  </p>

                  {selected.status !== "Collected" &&
                    selected.status !== "Completed" && (
                      <button
                        type="button"
                        disabled={updatingId === getId(selected)}
                        onClick={() => markAsCollected(selected)}
                      >
                        {updatingId === getId(selected)
                          ? "Updating..."
                          : "✓ Mark as Collected"}
                      </button>
                    )}

                  {isAdmin && (
                    <button
                      type="button"
                      className="schedule-delete-btn"
                      disabled={deletingId === getId(selected)}
                      onClick={() => deleteRequest(selected)}
                    >
                      {deletingId === getId(selected)
                        ? "Deleting..."
                        : "Delete Request"}
                    </button>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {validRequests.length === 0 && !loading && (
          <p className="schedule-notice">
            No map locations available. Requests need valid latitude
            and longitude values.
          </p>
        )}
      </section>

      <section className="schedule-section">
        <h2>Collection Request List</h2>

        {loading && (
          <p className="schedule-notice">Loading requests...</p>
        )}

        {!loading && requests.length === 0 && !error && (
          <div className="schedule-empty">
            <h3>No Collection Requests</h3>
            <p>There are no collection requests to display.</p>
          </div>
        )}

        <div className="schedule-request-grid">
          {requests.map((request) => {
            const id = getId(request);
            const status = request.status || "Pending";
            const resident =
              typeof request.user === "object"
                ? request.user?.name || request.user?.email
                : request.residentName || "-";

            return (
              <article className="schedule-request-card" key={id}>
                <div className="schedule-request-top">
                  <h3>{getLocation(request)}</h3>
                  <span
                    className={`schedule-status ${status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="schedule-request-details">
                  <p>
                    <strong>Waste Type</strong>
                    <span>{request.wasteType || "-"}</span>
                  </p>

                  <p>
                    <strong>Resident</strong>
                    <span>{resident || "-"}</span>
                  </p>

                  <p>
                    <strong>Collection Date</strong>
                    <span>
                      {getDate(request)
                        ? new Date(getDate(request)).toLocaleDateString(
                            "en-GB"
                          )
                        : "-"}
                    </span>
                  </p>

                  <p>
                    <strong>Coordinates</strong>
                    <span>
                      {hasValidCoordinates(request)
                        ? `${getLatitude(request)}, ${getLongitude(request)}`
                        : "Not provided"}
                    </span>
                  </p>

                  <p>
                    <strong>Description</strong>
                    <span>{request.description || "-"}</span>
                  </p>
                </div>

                <div className="schedule-request-actions">
                  {status !== "Collected" &&
                    status !== "Completed" && (
                      <button
                        type="button"
                        className="schedule-collect-btn"
                        disabled={updatingId === id}
                        onClick={() => markAsCollected(request)}
                      >
                        {updatingId === id
                          ? "Updating..."
                          : "✓ Mark as Collected"}
                      </button>
                    )}

                  {isAdmin && (
                    <button
                      type="button"
                      className="schedule-delete-btn"
                      disabled={deletingId === id}
                      onClick={() => deleteRequest(request)}
                    >
                      {deletingId === id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}