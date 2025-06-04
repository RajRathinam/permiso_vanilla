import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    classSection: { type: String},
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true },
    profileImg: { type: String, default: '' },
    eventManaging:{ type: String, default: ''},
    // New arrays for staff users
    classStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    counsellingStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
