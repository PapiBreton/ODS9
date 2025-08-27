import React, { useState, useEffect, useCallback } from "react";
import TimerDisplay from "./TimerDisplay";
import ScrabbleTiles from "./ScrabbleTiles";
import MotInputForm from "./MotInputForm";
import ProgressBar from "./ProgressBar";
import MotsTrouvesList from "./MotsTrouvesList";
import FinDuJeu from "./FinDuJeu";
import MotivationMessage from "./MotivationMessage";
import AudioToggleButton from "./AudioToggleButton";
import ConfettiWrapper from "./ConfettiWrapper";
import { toutesLesReponsesSontBonnes } from "./utils";
import Navbar from "../Navbar";
import "./anagrammesJeu.css";

export default function AnagrammesJeu() {
  const [tirage, setTirage] = useState([]);
  const [lettresPlateau, setLettresPlateau] = useState([]);
  const [motProposé, setMotProposé] = useState("");
  const [solutionsTrouvees, setSolutionsTrouvees] = useState([]);
  const [solutionsPossibles, setSolutionsPossibles] = useState([]);
  const [jeuTermine, setJeuTermine] = useState(false);
  const [messageErreur, setMessageErreur] = useState("");
  const [tempsRestant, setTempsRestant] = useState(32);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioAlerte, setAudioAlerte] = useState(null);
  const [afficherConfetti, setAfficherConfetti] = useState(false);

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

  const initJeu = useCallback(async () => {
    setTirage([]);
    const data = await fetchJSON("/api/anagrammesJeu/initJeu");
    if (!data || !data.tirage || !data.lettresPlateau) return;

    setTirage(data.tirage);
    setLettresPlateau(data.lettresPlateau);
    setSolutionsPossibles(data.solutionsPossibles || []);
    console.log("Solutions possibles:", data.solutionsPossibles);
    setSolutionsTrouvees([]);
    setJeuTermine(false);
    setMessageErreur("");
    setTempsRestant(32);
  }, []);

  useEffect(() => {
    initJeu();
  }, [initJeu]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempsRestant((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJeuTermine(true);
          setMessageErreur("⏰ Temps écoulé !");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [jeuTermine]);
  useEffect(() => {
    if (
      jeuTermine &&
      toutesLesReponsesSontBonnes(solutionsTrouvees, solutionsPossibles)
    ) {
      setAfficherConfetti(true);
      console.log("Confetti lancé !");

      const timer = setTimeout(() => {
        console.log("Arrêt du confetti après 3 secondes");
        setAfficherConfetti(false);
      }, 3000);

      return () => clearTimeout(timer); // Nettoyage si le composant se démonte
    }
  }, [jeuTermine, solutionsTrouvees, solutionsPossibles]);

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
      if (solutionsTrouvees.includes(mot)) {
        setMessageErreur("Mot déjà trouvé.");
      } else {
        const nouvellesSolutions = [...solutionsTrouvees, mot];
        setSolutionsTrouvees(nouvellesSolutions);
        setMessageErreur("");

        if (
          toutesLesReponsesSontBonnes(nouvellesSolutions, solutionsPossibles)
        ) {
          setJeuTermine(true);
        }
      }
    } else {
      setMessageErreur("Mot incorrect.");
    }

    setMotProposé("");
  };

  const handleFin = () => {
    setJeuTermine(true);
    if (!toutesLesReponsesSontBonnes(solutionsTrouvees, solutionsPossibles)) {
      setMessageErreur(
        `Tu n’as pas trouvé tous les mots, mais c’est déjà pas mal !`
      );
    }
  };

  const totalMots = solutionsPossibles.reduce(
    (acc, sol) => acc + sol.mots.length,
    0
  );
  const motsRestants = totalMots - solutionsTrouvees.length;
  const progressionPourcent = Math.round(
    ((totalMots - motsRestants) / totalMots) * 100
  );

  return (
    <div className="container text-center">
      <Navbar />
      {!audioEnabled && !jeuTermine && (
        <AudioToggleButton onClick={handleEnableAudio} />
      )}
      <TimerDisplay tempsRestant={tempsRestant} jeuTermine={jeuTermine} />
      <div className="conteneur-principal mt-3 mb-3 text-secondary text-center">
        <ScrabbleTiles lettres={tirage} label="Tirage" />
        <ScrabbleTiles lettres={lettresPlateau} label="Lettres disponibles" />
      </div>

      {!jeuTermine ? (
        <>
          <MotInputForm
            motProposé={motProposé}
            setMotProposé={setMotProposé}
            handleSubmit={handleSubmit}
          />
          <div className="my-3 text-center">
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
            <MotivationMessage progressionPourcent={progressionPourcent} />
          </div>
          {messageErreur && (
            <div className="alert alert-warning">{messageErreur}</div>
          )}
          <MotsTrouvesList
            solutionsTrouvees={solutionsTrouvees}
            solutionsPossibles={solutionsPossibles}
          />
          <ProgressBar progressionPourcent={progressionPourcent} />
          <button className="btn btn-danger me-2" onClick={handleFin}>
            Fin
          </button>
          <button className="btn btn-secondary" onClick={initJeu}>
            Nouveau
          </button>
        </>
      ) : (
        <>
          <MotsTrouvesList
            solutionsTrouvees={solutionsTrouvees}
            solutionsPossibles={solutionsPossibles}
          />
          <FinDuJeu
            solutionsTrouvees={solutionsTrouvees}
            solutionsPossibles={solutionsPossibles}
            onRejouer={initJeu}
          />
        </>
      )}

      {jeuTermine &&
        toutesLesReponsesSontBonnes(solutionsTrouvees, solutionsPossibles) &&
        afficherConfetti && <ConfettiWrapper run={afficherConfetti} />}
    </div>
  );
}
