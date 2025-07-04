import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import Staff from '../models/Staff.js';


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Change Password
export const changePassword = async (req, res) => {
  const { registerNumber, password, newPassword, role } = req.body;

  try {
    const user = role == 'student' ? await User.findOne({ registerNumber }) : await Staff.findOne({ registerNumber });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Password Not Match" });
    }

    user.password = newPassword; // simpler way
    await user.save();

    res.json({ message: "Password updated successfully", user });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: "Server Error" });
  }
}


// Login User
export const loginUser = async (req, res) => {
  const { registerNumber, password, role } = req.body;


  try {
    const user = role == 'student' ? await User.findOne({ registerNumber }).populate('classIncharge', '_id fullName department').populate('counsellor', '_id fullName department').populate('hod', '_id fullName department') : await Staff.findOne({ registerNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    let userData = {};

    if (role == 'student') {
      userData = {
        _id: user._id,
        fullName: user.fullName,
        registerNumber: user.registerNumber,
        dateOfBirth: user.dateOfBirth,
        classSection: user.classSection,
        department: user.department,
        email: user.email,
        phoneNumber: user.phoneNumber,
        classIncharge: {
          _id: user.classIncharge._id,
          fullName: user.classIncharge.fullName,
          department: user.classIncharge.department
        },
        counsellor: {
          _id: user.counsellor._id,
          fullName: user.counsellor.fullName,
          department: user.counsellor.department
        },
        hod: {
          _id: user.hod._id,
          fullName: user.hod.fullName,
          department: user.hod.department
        },
        role: user.role,
        profileImg: user.profileImg
      }

    }
    else {
      userData = {
        _id: user._id,
        fullName: user.fullName,
        registerNumber: user.registerNumber,
        dateOfBirth: user.dateOfBirth,
        classSection: user.classSection,
        department: user.department,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profileImg: user.profileImg,
        classStudents: user.classStudents,
        counsellingStudents:user.counsellingStudents
      }
    }
    res.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all students
export const getAllUsers = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('fullName registerNumber classSection profileImg _id');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// Add New Student
export const addStudent = async (req, res) => {
  const {
    fullName,
    registerNumber,
    password,
    dateOfBirth,
    classSection,
    department,
    email,
    phoneNumber,
    classIncharge,
    counsellor,
    hod
  } = req.body;

  const file = req.file; // multer will populate this if a file was uploaded

  try {
    // Check if student already exists
    const existingUser = await User.findOne({
      $or: [{ registerNumber }, { email }]
    });

    if (existingUser) {
      if (file) fs.unlinkSync(file.path); // Clean up uploaded file
      return res.status(400).json({ message: 'Student already exists' });
    }

    let profileImgUrl = '';

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path); // Clean up temp file
      profileImgUrl = uploadResult.secure_url;
    }

    const newStudent = new User({
      fullName,
      registerNumber,
      password,
      dateOfBirth,
      classSection,
      department,
      email,
      phoneNumber,
      classIncharge,
      counsellor,
      hod,
      role: 'student',
      profileImg: profileImgUrl
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student added successfully', student: newStudent });

  } catch (error) {
    console.error('Error adding student:', error);
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ message: 'Server error while adding student' });
  }
};

// Add New Staff
export const addNewStaff = async (req, res) => {
  const {
    fullName,
    registerNumber,
    password,
    department,
    dateOfBirth,
    classSection,
    email,
    phoneNumber,
    profileImg, // optional
    classStudents,
    counsellingStudents,
    eventManaging,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Staff.findOne({
      $or: [{ registerNumber }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Staff already exists with same Register Number or Email' });
    }

    const newStaff = new Staff({
      fullName,
      registerNumber,
      password,
      dateOfBirth,
      classSection,
      department,
      email,
      phoneNumber,
      role: 'staff',
      profileImg,
      classStudents,
      counsellingStudents,
      eventManaging
    });

    await newStaff.save();

    res.status(201).json({ message: 'Staff added successfully', staff: newStaff });

  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Server error while adding staff' });
  }
};


// Get all students
export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find({ role: 'staff' }).select('fullName registerNumber department classSection profileImg _id');
    res.status(200).json(staffs);
  } catch (error) {
    console.error('Error fetching staffs:', error);
    res.status(500).json({ message: 'Server error while fetching staffs' });
  }
};

