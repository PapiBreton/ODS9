const AnagramGroup = require("../models/Anagrammes");
const DicoComplet = require("../models/DicoComplet");

const {
  shuffleArray,
  normalizeWord,
  generateEasyLetters,
} = require("../utils/utils");

exports.getInitJeu = async (req, res) => {
  try {
    const LENGTH = 8;

    const [doc] = await AnagramGroup.aggregate([
      { $match: { normalized: { $regex: `^.{${LENGTH}}$` } } },
      { $sample: { size: 1 } },
    ]);

    if (!doc) return res.status(404).json({ error: "Aucun mot trouvé" });

    let tirage = doc.normalized.split("");
    const indexRetiré = Math.floor(Math.random() * tirage.length);
    const lettreRetirée = tirage.splice(indexRetiré, 1)[0];
    const tirageAlpha = [...tirage].sort();
    const lettresAleatoires = generateEasyLetters(7, [
      ...tirageAlpha,
      lettreRetirée,
    ]);
    const plateau = shuffleArray([lettreRetirée, ...lettresAleatoires]);

    const combinaisons = plateau.map((lettre) =>
      normalizeWord([...tirageAlpha, lettre].join(""))
    );

    const groupes = await AnagramGroup.find({
      normalized: { $in: combinaisons },
    });

    const solutionsPossibles = [];

    for (let lettre of plateau) {
      const normalized = normalizeWord([...tirageAlpha, lettre].join(""));
      const groupe = groupes.find((g) => g.normalized === normalized);

      if (groupe && groupe.mots.length > 0) {
        solutionsPossibles.push({ lettre, mots: groupe.mots });
      } else {
        // Recherche de secours dans DicoComplet
        const motsDico = await DicoComplet.find({ normalized }).limit(30); // limite pour éviter surcharge
        const mots = motsDico.flatMap((entry) => entry.mot || []);
        if (mots.length > 0) {
          solutionsPossibles.push({ lettre, mots });
        }
      }
    }
    res.json({
      tirage: tirageAlpha,
      lettresPlateau: plateau,
      solutionsPossibles,
    });
  } catch (error) {
    console.error("Erreur initJeu:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
