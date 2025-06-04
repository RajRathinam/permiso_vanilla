import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted the complaint
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Category of the complaint (e.g., Hostel, Class, Food)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of the issue
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary image URL related to the complaint
    imageUrl: {
      type: String,
      required: true,
    },

    // Users who liked this complaint (array of user ObjectIds)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Exporting the Complaint model
export default mongoose.model('Complaint', complaintSchema);
