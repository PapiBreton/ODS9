import { useEffect, useState } from "react";

export default function TimerDisplay({ tempsRestant, jeuTermine }) {
  const [tempsFinal, setTempsFinal] = useState(null);

  useEffect(() => {
    if (jeuTermine && tempsFinal === null) {
      setTempsFinal(tempsRestant); // Capture le temps au moment où le jeu se termine
    }
  }, [jeuTermine, tempsRestant, tempsFinal]);

  const afficherTemps = () => {
    const temps = jeuTermine ? tempsFinal : tempsRestant;
    const minutes = Math.floor(temps / 60);
    const secondes = String(temps % 60).padStart(2, "0");
    return `${minutes}:${secondes}`;
  };

  return (
    <div className="my-3">
      <span className="text-info">Temps restant : </span>
      {jeuTermine && <span className="text-info"> {afficherTemps()}</span>}
      {!jeuTermine && tempsRestant > 0 && (
        <span
          className={tempsRestant <= 10 ? "clignote" : ""}
          style={{ color: tempsRestant < 30 ? "red" : "yellow" }}
        >
          {afficherTemps()}
        </span>
      )}
    </div>
  );
}
