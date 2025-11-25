const express = require("express");
const router = express.Router();
const Report = require("../models/report");
const { isLoggedIn } = require("../middleware/auth");
const multer = require("multer");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reports"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ===============================
// 4. PAGE ROUTE
// ===============================
router.get("/", isLoggedIn, (req, res) => {
  res.render("records/reports", {
    title: "Medical Reports",
    currentUser: req.session.user
  });
});

// ===============================
// 1. GET REPORTS DATA (used by JS)
// ===============================
router.get("/data", isLoggedIn, async (req, res) => {
  const reports = await Report.find({ user: req.session.user._id }).sort({ createdAt: -1 });
  res.json(reports);
});


// ===============================
// 2. ADD REPORT  (used by JS)
// ===============================
router.post("/add", isLoggedIn, upload.single("file"), async (req, res) => {
  await Report.create({
    user: req.session.user._id,
    name: req.body.name,
    type: req.body.type,
    category: req.body.category,
    date: req.body.date,
    doctor: req.body.doctor,
    fileUrl: "/uploads/reports/" + req.file.filename
  });

  res.status(200).json({ success: true });
});


// ===============================
// 3. DELETE REPORT (used by JS)
// ===============================
router.delete("/delete/:id", isLoggedIn, async (req, res) => {
  await Report.deleteOne({
    _id: req.params.id,
    user: req.session.user._id
  });

  res.json({ success: true });
});




module.exports = router;
