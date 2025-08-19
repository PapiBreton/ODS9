const Mot = require("../models/Mot");

/*await Mot.updateMany(
    
    { $set: { visible: true } }
  );*/

// Récupérer tous les mots
exports.getAllMots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    const skip = (page - 1) * limit;
    const startsWith = req.query.startsWith || "";

    const query = {
      ...(startsWith
        ? { mot: { $regex: `^${startsWith}`, $options: "i" } }
        : {}),
      visible: true,
    };

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

// Cacher un mot (mettre visible à false)
exports.cacherMot = async (req, res) => {
  console.log(`Cacher le mot avec ID: ${req.params.id}`);
  try {
    const motId = req.params.id;
    const mot = await Mot.findByIdAndUpdate(
      motId,
      { visible: false },
      { new: true }
    );

    if (!mot) return res.status(404).json({ message: "Mot non trouvé" });

    res.json({ message: "Mot caché avec succès", mot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
