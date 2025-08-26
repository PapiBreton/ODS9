import { useState } from "react";

const API = "/api/quizAna";

function shuffle(s) {
  const arr = s.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export default function GamePanel({ game, onQuit }) {
  const [letters] = useState(shuffle(game.normalized));
  const [guess, setGuess] = useState("");
  const [found, setFound] = useState(new Set());
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(0);

  const handleGuess = async (e) => {
    e.preventDefault();
    const g = guess.toUpperCase().trim();
    if (!g) return;

    try {
      const res = await fetch(`${API}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ normalized: game.normalized, guess: g }),
      });
      const data = await res.json();
      if (data.ok) {
        if (found.has(g)) {
          setMsg("Déjà trouvé !");
        } else {
          const updated = new Set(found);
          updated.add(g);
          setFound(updated);
          setScore((s) => s + g.length * 10);
          setMsg(data.definition ? `Bravo ! (${data.definition})` : "Bravo !");
        }
      } else {
        setMsg("Pas valide pour ce tirage.");
      }
    } catch {
      setMsg("Erreur de validation.");
    } finally {
      setGuess("");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const progress = Math.round((found.size / game.total) * 100);

  return (
    <div className="card card-body shadow-sm mt-3 text-dark">
      <Header letters={letters} onQuit={onQuit} />
      <ProgressBar
        progress={progress}
        score={score}
        found={found.size}
        total={game.total}
      />
      <form className="input-group mt-3" onSubmit={handleGuess}>
        <input
          className="form-control form-control-lg text-uppercase"
          placeholder="Tapez un anagramme"
          value={guess}
          onChange={(e) =>
            setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
          }
        />
        <button className="btn btn-success">Valider</button>
      </form>
      {msg && <div className="alert alert-info mt-2 py-2 mb-0">{msg}</div>}
      <FoundWords found={found} />
    </div>
  );
}

function Header({ letters, onQuit }) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0">{letters.split("").sort().join("")}</h5>
      <button className="btn btn-outline-secondary btn-sm" onClick={onQuit}>
        Changer
      </button>
    </div>
  );
}

function ProgressBar({ progress, score, found, total }) {
  return (
    <div className="mt-3 d-flex align-items-center gap-3">
      <div className="flex-grow-1">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {found} / {total}
          </div>
        </div>
      </div>
      <div className="badge bg-primary fs-6">Score: {score}</div>
    </div>
  );
}

function FoundWords({ found }) {
  return (
    <div className="mt-3">
      <h6>Mots trouvés</h6>
      {found.size === 0 ? (
        <div className="text-muted">Aucun pour l’instant.</div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {[...found].sort().map((w) => (
            <span key={w} className="badge text-bg-secondary">
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
