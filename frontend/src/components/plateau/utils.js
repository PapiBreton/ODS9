export const toutesLesReponsesSontBonnes = (trouvees, possibles) => {
  const tousMotsPossibles = possibles.flatMap((sol) => sol.mots);
  return tousMotsPossibles.every((mot) => trouvees.includes(mot));
};

export const calculerScore = (mot, valeursScrabble) =>
  mot
    .split("")
    .reduce((acc, lettre) => acc + (valeursScrabble[lettre] || 0), 0);
