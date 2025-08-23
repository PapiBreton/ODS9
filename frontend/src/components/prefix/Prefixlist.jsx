import { useEffect, useState } from "react";

export default function PrefixList() {
  const [prefixes, setPrefixes] = useState([]);

  const fetchPrefixesListe = async () => {
    const res = await fetch("/api/prefixes/"); // ✅ route mise à jour
    const data = await res.json();
    setPrefixes(data.data);
  };

  useEffect(() => {
    fetchPrefixesListe();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="mb-4">📚 Liste des préfixes</h1>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Préfixe</th>
              <th>Mot</th>
            </tr>
          </thead>
          <tbody>
            {prefixes.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <span className="badge bg-primary">{item.prefix}</span>
                </td>
                <td>{item.word}</td>
                <td>{item.prefix + item.word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
