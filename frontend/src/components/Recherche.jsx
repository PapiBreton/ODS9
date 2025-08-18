import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./Navbar";

export default function Recherche() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/mots/${encodeURIComponent(query)}`
      );
      setResult(res.data);
      console.log("Résultats de la recherche:", res.data);
    } catch (err) {
      setError("Erreur lors de la recherche", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h1 className="text-center text-warning-emphasis mb-4">
          Rechercher un mot
        </h1>

        <form className="d-flex mb-4" onSubmit={handleSearch}>
          <input
            id="searchInput"
            type="text"
            className="form-control me-2"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            Rechercher
          </button>
        </form>

        {loading && <p>⏳ Recherche en cours...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <ul className="list-group">
          <li key={result._id} className="list-group-item">
            {result.mot} : {result.definition}
          </li>
        </ul>
      </div>
    </>
  );
}
