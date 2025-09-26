const express = require("express");
const dotenv = require("dotenv");
dotenv.config();  // ← must be first
// const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

// Default query covering your services
const DEFAULT_QUERY = `Fears OR Phobias OR "Anger Management" OR "Stress Management" OR "Child Care" OR "Dream Analysis" OR Sleep OR "Relationship Counselling" OR Trauma OR Depression OR Anxiety OR Migraines OR "Eating Disorders" OR "Body Dysmorphia" OR "Panic Disorder" OR Bipolar OR Schizophrenia OR "Personality Disorders" OR Paranoia OR "Dissociative Disorders" OR PTSD OR "Obsessive Compulsive Disorders"`;
console.log("NewsAPI Key:", process.env.NEWS_API_KEY);

// GET /api/news
router.get("/", async (req, res) => {
  try {
    const query = req.query.q || DEFAULT_QUERY;
    const cacheKey = `news:${query}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Call NewsAPI
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url, { timeout: 10000 });
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    console.error("News API Error:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
