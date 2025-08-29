import { useState } from "react";

const API = "/api/quizAna";

const labels = {
  required: "Lettres obligatoires",
  forbidden: "Lettres interdites",
  length: "Longueur",
  submit: "Lancer QuizMots",
  loading: "Tirage...",
  errorOverlap:
    "Une lettre ne peut pas être à la fois obligatoire et interdite.",
};

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
      // Validation : lettres communes
      if ([...required].some((char) => forbidden.includes(char))) {
        throw new Error(labels.errorOverlap);
      }

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
          label={labels.required}
          id="quiz-obligatoires"
          value={required}
          onChange={setRequired}
        />
        <InputField
          label={labels.forbidden}
          id="quiz-interdites"
          value={forbidden}
          onChange={setForbidden}
        />
        <div className="col-sm-4">
          <label htmlFor="quiz-longueur" className="form-label">
            {labels.length}
          </label>
          <input
            type="number"
            id="quiz-longueur"
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
        {loading && <span className="spinner-border spinner-border-sm me-2" />}
        {loading ? labels.loading : labels.submit}
      </button>
    </form>
  );
}

function InputField({ label, id, value, onChange }) {
  return (
    <div className="col-sm-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className="form-control text-uppercase"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
        }
      />
    </div>
  );
}
