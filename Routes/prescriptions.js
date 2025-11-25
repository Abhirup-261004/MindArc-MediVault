const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescription");
const { isLoggedIn } = require("../middleware/auth");
const multer = require("multer");

// Multer upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/prescriptions"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// 4. PAGE ROUTE
router.get("/", isLoggedIn, (req, res) => {
  res.render("records/prescriptions", {
    title: "Prescriptions",
    currentUser: req.session.user
  });
});

// 1. RETURN ALL PRESCRIPTIONS
router.get("/data", isLoggedIn, async (req, res) => {
  const items = await Prescription.find({ user: req.session.user._id }).sort({ createdAt: -1 });
  res.json(items);
});


// 2. ADD PRESCRIPTION
router.post("/add", isLoggedIn, upload.single("file"), async (req, res) => {
  await Prescription.create({
    user: req.session.user._id,
    name: req.body.name,
    type: req.body.type,
    specialty: req.body.specialty,
    date: req.body.date,
    doctor: req.body.doctor,
    fileUrl: "/uploads/prescriptions/" + req.file.filename
  });

  res.json({ success: true });
});


// 3. DELETE PRESCRIPTION
router.delete("/delete/:id", isLoggedIn, async (req, res) => {
  await Prescription.deleteOne({
    _id: req.params.id,
    user: req.session.user._id
  });

  res.json({ success: true });
});

module.exports = router;
