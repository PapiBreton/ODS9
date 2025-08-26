const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const normalizeWord = (word) =>
  word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .split("")
    .sort()
    .join("");

const easyFrequencies = {
  A: 6,
  B: 1,
  C: 1,
  D: 2,
  E: 8,
  F: 1,
  G: 1,
  H: 1,
  I: 5,
  J: 0,
  K: 0,
  L: 2,
  M: 2,
  N: 3,
  O: 3,
  P: 1,
  Q: 0,
  R: 3,
  S: 3,
  T: 3,
  U: 3,
  V: 1,
  W: 0,
  X: 0,
  Y: 0,
  Z: 0,
};

const generateEasyLetters = (count, exclude = []) => {
  const lettresDisponibles = Object.entries(easyFrequencies).filter(
    ([lettre, freq]) => freq > 0 && !exclude.includes(lettre)
  );

  const lettresPondérées = lettresDisponibles.flatMap(([lettre, freq]) =>
    Array(freq).fill(lettre)
  );

  const lettresMélangées = shuffleArray(lettresPondérées);
  const lettresChoisies = [...new Set(lettresMélangées)].slice(0, count);

  if (lettresChoisies.length < count) {
    throw new Error("Pas assez de lettres disponibles.");
  }

  return lettresChoisies;
};

module.exports = { shuffleArray, normalizeWord, generateEasyLetters };
