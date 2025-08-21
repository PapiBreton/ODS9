const Mot = require("../models/Mot");
// Controller pour gérer les mots
// Utilitaire pour échapper les caractères spéciaux dans une regex
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fonction qui construit la requête MongoDB
const buildMotQuery = ({ startsWith, contains, excludes, endsWith }) => {
  const andConditions = [{ visible: true }];

  if (startsWith) {
    andConditions.push({
      mot: { $regex: `^${escapeRegex(startsWith)}`, $options: "i" },
    });
  }

  if (contains) {
    andConditions.push({
      mot: { $regex: escapeRegex(contains), $options: "i" },
    });
  }

  if (endsWith) {
    andConditions.push({
      mot: { $regex: `${escapeRegex(endsWith)}$`, $options: "i" },
    });
  }

  if (excludes) {
    andConditions.push({
      mot: { $not: new RegExp(`[${escapeRegex(excludes)}]`, "i") },
    });
  }

  return andConditions.length > 1 ? { $and: andConditions } : andConditions[0];
};

// Contrôleur principal
exports.getAllMots = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;

    // Extraire et convertir les longueurs
    const minLen = parseInt(req.query.minLength) || 2;
    const maxLen = parseInt(req.query.maxLength) || 8;

    // Base de votre query existante
    const query = buildMotQuery({
      startsWith: req.query.startsWith || "",
      contains: req.query.contains || "",
      excludes: req.query.excludes || "",
      endsWith: req.query.endsWith || "",
    });

    // Ajout du filtre de longueur via regex
    if (minLen !== null || maxLen !== null) {
      // Ex. ?minLength=3&maxLength=5 → /^.{3,5}$/
      const minPart = minLen !== null ? minLen : "";
      const maxPart = maxLen !== null ? maxLen : "";
      query.mot = {
        ...query.mot,
        $regex: new RegExp(`^.{${minPart},${maxPart}}$`),
      };
    }

    const [mots, total] = await Promise.all([
      Mot.find(query).sort({ mot: 1 }).skip(skip).limit(limit).lean(),
      Mot.countDocuments(query),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      mots,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des mots:", error);
    res.status(500).json({ error: "Erreur serveur" });
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
