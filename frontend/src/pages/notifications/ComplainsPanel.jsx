import React, { useState } from 'react';
import { IoHandLeftSharp } from "react-icons/io5";
import axios from 'axios';
import baseUrl from '../../config/config';

const ComplainsPanel = ({ complaint, currentUserId,authUser }) => {
  const [likes, setLikes] = useState(complaint.likes || []);

  const hasLiked = likes.includes(currentUserId);

  const toggleLike = async () => {
    try {
      const endpoint = `${baseUrl}/api/complaints/${complaint._id}/${hasLiked ? 'dislike' : 'like'}`;
      const res = await axios.post(endpoint, { userId: currentUserId });

      setLikes(res.data.likes);
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden flex flex-col justify-between shadow-md text-black">
      <div>
        <div className="flex items-center p-4 gap-3">
          <img
            src={complaint.user.profileImg || "/profileAvatar.jpeg"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-400 text-sm">{complaint.user.fullName}</span>
            <span className="text-sm text-gray-500">@{complaint.user.registerNumber}</span>
          </div>
        </div>

        <div className="px-4 pb-2 text-gray-500 break-words">
          <span className="font-bold uppercase">In {complaint.category}</span> : {complaint.description}
        </div>
      </div>

      <div className="px-4">
        <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={complaint.imageUrl}
            alt="Complaint"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center py-4 text-xs text-gray-400">
          <span>Posted on {new Date(complaint.createdAt).toLocaleDateString()}</span>
         {authUser.role==="student" && <span
            className={`flex items-center text-[16px] gap-1 cursor-pointer ${hasLiked ? 'text-blue-500' : ''}`}
            onClick={toggleLike}
          >
            <IoHandLeftSharp />
            {likes.length} Student{likes.length>1 && "s"}
          </span>}
        </div>
      </div>
    </div>
  );
};

export default ComplainsPanel;
