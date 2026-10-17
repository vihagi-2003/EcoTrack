import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function NewRequest() {
  const [form, setForm] = useState({
    wasteType: "Organic",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    preferredDate: ""
  });

  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
  form.latitude.trim() === "" ||
  form.longitude.trim() === ""
) {
  setError("Please enter latitude and longitude");
  return;
}

const lat = Number(form.latitude);
const lng = Number(form.longitude);

if (
  !Number.isFinite(lat) ||
  !Number.isFinite(lng) ||
  lat < -90 ||
  lat > 90 ||
  lng < -180 ||
  lng > 180
) {
  setError("Please enter valid coordinates");
  return;
}

    try {
      await api.post("/requests", {
        wasteType: form.wasteType,
        location: form.location,
        latitude: lat,
        longitude: lng,
        description: form.description,
        preferredDate: form.preferredDate
      });

      nav("/requests");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to create collection request"
      );
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>New Collection Request</h2>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <select
        value={form.wasteType}
        onChange={(e) =>
          setForm({
            ...form,
            wasteType: e.target.value
          })
        }
      >
        {[
          "Organic",
          "Plastic",
          "Paper",
          "Glass",
          "Metal",
          "Electronic",
          "Other"
        ].map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        placeholder="Collection Location"
        required
        value={form.location}
        onChange={(e) =>
          setForm({
            ...form,
            location: e.target.value
          })
        }
      />

      <input
        type="number"
        step="any"
        placeholder="Latitude"
        required
        value={form.latitude}
        onChange={(e) =>
          setForm({
            ...form,
            latitude: e.target.value
          })
        }
      />

      <input
        type="number"
        step="any"
        placeholder="Longitude"
        required
        value={form.longitude}
        onChange={(e) =>
          setForm({
            ...form,
            longitude: e.target.value
          })
        }
      />

      <input
        type="date"
        value={form.preferredDate}
        onChange={(e) =>
          setForm({
            ...form,
            preferredDate: e.target.value
          })
        }
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value
          })
        }
      />

      <button type="submit">
        Submit Collection Request
      </button>
    </form>
  );
}