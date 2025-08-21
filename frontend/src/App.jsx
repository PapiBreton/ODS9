import { Routes, Route, Navigate } from "react-router";
import "./styles/main.scss";
import Liste from "./components/Liste";
import Recherche from "./components/Recherche";

function App() {
  return (
    <>
      <Routes>
        {/* Redirection automatique à l'arrivée sur le site de "/" vers "/anagrammes" */}
        <Route path="/" element={<Navigate to="/dico" replace />} />
        <Route path="/dico" element={<Liste />}></Route>
        <Route path="/recherche" element={<Recherche />}></Route>
        <Route path="*" element={<Liste />} />
      </Routes>
    </>
  );
}

export default App;
