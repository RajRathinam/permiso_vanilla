import mongoose from "mongoose";

const ondutySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventCoordinatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
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
        event: {
            type: String,
            required: true
        },
          eventName: {
            type: String,
            required: true
        },
          venue: {
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


export default mongoose.model('Onduty', ondutySchema);