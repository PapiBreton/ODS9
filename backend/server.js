require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/mots", require("./routes/mots"));
app.use("/api/anagrammes", require("./routes/anagrammes"));
app.use("/api/dicoComplet", require("./routes/dicoComplet"));
app.use("/api/prefixes", require("./routes/prefixRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur backend sur port ${PORT}`));
