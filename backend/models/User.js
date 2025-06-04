import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    classSection: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    classIncharge: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },
    counsellor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },
        hod: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },
    role: { type: String, enum: ['student', 'staff'], required: true },
    profileImg: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
