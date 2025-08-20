const Mot = require("../models/Mot");

// Récupérer tous les mots avec filtres
exports.getAllMots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    const skip = (page - 1) * limit;

    const startsWith = req.query.startsWith || "";
    const contains = req.query.contains || "";
    const excludes = req.query.excludes || "";
    const endsWith = req.query.endsWith || "";

    // Construction dynamique de la regex
    // ^ = début, $ = fin, .* = caractères quelconques
    let regexPattern = "";

    if (startsWith) {
      regexPattern += `^${startsWith}`;
    } else {
      regexPattern += ".*";
    }

    if (contains) {
      // ajout des lettres obligatoires de manière non ordonnée
      for (const letter of contains) {
        regexPattern += `(?=.*${letter})`;
      }
    }

    if (endsWith) {
      regexPattern += `${endsWith}$`;
    } else {
      regexPattern += ".*";
    }

    const query = {
      visible: true,
      normalized: { $regex: regexPattern, $options: "i" },
    };

    if (excludes) {
      // Filtrer les mots ne contenant PAS certaines lettres
      query.normalized.$not = new RegExp(`[${excludes}]`, "i");
    }

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
