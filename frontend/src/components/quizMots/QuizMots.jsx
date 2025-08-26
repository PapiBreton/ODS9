import { useState, useEffect, useCallback } from "react";
import "./QuizMots.css";

export default function QuizMots({ mots, show, onClose }) {
  console.log("QuizMots rendered with mots:", mots.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Choix aléatoire d’un mot au lancement et à chaque question
  const pickRandom = useCallback(() => {
    if (!mots.length) return;
    const idx = Math.floor(Math.random() * mots.length);
    setCurrentIndex(idx);
    setInputValue("");
    setIsCorrect(false);
  }, [mots]);

  // Relancer quand la modale s’ouvre
  useEffect(() => {
    if (show) {
      pickRandom();
      setScore(0);
    }
  }, [show, pickRandom]);

  if (!show) return null;

  const current = mots[currentIndex] || {};
  console.log("Current word:", current);
  const answerList = Array.isArray(current.mot) ? current.mot : [current.mot];

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const attempt = inputValue.trim();
    // On autorise plusieurs formes (pluriels, variantes)
    if (answerList.includes(attempt)) {
      setIsCorrect(true);
      setScore((s) => s + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    pickRandom();
    setHasSubmitted(false);
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        <header className="quiz-header">
          <h2>Quiz de mots</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="quiz-body">
          <p className="score">Score : {score}</p>
          <h2 className="prompt text-center text-danger">
            <strong>{current.normalized}</strong>
          </h2>
          <form onSubmit={handleSubmit} className="quiz-form">
            <input
              type="text"
              value={inputValue}
              disabled={isCorrect}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tape ta réponse ici"
              autoFocus
            />
            <button type="submit" disabled={isCorrect || !inputValue.trim()}>
              Valider
            </button>
          </form>

          {isCorrect && (
            <div className="feedback correct">
              Bravo ! Définition :{" "}
              <em>{current.definition || "Aucune définition disponible."}</em>
            </div>
          )}

          {hasSubmitted && !isCorrect && (
            <div className="feedback wrong">Ce est pas la bonne réponse.</div>
          )}
        </div>

        <footer className="quiz-footer">
          <button onClick={handleNext}>Suivant →</button>
        </footer>
      </div>
    </div>
  );
}
