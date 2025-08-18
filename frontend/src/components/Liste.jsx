import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Liste() {
  const [mots, setMots] = useState([]);

  useEffect(() => {
    fetch("/api/mots")
      .then((res) => res.json())
      .then((data) => setMots(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Dictionnaire ODS9</h1>
        <ul>
          {mots.map((m) => (
            <li key={m._id}>
              <strong>{m.mot}</strong> : {m.definition}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Liste;
