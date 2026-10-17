
import { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const API_URL = "http://localhost:5000/api";

const mapContainerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

function Requests() {
  const { isLoaded } = useJsApiLoader({
    id: "ecotrack-google-map",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    wasteType: "Plastic",
    quantity: "",
    address: "",
    description: "",
    pickupDate: "",
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const token = localStorage.getItem("ecotrack_token");

  const api = axios.create({
    baseURL: API_URL,
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/requests");

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : response.data.requests || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load requests. Please check your login status."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleMapClick = (event) => {
    if (
      typeof event.latLng?.lat === "function" &&
      typeof event.latLng?.lng === "function"
    ) {
      setSelectedLocation({
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      });

      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedLocation) {
      setError("Please select your pickup location by clicking on the map.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    try {
      setSubmitting(true);

      const requestData = {
        ...form,
        quantity: Number(form.quantity),

        // Store the pickup address in the location field.
        location: form.address,

        // Get the coordinates automatically from the map.
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };

      await api.post("/requests", requestData);

      setSuccess("Your waste collection request was submitted successfully!");

      setForm({
        wasteType: "Plastic",
        quantity: "",
        address: "",
        description: "",
        pickupDate: "",
      });

      setSelectedLocation(null);

      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit the request. Please check the required fields in the backend model."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <p className="requests-eyebrow">ECOTRACK • RESIDENT</p>
          <h1>Waste Collection Requests</h1>
          <p className="requests-subtitle">
            Submit a waste collection request and select your pickup location
            on the map.
          </p>
        </div>
      </div>

      <div className="requests-layout">
        <section className="request-card">
          <h2>
            <span className="request-icon">♻️</span>
            Create New Request
          </h2>

          {error && (
            <div className="request-alert error">{error}</div>
          )}

          {success && (
            <div className="request-alert success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="request-form-grid">
              <div className="request-field">
                <label htmlFor="wasteType">Waste Type</label>

                <select
                  id="wasteType"
                  name="wasteType"
                  value={form.wasteType}
                  onChange={handleChange}
                  required
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Glass">Glass</option>
                  <option value="Metal">Metal</option>
                  <option value="Organic">Organic</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="request-field">
                <label htmlFor="quantity">Quantity (kg)</label>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="request-field full-width">
                <label htmlFor="address">Pickup Address</label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your pickup address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="request-field">
                <label htmlFor="pickupDate">Preferred Pickup Date</label>

                <input
                  id="pickupDate"
                  name="pickupDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.pickupDate}
                  onChange={handleChange}
                />
              </div>

              <div className="request-field">
                <label htmlFor="description">Additional Details</label>

                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter optional details"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="request-map-heading">
              <div>
                <h3>Select Pickup Location</h3>
                <p>Click on the map to select your pickup location.</p>
              </div>

              <span className="map-required">Required</span>
            </div>

            <div className="request-map">
              {!isLoaded ? (
                <div className="map-message">
                  Loading Google Maps...
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={
                    selectedLocation
                      ? {
                          lat: selectedLocation.latitude,
                          lng: selectedLocation.longitude,
                        }
                      : defaultCenter
                  }
                  zoom={selectedLocation ? 16 : 8}
                  options={mapOptions}
                  onClick={handleMapClick}
                >
                  {selectedLocation && (
                    <Marker
                      position={{
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude,
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>

            {selectedLocation ? (
              <div className="selected-location">
                <span className="location-check">✓</span>

                <div>
                  <strong>Pickup Location Selected</strong>

                  <p>
                    Latitude: {selectedLocation.latitude.toFixed(6)}
                    {" · "}
                    Longitude: {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>

                <button
                  type="button"
                  className="change-location"
                  onClick={() => setSelectedLocation(null)}
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="location-hint">
                <span>📍</span>

                <p>
                  No location selected. Click on the map to choose the correct
                  pickup location.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="submit-request-btn"
              disabled={submitting || !isLoaded}
            >
              {submitting
                ? "Submitting..."
                : "Submit Collection Request →"}
            </button>
          </form>
        </section>

        <section className="request-card requests-list-card">
          <div className="requests-list-heading">
            <div>
              <h2>My Requests</h2>
              <p>Your submitted waste collection requests</p>
            </div>

            <button
              type="button"
              className="refresh-requests"
              onClick={fetchRequests}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="empty-requests">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="empty-requests">
              <span>📦</span>
              <h3>No Requests Yet</h3>
              <p>Submit your first waste collection request.</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map((request) => (
                <article
                  className="request-item"
                  key={request._id || request.id}
                >
                  <div className="request-item-top">
                    <div className="request-item-icon">♻️</div>

                    <div className="request-item-title">
                      <h3>{request.wasteType || "Waste Collection"}</h3>

                      <p>
                        {request.quantity
                          ? `${request.quantity} kg`
                          : "Quantity not specified"}
                      </p>
                    </div>

                    <span
                      className={`request-status ${(request.status || "Pending")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {request.status || "Pending"}
                    </span>
                  </div>

                  {request.address && (
                    <p className="request-item-address">
                      <span>📍</span> {request.address}
                    </p>
                  )}

                  {request.pickupDate && (
                    <p className="request-item-date">
                      Pickup Date:{" "}
                      {new Date(request.pickupDate).toLocaleDateString()}
                    </p>
                  )}

                  {request.latitude != null &&
                    request.longitude != null && (
                      <a
                        className="request-map-link"
                        href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Location on Google Maps ↗
                      </a>
                    )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Requests;
