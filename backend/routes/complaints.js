// ... your existing imports
import express from 'express';
import multer from 'multer';
import Complaint from '../models/Complaint.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const router = express.Router();

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// =========================
// POST Complaint
// =========================
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { category, description, userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No image file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path); // Clean up temp file

    const newComplaint = new Complaint({
      userId,
      category,
      description,
      imageUrl: uploadResult.secure_url,
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET all complaints
// =========================
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: 1 })
      .populate('userId', '_id registerNumber fullName classSection profileImg');

    const formattedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      user: {
        _id: complaint.userId._id,
        registerNumber: complaint.userId.registerNumber,
        fullName: complaint.userId.fullName,
        classSection: complaint.userId.classSection,
        profileImg: complaint.userId.profileImg,
      },
      category: complaint.category,
      description: complaint.description,
      imageUrl: complaint.imageUrl,
      createdAt: complaint.createdAt.toISOString().split('T')[0],
      likes: complaint.likes || [],
    }));

    res.json(formattedComplaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// DELETE Complaint
// =========================
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (complaint.userId.toString() !== req.body.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete Cloudinary image
    const imageUrl = complaint.imageUrl;
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    await complaint.deleteOne();
    res.json({ message: "Complaint and image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET Complaints by User
// =========================
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: 1 })
      .populate('userId', '_id registerNumber fullName classSection');

    const formattedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      user: {
        _id: complaint.userId._id,
        registerNumber: complaint.userId.registerNumber,
        fullName: complaint.userId.fullName,
        classSection: complaint.userId.classSection,
      },
      category: complaint.category,
      description: complaint.description,
      imageUrl: complaint.imageUrl,
      createdAt: complaint.createdAt.toISOString().split('T')[0],
      likes: complaint.likes || [],
    }));

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.json(formattedComplaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// LIKE a Complaint
// =========================
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (!complaint.likes.includes(userId)) {
      complaint.likes.push(userId);
      await complaint.save();
    }

    res.json({ message: "Liked the complaint", likes: complaint.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// DISLIKE (Unlike) a Complaint
// =========================
router.post('/:id/dislike', async (req, res) => {
  try {
    const { userId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.likes = complaint.likes.filter((id) => id.toString() !== userId);
    await complaint.save();

    res.json({ message: "Disliked the complaint", likes: complaint.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
