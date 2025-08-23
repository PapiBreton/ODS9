const mongoose = require("mongoose");
const Prefix = require("../models/Prefix");

// 🔧 Utilitaire pour supprimer les accents
const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// 🎲 GET /api/prefixes/random
exports.getRandom = async (req, res) => {
  try {
    const [randomDoc] = await Prefix.aggregate([{ $sample: { size: 1 } }]);

    if (!randomDoc) {
      return res.status(404).json({ error: "Aucun document trouvé" });
    }

    res.json({
      word: removeAccents(randomDoc.word),
      prefix: randomDoc.prefix,
      solution: removeAccents(randomDoc.solution),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📄 GET /api/prefixes?page=1&limit=20&search=mot
exports.getAllPrefixes = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      ...(search
        ? {
            $or: [
              { prefix: { $regex: search, $options: "i" } },
              { word: { $regex: search, $options: "i" } },
              { solution: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
      $and: [
        { word: { $type: "string" } },
        { $expr: { $gte: [{ $strLenCP: "$word" }, 2] } },
      ],
    };

    const rawData = await Prefix.find(query)
      .sort({ word: 1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Prefix.countDocuments(query);

    const cleanedData = rawData.map((item) => ({
      ...item.toObject(),
      prefix: item.prefix ? removeAccents(item.prefix) : item.prefix,
      word: item.word ? removeAccents(item.word) : item.word,
      solution: item.solution ? removeAccents(item.solution) : item.solution,
    }));

    res.json({ total: totalCount, data: cleanedData });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// 🔎 GET /api/prefixes/:prefix
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

// ✏️ PUT /api/prefixes/:id
exports.updatePrefix = async (req, res) => {
  try {
    const { word, solution } = req.body;

    const updated = await Prefix.findByIdAndUpdate(
      req.params.id,
      { word, solution },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// 🗑 DELETE /api/prefixes/:id
exports.deletePrefix = async (req, res) => {
  try {
    const deleted = await Prefix.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    res.json({ message: "Document supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

exports.getByInitialLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();

    const query = {
      word: { $regex: `^${letter}`, $options: "i" },
      $and: [
        { word: { $type: "string" } },
        { $expr: { $gte: [{ $strLenCP: "$word" }, 2] } },
      ],
    };

    const rawData = await Prefix.find(query).sort({ word: 1 });

    const cleanedData = rawData.map((item) => ({
      ...item.toObject(),
      prefix: item.prefix ? removeAccents(item.prefix) : item.prefix,
      word: item.word ? removeAccents(item.word) : item.word,
      solution: item.solution ? removeAccents(item.solution) : item.solution,
    }));

    res.json({ total: cleanedData.length, data: cleanedData });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

exports.getLetterCounts = async (req, res) => {
  try {
    const counts = {};
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    for (const letter of alphabet) {
      const count = await Prefix.countDocuments({
        word: { $regex: `^${letter}`, $options: "i" },
      });
      counts[letter] = count;
    }

    res.json({ counts }); // 👈 bien encapsulé dans "counts"
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
