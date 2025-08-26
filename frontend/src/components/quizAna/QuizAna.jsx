import { useState } from "react";
import SettingsForm from "./SettingsForm";
import GamePanel from "./GamePanel";

export default function QuizAna() {
  const [game, setGame] = useState(null);

  return (
    <div className="container py-4 text-dark">
      <h1 className="mb-4">QuizMots</h1>
      {game ? (
        <GamePanel game={game} onQuit={() => setGame(null)} />
      ) : (
        <SettingsForm onStart={setGame} />
      )}
      <footer className="text-center text-muted text-dark mt-4">
        Dictionnaire : 66 000 entrées
      </footer>
    </div>
  );
}
