// controllers/motController.js
const Mot = require("../models/Mot");

// Helper pour vérifier les lettres obligatoires avec multiplicités
const hasAtLeast = (s, ch, count) =>
  (s.match(new RegExp(ch, "g")) || []).length >= count;

exports.draw = async (req, res) => {
  try {
    let { required = "", forbidden = "", length } = req.body;
    required = required.toUpperCase().replace(/[^A-Z]/g, "");
    forbidden = forbidden.toUpperCase().replace(/[^A-Z]/g, "");
    length = Number(length);
    console.log({ required, forbidden, length });

    if (!length || length < 2) {
      return res.status(400).json({ error: "Longueur invalide" });
    }

    // Construction du matchStage avec exclusion stricte des lettres interdites
    const matchStage = {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $strLenCP: "$normalized" }, length] },
            ...[...forbidden].map((ch) => ({
              $not: { $regexMatch: { input: "$normalized", regex: ch } },
            })),
          ],
        },
      },
    };

    const pipeline = [
      matchStage,
      {
        $group: {
          _id: "$normalized",
          mots: { $addToSet: "$mot" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gte: 1 } } },
      { $sample: { size: 30 } },
    ];

    const candidates = await Mot.aggregate(pipeline);

    // Vérification des lettres obligatoires avec multiplicités
    const pickable = candidates.filter((c) => {
      if (!required) return true;
      const counts = [...required].reduce((acc, ch) => {
        acc[ch] = (acc[ch] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).every(([ch, cnt]) =>
        hasAtLeast(c._id, ch, cnt)
      );
    });

    if (!pickable.length) {
      return res.status(404).json({ error: "Aucun tirage trouvé" });
    }

    const chosen = pickable[Math.floor(Math.random() * pickable.length)];
    res.json({ normalized: chosen._id, total: chosen.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.guess = async (req, res) => {
  try {
    let { normalized, guess } = req.body;
    normalized = normalized.toUpperCase();
    guess = guess.toUpperCase().replace(/[^A-Z]/g, "");

    const doc = await Mot.findOne(
      { mot: guess, normalized },
      { definition: 1 }
    ).lean();
    if (!doc) return res.json({ ok: false });

    res.json({ ok: true, definition: doc.definition || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.stats = async (req, res) => {
  try {
    const { normalized } = req.query;
    const data = await Mot.aggregate([
      { $match: { normalized: normalized.toUpperCase() } },
      {
        $group: {
          _id: "$normalized",
          mots: { $addToSet: "$mot" },
          total: { $sum: 1 },
        },
      },
    ]);
    if (!data.length) return res.status(404).json({ error: "Introuvable" });
    res.json({ total: data[0].total, samples: data[0].mots.slice(0, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
