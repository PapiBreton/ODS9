const Mot = require("../models/Mot");

// Récupérer tous les mots
exports.getAllMots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    const skip = (page - 1) * limit;
    const startsWith = req.query.startsWith || "";

    const query = startsWith
      ? { mot: { $regex: `^${startsWith}`, $options: "i" } }
      : {};

    const mots = await Mot.find(query).skip(skip).limit(limit);
    const total = await Mot.countDocuments(query);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      mots,
    });
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
