import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import DefinitionModal from "./DefinitionModal"; // Assure-toi que le chemin est correct
import "./anagrammesJeu.css";

export default function FinDuJeu({
  solutionsTrouvees,
  solutionsPossibles,
  onRejouer,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [motSelectionne, setMotSelectionne] = useState("");
  const [definition, setDefinition] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const handleMotClick = async (mot) => {
    setMotSelectionne(mot);
    setDefinition("");
    setShowModal(true);

    try {
      const res = await fetch(
        `/api/mots/definition/${encodeURIComponent(mot)}`
      );
      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();
      setDefinition(data.definition);
    } catch (error) {
      setDefinition("Erreur lors de la récupération de la définition.");
      console.error("Erreur :", error.message);
    }
  };

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
              <strong>+ {sol.lettre} :</strong>{" "}
              {sol.mots.map((mot, i) => (
                <span
                  key={i}
                  onClick={() => handleMotClick(mot)}
                  className={
                    solutionsTrouvees.includes(mot)
                      ? "mot mot-trouve"
                      : "mot mot-non-trouve"
                  }
                >
                  {mot}
                  {i < sol.mots.length - 1 ? ", " : ""}
                </span>
              ))}
            </h4>
          ))}
        </div>
      )}
      <button className="btn btn-success mt-3" onClick={onRejouer}>
        Rejouer
      </button>
      <DefinitionModal
        mot={motSelectionne}
        definition={definition}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
