import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import "./anagrammesJeu.css";

export default function AnagrammesJeu() {
  const valeursScrabble = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 10,
    L: 1,
    M: 2,
    N: 1,
    O: 1,
    P: 3,
    Q: 8,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 10,
    X: 10,
    Y: 10,
    Z: 10,
  };

  const fetchJSON = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erreur fetch:", error.message);
      return null;
    }
  };

  const toutesLesReponsesSontBonnes = (trouvées, possibles) => {
    const tousMotsPossibles = possibles.flatMap((sol) => sol.mots);
    return tousMotsPossibles.every((mot) => trouvées.includes(mot));
  };

  const [tirage, setTirage] = useState([]);
  const [lettresPlateau, setLettresPlateau] = useState([]);
  const [motProposé, setMotProposé] = useState("");
  const [solutionsTrouvées, setSolutionsTrouvées] = useState([]);
  const [solutionsPossibles, setSolutionsPossibles] = useState([]);
  const [jeuTerminé, setJeuTerminé] = useState(false);
  const [messageErreur, setMessageErreur] = useState("");
  const [tempsRestant, setTempsRestant] = useState(32); // 120 secondes = 2 minutes
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioAlerte, setAudioAlerte] = useState(null);

  const initJeu = useCallback(async () => {
    setTirage([]);
    const data = await fetchJSON("/api/anagrammesJeu/initJeu");
    if (!data || !data.tirage || !data.lettresPlateau) return;

    setTirage(data.tirage);
    // Attendre 1 seconde avant d'afficher les lettres du plateau

    setLettresPlateau(data.lettresPlateau);

    setSolutionsPossibles(data.solutionsPossibles || []);

    setSolutionsTrouvées([]);
    setJeuTerminé(false);
    setMessageErreur("");
    setTempsRestant(32);
  }, []);

  useEffect(() => {
    initJeu();
  }, [initJeu]);

  useEffect(() => {
    if (jeuTerminé) return;

    const timer = setInterval(() => {
      setTempsRestant((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJeuTerminé(true);
          setMessageErreur("⏰ Temps écoulé !");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [jeuTerminé]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mot = motProposé.trim().toUpperCase();
    if (mot.length !== 8) {
      setMessageErreur("Le mot doit contenir exactement 8 lettres.");
      return;
    }

    const compteurLettres = {};
    [...tirage, ...lettresPlateau].forEach((lettre) => {
      compteurLettres[lettre] = (compteurLettres[lettre] || 0) + 1;
    });

    const estValide = mot.split("").every((lettre) => {
      if (!compteurLettres[lettre]) return false;
      compteurLettres[lettre]--;
      return true;
    });

    if (!estValide) {
      setMessageErreur("Mot invalide : lettres non disponibles.");
      return;
    }

    const match = solutionsPossibles.find((sol) => sol.mots.includes(mot));

    if (match) {
      if (solutionsTrouvées.includes(mot)) {
        setMessageErreur("Mot déjà trouvé.");
      } else {
        const nouvellesSolutions = [...solutionsTrouvées, mot];
        setSolutionsTrouvées(nouvellesSolutions);
        setMessageErreur("");

        if (
          toutesLesReponsesSontBonnes(nouvellesSolutions, solutionsPossibles)
        ) {
          setJeuTerminé(true);
        }
      }
    } else {
      setMessageErreur("Mot incorrect.");
    }

    setMotProposé("");
  };

  const handleFin = () => {
    setJeuTerminé(true);
    if (!toutesLesReponsesSontBonnes(solutionsTrouvées, solutionsPossibles)) {
      setMessageErreur(
        `Tu n’as pas trouvé tous les mots, mais c’est déjà pas mal !`
      );
    }
  };
  const totalMots = solutionsPossibles.reduce(
    (acc, sol) => acc + sol.mots.length,
    0
  );
  const motsRestants = totalMots - solutionsTrouvées.length;

  const messageMotivation =
    motsRestants === 0
      ? "💯 Tous les mots trouvés, champion !"
      : motsRestants < totalMots / 2
      ? "🔥 Tu es à plus de la moitié, continue !"
      : "🚀 C’est le moment de tout donner !";
  const progressionPourcent = Math.round(
    ((totalMots - motsRestants) / totalMots) * 100
  );
  useEffect(() => {
    if (tempsRestant === 10) {
      const audio = new Audio("/alerte.mp3");
      audio.play();
    }
  }, [tempsRestant]);
  useEffect(() => {
    if (tempsRestant === 0 && audioEnabled && audioAlerte) {
      audioAlerte.play().catch((err) => {
        console.warn("Lecture audio bloquée :", err);
      });
    }
  }, [tempsRestant, audioEnabled, audioAlerte]);
  useEffect(() => {
    const audio = new Audio("/alerte.mp3");
    setAudioAlerte(audio);
  }, []);

  const handleEnableAudio = () => {
    if (audioAlerte) {
      audioAlerte
        .play()
        .then(() => {
          audioAlerte.pause();
          audioAlerte.currentTime = 0;
          setAudioEnabled(true);
        })
        .catch((err) => {
          console.warn("Audio bloqué :", err);
        });
    }
  };
  return (
    <>
      <h3 className="my-3 text-center">🎯</h3>
      {tirage.length > 0 && (
        <div className="container mt-4 text-center">
          {tirage.length > 0 && (
            <>
              {!audioEnabled && (
                <button onClick={handleEnableAudio}>
                  🔊 Activer le son du jeu
                </button>
              )}
              <div className="mb-3">
                <strong className="text-warning-emphasis">
                  Temps restant :{" "}
                </strong>{" "}
                <span
                  className={tempsRestant <= 10 ? "clignote" : ""}
                  style={{ color: tempsRestant < 30 ? "red" : "yellow" }}
                >
                  {Math.floor(tempsRestant / 60)}:
                  {String(tempsRestant % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="conteneur-principal mt-5">
                <div className="mb-3">
                  <p>Tirage </p>{" "}
                  {tirage.map((lettre, index) => (
                    <span
                      key={index}
                      className="tuile-scrabble"
                      style={{
                        animation: `fadeIn 0.3s ease ${index * 0.1}s forwards`,
                        opacity: 0,
                      }}
                    >
                      {lettre}
                    </span>
                  ))}
                </div>

                <div className="my-5">
                  <p>Lettres présentes </p>{" "}
                  {lettresPlateau.map((lettre, index) => (
                    <span
                      key={index}
                      className="tuile-scrabble"
                      style={{
                        animation: `fadeIn 0.3s ease ${index * 0.1}s forwards`,
                        opacity: 0,
                      }}
                    >
                      {lettre}
                    </span>
                  ))}
                </div>
              </div>
              {jeuTerminé && <div className="fin-ecran">💥 Temps écoulé !</div>}

              {!jeuTerminé ? (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="mb-3 d-flex flex-column align-items-center"
                  >
                    <input
                      id="motInput"
                      type="text"
                      autoComplete="off"
                      className="form-control input-court mb-2"
                      value={motProposé}
                      onChange={(e) =>
                        setMotProposé(e.target.value.toUpperCase())
                      }
                      placeholder="Mot de 8 lettres"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary mt-3"
                      disabled={motProposé.trim().length !== 8}
                    >
                      Valider
                    </button>
                  </form>
                  <div className="my-3">
                    <strong>Mots restants :</strong>{" "}
                    <span
                      style={{
                        color:
                          motsRestants === 0
                            ? "green"
                            : motsRestants < totalMots / 2
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {motsRestants} / {totalMots}
                    </span>
                    <div className="mt-2">{messageMotivation}</div>
                  </div>
                  {messageErreur && (
                    <div className="alert alert-warning">{messageErreur}</div>
                  )}

                  <div className="my-5">
                    <strong className="text-primary">Mots trouvés :</strong>{" "}
                    {solutionsTrouvées.length === 0
                      ? "Aucun"
                      : solutionsTrouvées.map((mot, idx) => {
                          const lettre = solutionsPossibles.find((sol) =>
                            sol.mots.includes(mot)
                          )?.lettre;
                          return (
                            <span key={idx} className="mot-trouvé me-2">
                              {mot} <small>(+{lettre})</small>
                            </span>
                          );
                        })}
                  </div>
                  <div className="progress my-5" style={{ height: "25px" }}>
                    <div
                      className={`progress-bar ${
                        progressionPourcent === 100 ? "rebond" : ""
                      }`}
                      role="progressbar"
                      style={{
                        width: `${progressionPourcent}%`,
                        transition: "width 0.6s ease-in-out",
                        backgroundColor:
                          progressionPourcent === 100
                            ? "#28a745"
                            : progressionPourcent > 50
                            ? "#ffc107"
                            : "#dc3545",
                      }}
                      aria-valuenow={progressionPourcent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progressionPourcent}%
                    </div>

                    <div className="text-muted">
                      {progressionPourcent === 100
                        ? "🏆 Bravo !"
                        : progressionPourcent > 50
                        ? "🚀 Plus de la moitié, continue !"
                        : "🔍 Tu viens de commencer, courage !"}
                    </div>
                  </div>
                  <button className="btn btn-danger me-2" onClick={handleFin}>
                    Fin
                  </button>
                  <button className="btn btn-secondary" onClick={initJeu}>
                    Nouveau
                  </button>
                </>
              ) : (
                <div className="mt-4">
                  {toutesLesReponsesSontBonnes(
                    solutionsTrouvées,
                    solutionsPossibles
                  ) ? (
                    <>
                      <div className="alert alert-success mt-3">
                        🎉 Bravo Patrick ! Tu as trouvé tous les mots !
                      </div>
                      <Confetti />
                    </>
                  ) : (
                    <>
                      <div className="alert alert-info mt-3">
                        👀 Voici les mots que tu pouvais trouver :
                      </div>
                      {solutionsPossibles.map((sol, idx) => (
                        <div key={idx}>
                          <strong>+ {sol.lettre} :</strong>{" "}
                          {sol.mots.join(", ")}
                        </div>
                      ))}
                    </>
                  )}
                  <button className="btn btn-success mt-5" onClick={initJeu}>
                    Rejouer
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}{" "}
    </>
  );
}
