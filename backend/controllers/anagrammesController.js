const Anagrammes = require("../models/Anagrammes");

// Route anagrammes
// Rechercher un mot précis
exports.getAnagrammes = async (req, res) => {
  const alphabet = req.params.mot;
  console.log(`Recherche des anagrammes pour: ${alphabet}`);
  try {
    const data = await Anagrammes.findOne({
      normalized: alphabet,
    });
    if (!data) return res.status(404).json({ message: "Mot non trouvé" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
