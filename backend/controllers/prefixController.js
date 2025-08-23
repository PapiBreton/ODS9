const Prefix = require("../models/Prefix");

exports.getRandom = async (req, res) => {
  try {
    const [randomDoc] = await Prefix.aggregate([{ $sample: { size: 1 } }]);

    if (!randomDoc) {
      return res.status(404).json({ error: "Aucun document trouvé" });
    }

    res.json({
      word: randomDoc.word?.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      prefix: randomDoc.prefix,
      solution: randomDoc.solution
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// GET /api/prefixes?page=1&limit=20&search=mot
// GET /api/prefixes
// GET /api/prefixes
const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

exports.getAllPrefixes = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = {
      ...(search
        ? {
            $or: [
              { prefix: { $regex: search, $options: "i" } },
              { word: { $regex: search, $options: "i" } },
              { definition: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
      $and: [
        { word: { $type: "string" } },
        { $expr: { $gte: [{ $strLenCP: "$word" }, 2] } },
      ],
    };

    const rawData = await Prefix.find(query).sort({ word: 1 });

    const cleanedData = rawData.map((item) => ({
      ...item.toObject(), // important pour convertir le document Mongoose
      prefix: item.prefix ? removeAccents(item.prefix) : item.prefix,
      word: item.word ? removeAccents(item.word) : item.word,
      definition: item.definition
        ? removeAccents(item.definition)
        : item.definition,
    }));

    res.json({ total: cleanedData.length, data: cleanedData });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

exports.getByPrefix = async (req, res) => {
  try {
    const data = await Prefix.find({
      prefix: req.params.prefix.toUpperCase(),
    }).sort({ word: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
