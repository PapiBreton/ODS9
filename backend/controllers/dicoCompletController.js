const DicoComplet = require("../models/DicoComplet");

// Montrer les rajouts
exports.getRajouts = async (req, res) => {
  try {
    const searchTerm = decodeURIComponent(req.params.mot.trim());

    const data = await DicoComplet.find({
      mot: { $regex: searchTerm, $options: "i" },
    })
      .limit(100)
      .select("mot -_id");

    const motsTrouvés = data.map((doc) => doc.mot);

    if (motsTrouvés.length === 0) {
      return res.status(404).json({ data: [] });
    }
    res.json({ data: motsTrouvés });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
