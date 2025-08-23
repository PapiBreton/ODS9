const DicoComplet = require("../models/DicoComplet");

// Montrer les rajouts
exports.getRajouts = async (req, res) => {
  try {
    const searchTerm = decodeURIComponent(req.params.mot.trim());

    const data = await DicoComplet.aggregate([
      {
        $match: {
          mot: { $regex: searchTerm, $options: "i" },
        },
      },
      {
        $addFields: {
          longueur: { $strLenCP: "$mot" },
        },
      },
      {
        $sort: {
          longueur: 1, // Tri par longueur croissante
          mot: 1, // Puis tri alphabétique
        },
      },
      {
        $limit: 100,
      },
      {
        $project: {
          mot: 1,
          _id: 0,
        },
      },
    ]);

    const motsTrouves = data
      .map((doc) => String(doc.mot))
      .filter((mot) => mot.toLowerCase() !== searchTerm.toLowerCase());

    if (motsTrouves.length === 0) {
      return res.status(404).json({ data: [] });
    }
    res.json({ data: motsTrouves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
