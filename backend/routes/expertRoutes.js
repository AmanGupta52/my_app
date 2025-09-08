const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");
const bcrypt = require("bcrypt");
const multer = require("multer");

// ================== MULTER CONFIG ==================
const storage = multer.memoryStorage(); // store in memory as Buffer
const upload = multer({ storage });

// ================== ROUTES ==================

// 📌 Get all experts (convert image buffer to base64)
router.get("/", async (req, res) => {
  try {
    const experts = await Expert.find().select("-password");

    const formattedExperts = experts.map((exp) => {
      let imgBase64 = null;
      if (exp.img && exp.img.data) {
        imgBase64 = `data:${exp.img.contentType};base64,${exp.img.data.toString("base64")}`;
      }
      return { ...exp.toObject(), img: imgBase64 };
    });

    res.json(formattedExperts);
  } catch (err) {
    console.error("Error fetching experts:", err);
    res.status(500).json({ message: "Error fetching experts" });
  }
});

// 📌 Get single expert by ID
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).select("-password");
    if (!expert) return res.status(404).json({ message: "Expert not found" });

    let imgBase64 = null;
    if (expert.img && expert.img.data) {
      imgBase64 = `data:${expert.img.contentType};base64,${expert.img.data.toString("base64")}`;
    }

    res.json({ ...expert.toObject(), img: imgBase64 });
  } catch (err) {
    console.error("Error fetching expert:", err);
    res.status(500).json({ message: "Error fetching expert" });
  }
});

// 📌 Add new expert (with optional image upload)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const {
      fullName,
      expertId,
      title,
      availability,
      time,
      experience,
      specialities,
      languages,
      email,
      password,
      role,
    } = req.body;

    if (!fullName || !expertId || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields (fullName, expertId, email, password)" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newExpert = new Expert({
      fullName,
      expertId,
      title,
      availability,
      time,
      experience,
      specialities: specialities ? specialities.split(",") : [],
      languages: languages ? languages.split(",") : [],
      email,
      password: hashedPassword,
      role,
    });

    // If image uploaded
    if (req.file) {
      newExpert.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await newExpert.save();
    res.status(201).json({ message: "✅ Expert added successfully", expert: newExpert });
  } catch (err) {
    console.error("Error adding expert:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate email or expertId" });
    }
    res.status(500).json({ message: "Error adding expert" });
  }
});

// 📌 Update expert (with optional image upload)
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const updates = { ...req.body };

    // re-hash password if updating
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // handle image update
    if (req.file) {
      updates.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const expert = await Expert.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!expert) return res.status(404).json({ message: "Expert not found" });

    let imgBase64 = null;
    if (expert.img && expert.img.data) {
      imgBase64 = `data:${expert.img.contentType};base64,${expert.img.data.toString("base64")}`;
    }

    res.json({ message: "✅ Expert updated successfully", expert: { ...expert.toObject(), img: imgBase64 } });
  } catch (err) {
    console.error("Error updating expert:", err);
    res.status(500).json({ message: "Error updating expert" });
  }
});

// 📌 Delete expert
router.delete("/:id", async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ message: "Expert not found" });
    res.json({ message: "🗑️ Expert deleted successfully" });
  } catch (err) {
    console.error("Error deleting expert:", err);
    res.status(500).json({ message: "Error deleting expert" });
  }
});

module.exports = router;
