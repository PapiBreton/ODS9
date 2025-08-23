// Flashcard.js
import React, { useState, useEffect, useRef } from "react";
import "./Flashcard.css";
import Navbar from "../Navbar";

export default function Flashcard() {
  const [flashcard, setFlashcard] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  const inputRef = useRef(null);
  const nextBtnRef = useRef(null);

  const fetchFlashcard = async () => {
    const res = await fetch("/api/prefixes/random"); // ✅ route mise à jour
    const data = await res.json();
    setFlashcard(data);
    setUserAnswer("");
    setShowSolution(false);
    setFadeKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchFlashcard();
  }, []);

  // Focus sur l'input à chaque nouvelle carte
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [fadeKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSolution(true);

    // Après affichage de la solution, focus sur le bouton
    setTimeout(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.focus();
      }
    }, 0);
  };

  if (!flashcard) {
    return <div className="text-center mt-5 text-white">Chargement...</div>;
  }

  // ✅ On compare maintenant la réponse à la solution complète
  const isCorrect =
    userAnswer.trim().toUpperCase() === flashcard.solution.toUpperCase();

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #70657aff 0%, #5878afff 100%)",
          padding: "1rem",
        }}
      >
        <div
          key={fadeKey}
          className="card shadow-lg fade-in"
          style={{
            width: "100%",
            maxWidth: "40rem",
            borderRadius: "1rem",
            backgroundColor: "rgba(145, 117, 117, 0.9)",
          }}
        >
          <div className="card-body text-center p-4">
            <h2>MODIFIER LA SOLUTION DANS MONGO</h2>
            {/* On affiche l'indice : le mot tronqué ou autre info */}
            <p
              className="display-4 fw-bold mb-4"
              style={{ color: "rgba(72, 61, 88, 0.9)" }}
            >
              {flashcard.word}
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="input-group mb-3">
                <input
                  ref={inputRef}
                  id="answer-input"
                  autoComplete="off"
                  type="text"
                  className="form-control text-center"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                />
              </div>
            </form>

            {showSolution && (
              <div
                className={`alert ${
                  isCorrect ? "alert-success" : "alert-danger"
                } mt-3`}
              >
                {isCorrect ? (
                  <>
                    ✅ <strong>{flashcard.solution}</strong>
                  </>
                ) : (
                  <>
                    ❌ Réponse attendue : <strong>{flashcard.solution}</strong>
                  </>
                )}
              </div>
            )}

            {showSolution && (
              <button
                ref={nextBtnRef}
                className="btn btn-outline mt-3"
                onClick={fetchFlashcard}
              >
                Carte suivante
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
