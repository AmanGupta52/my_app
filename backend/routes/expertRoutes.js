const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");
const bcrypt = require("bcryptjs");
const multer = require("multer");

// ================== MULTER CONFIG ==================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG/PNG images allowed"));
    }
    cb(null, true);
  }
});

// Helper: convert CSV string to array
const toArray = (val) =>
  val ? val.split(",").map(v => v.trim()).filter(Boolean) : [];

// Helper: validate email
const isEmail = (email) =>
  /^\S+@\S+\.\S+$/.test(email);

// Helper: allowed roles
const allowedRoles = ["expert", "moderator"];

// ================== ROUTES ==================

// 📌 Get all experts
router.get("/", async (req, res) => {
  try {
    const experts = await Expert.find().select("-password");

    const formatted = experts.map((exp) => {
      let imgBase64 = null;
      if (exp.img?.data) {
        imgBase64 = `data:${exp.img.contentType};base64,${exp.img.data.toString("base64")}`;
      }
      return { ...exp.toObject(), img: imgBase64 };
    });

    res.json(formatted);
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
    if (expert.img?.data) {
      imgBase64 = `data:${expert.img.contentType};base64,${expert.img.data.toString("base64")}`;
    }

    res.json({ ...expert.toObject(), img: imgBase64 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching expert" });
  }
});

// 📌 Add new expert
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

    // Required fields
    if (!fullName || !expertId || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Email format validation
    if (!isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Role validation
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newExpert = new Expert({
      fullName,
      expertId,
      title,
      availability,
      time,
      experience,
      specialities: toArray(specialities),
      languages: toArray(languages),
      email,
      password: hashedPassword,
      role,
    });

    if (req.file) {
      newExpert.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await newExpert.save();
    res.status(201).json({ message: "✔ Expert added successfully", expert: newExpert });
  } catch (err) {
    console.error("Error adding expert:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate email or expertId" });
    }
    res.status(500).json({ message: "Error adding expert" });
  }
});

// 📌 Update expert
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const updates = {};

    // Prevent unwanted fields
    const allowedFields = [
      "fullName",
      "title",
      "availability",
      "time",
      "experience",
      "specialities",
      "languages",
      "email",
      "password",
      "role"
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate email
    if (updates.email && !isEmail(updates.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate role
    if (updates.role && !allowedRoles.includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If updating password
    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Handle image update
    if (req.file) {
      updates.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Convert CSV fields
    if (updates.specialities) updates.specialities = toArray(updates.specialities);
    if (updates.languages) updates.languages = toArray(updates.languages);

    const expert = await Expert.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!expert) return res.status(404).json({ message: "Expert not found" });

    let imgBase64 = null;
    if (expert.img?.data) {
      imgBase64 = `data:${expert.img.contentType};base64,${expert.img.data.toString("base64")}`;
    }

    res.json({ message: "✔ Expert updated", expert: { ...expert.toObject(), img: imgBase64 } });
  } catch (err) {
    res.status(500).json({ message: "Error updating expert" });
  }
});

// 📌 Delete expert
router.delete("/:id", async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ message: "Expert not found" });
    res.json({ message: "🗑 Expert deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expert" });
  }
});

module.exports = router;
