import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    reason: { type: String, required: true },
    event: { type: String, required: true },
    venue: { type: String, required: true },

    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },

    participantsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }], // array of references to User documents

    proof: { type: String }, // e.g., Cloudinary URL or filename

    remarks: { type: String },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requesttype: {
        type: String,
        required: true
    },
    officials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        }
    ],
    staffs:
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        },
        approved: {
            type: Boolean,
            default: null
        }
    }
    ,
    acceptedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        }
    ],
    rejectedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        }
    ]
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
