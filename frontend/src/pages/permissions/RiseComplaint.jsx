import { useState } from "react";
import axios from "axios";

export default function RiseComplaint({authUser}) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("file", formData.file);
      data.append("userId", authUser._id); // Replace this with actual user ID

      const res = await axios.post("http://localhost:5000/api/complaints", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Complaint submitted successfully!");
      console.log("Server response:", res.data);

      setFormData({ category: "", description: "", file: null });
      setPreview(null);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full justify-center h-[600px] flex gap-24 items-center">
      <div className="p-6 w-[550px] bg-white shadow-lg border border-red-950">
        <h2 className="text-2xl font-bold mb-4 text-black">Raise a Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              <b>Category</b>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white"
              required
            >
              <option value="">Select a category</option>
              <option value="academic">Academic</option>
              <option value="hostel">Hostel</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              <b>Complaint Description</b>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white resize-none"
              rows="4"
              placeholder="Describe your issue..."
              required
              maxLength={250}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              <b>Attach Proof</b>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input w-full bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? (<span className="loading loading-spinner loading-sm"></span>) : "Submit Complaint"}
          </button>
        </form>
      </div>

      <div className="w-[35%]">
      <div className="w-full rounded-lg overflow-hidden flex flex-col justify-between shadow-md text-black">
      <div>
        <div className="flex items-center p-4 gap-3">
          <img
            src={authUser.profileImg || "/profileAvatar.jpeg"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-400 text-sm">{authUser.fullName}</span>
            <span className="text-sm text-gray-500">@{authUser.registerNumber}</span>
          </div>
        </div>

        <div className="px-4 pb-2 text-gray-500 break-words">
          <span className="font-bold uppercase">In {formData.category}</span> : {formData.description}
        </div>
      </div>

      <div className="px-4">
        <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
      {preview &&    <img
            src={preview}
            alt="Complaint"
            className="w-full h-full object-cover"
          />}
        </div>

        <div className="flex justify-between items-center py-4 text-xs text-gray-400">
          <span>Posted on {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
      </div>
    </section>
  );
}
