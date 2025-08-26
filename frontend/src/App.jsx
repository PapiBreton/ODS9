import { Routes, Route, Navigate } from "react-router";
import "./styles/main.scss";
import Liste from "./components/Liste";
import Recherche from "./components/Recherche";
import Prefixes from "./components/prefix/Flashcard";
import PrefixesListe from "./components/prefix/Prefixlist";
import QuizAna from "./components/quizAna/QuizAna";
import AnagrammesJeu from "./components/plateau/AnagrammesJeu";
function App() {
  return (
    <>
      <Routes>
        {/* Redirection automatique à l'arrivée sur le site de "/" vers "/anagrammes" */}
        <Route path="/" element={<Navigate to="/dico" replace />} />
        <Route path="/dico" element={<Liste />}></Route>
        <Route path="/recherche" element={<Recherche />}></Route>
        <Route path="/prefix" element={<Prefixes />}></Route>
        <Route path="/listePrefixes" element={<PrefixesListe />}></Route>
        <Route path="/anagrammesJeu" element={<AnagrammesJeu />}></Route>
        //<Route path="/quizAna" element={<QuizAna />}></Route>
        <Route path="*" element={<Liste />} />
      </Routes>
    </>
  );
}

export default App;
