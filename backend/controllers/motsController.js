const Mot = require("../models/Mot");
// Controller pour gérer les mots
// Utilitaire pour échapper les caractères spéciaux dans une regex
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Construit une query MongoDB pour filtrer les mots
 * @param {Object} params
 * @param {string} params.startsWith
 * @param {string} params.contains
 * @param {string} params.excludes
 * @param {string} params.endsWith
 * @param {number} params.minLength
 * @param {number} params.maxLength
 */
const buildMotQuery = ({
  startsWith,
  contains,
  excludes,
  endsWith,
  minLength,
  maxLength,
}) => {
  const andConditions = [{ visible: true }];

  if (startsWith) {
    andConditions.push({
      mot: { $regex: `^${escapeRegex(startsWith)}`, $options: "i" },
    });
  }

  if (contains) {
    // Pour chaque caractère, on crée un lookahead qui garantit sa présence
    const letters = Array.from(contains);
    const lookaheads = letters
      .map((char) => `(?=.*${escapeRegex(char)})`)
      .join("");
    const regex = new RegExp(`^${lookaheads}.*$`, "i");

    andConditions.push({
      mot: { $regex: regex },
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

  // Filtre sur la longueur du mot
  if (minLength != null || maxLength != null) {
    const minPart = minLength != null ? minLength : "";
    const maxPart = maxLength != null ? maxLength : "";
    const lengthRegex = new RegExp(`^.{${minPart},${maxPart}}$`);

    andConditions.push({
      mot: { $regex: lengthRegex },
    });
  }

  return andConditions.length > 1 ? { $and: andConditions } : andConditions[0];
};

exports.getAllMots = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 15)
    );
    const skip = (page - 1) * limit;

    // Longueurs minimale et maximale
    const minLength =
      req.query.minLength != null ? parseInt(req.query.minLength, 10) : null;
    const maxLength =
      req.query.maxLength != null ? parseInt(req.query.maxLength, 10) : null;

    // Construction de la requête
    const query = buildMotQuery({
      startsWith: req.query.startsWith || "",
      contains: req.query.contains || "",
      excludes: req.query.excludes || "",
      endsWith: req.query.endsWith || "",
      minLength,
      maxLength,
    });

    // Exécution parallèle de la recherche et du comptage
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
