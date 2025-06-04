const SearchTable = ({ fromBackend, setData, currentData }) => {
  const handleToggle = (student) => {
    const exists = currentData.find((s) => s._id === student._id);

    if (exists) {
      // Remove the student if already added
      setData((prev) => prev.filter((s) => s._id !== student._id));
    } else if (currentData.length < 20) {
      // Add the student if not already added and limit not reached
      setData((prev) => [...prev, { ...student, id: prev.length + 1 }]);
    }
  };

  return (
    <div className="overflow-x-auto h-[405px] w-full bg-white rounded-lg text-black mb-16">
      <table className="table">
        <thead>
          <tr>
            <th className='text-center text-[16px]'>Name & Register Number</th>
            <th className='text-center text-[16px]'>Class & Section</th>
            <th className='text-center text-[16px]'>Action</th>
          </tr>
        </thead>
        <tbody>
          {fromBackend.map((stud) => {
            const isAdded = currentData.some((s) => s._id === stud._id);
            return (
              <tr key={stud._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={stud.profileImg || "../../../public/profileAvatar.jpeg"}
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{stud.fullName}</div>
                      <div className="text-sm opacity-50">{stud.registerNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <span className="badge badge-ghost badge-sm p-3">{stud.classSection}</span>
                </td>
                <td>
                  <button
                    className={`btn btn-md ${isAdded ? 'btn-error text-white' : 'btn-ghost'} w-full`}
                    onClick={() => handleToggle(stud)}
                  >
                    {isAdded ? 'Remove' : 'Add'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchTable;
