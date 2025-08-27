import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./anagrammesJeu.css";

export default function FinDuJeu({
  solutionsTrouvees,
  solutionsPossibles,
  onRejouer,
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  const toutesLesReponsesSontBonnes = (trouvees, possibles) => {
    const tousMots = possibles.flatMap((sol) => sol.mots);
    return tousMots.every((mot) => trouvees.includes(mot));
  };

  const victoire = toutesLesReponsesSontBonnes(
    solutionsTrouvees,
    solutionsPossibles
  );

  useEffect(() => {
    if (victoire) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [victoire]);

  return (
    <div className="mt-4 text-center">
      {victoire ? (
        <>
          <div className="alert alert-success my-5">
            <p> 🎉 Bravo Patrick ! Tu as trouvé tous les mots !</p>
            {solutionsPossibles.map((sol, idx) => (
              <h4 key={idx} className="fw-bold">
                <strong>+ {sol.lettre} :</strong> {sol.mots.join(", ")}
              </h4>
            ))}
          </div>
          {showConfetti && <Confetti />}
        </>
      ) : (
        <div className="alert alert-info my-5">
          <p> 👀 Voici les mots qu'il fallait trouver :</p>
          {solutionsPossibles.map((sol, idx) => (
            <h4 key={idx} className="fw-bold">
              <strong>+ {sol.lettre} :</strong> {sol.mots.join(", ")}
            </h4>
          ))}
        </div>
      )}
      <button className="btn btn-success mt-3" onClick={onRejouer}>
        Rejouer
      </button>
    </div>
  );
}
