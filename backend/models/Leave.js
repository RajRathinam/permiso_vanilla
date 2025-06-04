import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requesttype:{
            type: String,
            required: true
        },
        numberOfDays: {
            type: Number,
            required: true,
        },
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true
        },
        officials:[
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
    },
    {
        timestamps: true,
    }
)


export default mongoose.model('Leave', leaveSchema);