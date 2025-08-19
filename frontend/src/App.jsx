import { Routes, Route } from "react-router";
import "./styles/main.scss";
import Liste from "./components/Liste";
import Recherche from "./components/Recherche";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Liste />}></Route>
        <Route path="/recherche" element={<Recherche />}></Route>
        <Route path="*" element={<Liste />} />
      </Routes>
    </>
  );
}

export default App;
