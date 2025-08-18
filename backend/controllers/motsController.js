const Mot = require("../models/Mot");

// Récupérer tous les mots
exports.getAllMots = async (req, res) => {
  try {
    const mots = await Mot.find().limit(15); // pagination possible
    console.log(`Nombre de mots récupérés: ${mots.length}`);
    res.json(mots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rechercher un mot précis
exports.getMot = async (req, res) => {
  console.log(`Recherche du mot: ${req.params.mot}`);
  try {
    const mot = await Mot.findOne({ mot: req.params.mot.toUpperCase() });
    if (!mot) return res.status(404).json({ message: "Mot non trouvé" });
    res.json(mot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
