import { useState } from "react";

const API = "/api/quizAna";

export default function SettingsForm({ onStart }) {
  const [required, setRequired] = useState("");
  const [forbidden, setForbidden] = useState("");
  const [length, setLength] = useState(7);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ required, forbidden, length: Number(length) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur tirage");
      onStart({ normalized: data.normalized, total: data.total });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card card-body shadow-sm" onSubmit={handleSubmit}>
      <h5 className="mb-3">Paramètres</h5>
      <div className="row g-3">
        <InputField
          label="Lettres obligatoires"
          value={required}
          onChange={(v) => setRequired(v)}
        />
        <InputField
          label="Lettres interdites"
          value={forbidden}
          onChange={(v) => setForbidden(v)}
        />
        <div className="col-sm-4">
          <label className="form-label">Longueur</label>
          <input
            type="number"
            className="form-control"
            value={length}
            min={2}
            max={15}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
      </div>
      {err && <div className="alert alert-danger mt-3">{err}</div>}
      <button className="btn btn-primary mt-3" disabled={loading}>
        {loading ? "Tirage..." : "Lancer QuizMots"}
      </button>
    </form>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="col-sm-4">
      <label className="form-label">{label}</label>
      <input
        className="form-control text-uppercase"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
        }
      />
    </div>
  );
}
