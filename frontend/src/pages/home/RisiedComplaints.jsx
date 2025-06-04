import React, { useState } from 'react';

const RisiedComplaints = ({ i, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onDelete(i._id);
    setLoading(false);
  };

  return (
    <div className="p-4 rounded-lg shadow-md mt-6">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="uppercase font-bold">{i.category}</span>
          <span>{i.createdAt}</span>
        </div>
        <button
          className="px-6 rounded-3xl hover:border-2 border-red-500 bg-red-500 text-white hover:text-red-500 hover:bg-white flex items-center gap-2"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default RisiedComplaints;
