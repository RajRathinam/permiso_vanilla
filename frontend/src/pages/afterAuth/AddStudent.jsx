import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { MdClass, MdSchool, MdPerson } from 'react-icons/md';
import baseUrl from '../../config/config';

const AddStudent = ({ authUser }) => {

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/getallStaffs`);
        const datas = await res.json();
        setStaffs(datas);
        setStaffs((prev) => prev.filter((s) => s.department == authUser.department))
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };
    fetchStaffs();
  }, []);

  const [studentData, setStudentData] = useState({
    fullName: '',
    registerNumber: '',
    password: '',
    dateOfBirth: '',
    classSection: '',
    department: '',
    email: '',
    phoneNumber: '',
    classIncharge: '',
    counsellor: '',
    hod:''
  });

  const [profileImgFile, setProfileImgFile] = useState(null);

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(studentData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (profileImgFile) {
      formData.append('profileImg', profileImgFile);
    }

    try {
      const response = await fetch(`${baseUrl}/api/users/addnewuser`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student');
      }

      window.alert('Student Added Successfully! 🎉');

      setStudentData({
        fullName: '',
        registerNumber: '',
        password: '',
        dateOfBirth: '',
        classSection: '',
        department: '',
        email: '',
        phoneNumber: '',
        classIncharge: '',
        counsellor: '',
        hod:''
      });
      setProfileImgFile(null);
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <>
      <button className="btn btn-soft btn-secondary font-extrabold" onClick={() => document.getElementById('add_student_modal').showModal()}>
        Add Student
      </button>
      <dialog id="add_student_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-extrabold text-lg mb-4">Add New Student</h3>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit} encType="multipart/form-data">

            {/* All Input Fields */}
            <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                value={studentData.fullName}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Register Number"
                name="registerNumber"
                value={studentData.registerNumber}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                value={studentData.password}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <FaCalendarAlt />
              <input
                type="date"
                className="grow"
                name="dateOfBirth"
                value={studentData.dateOfBirth}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdClass />
              <input
                type="text"
                className="grow"
                placeholder="Class Section (eg: III-CSE A)"
                name="classSection"
                value={studentData.classSection}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdSchool />
              <input
                type="text"
                className="grow"
                placeholder="Department"
                name="department"
                value={studentData.department}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <FaEnvelope />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="email"
                value={studentData.email}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <FaPhone />
              <input
                type="text"
                className="grow"
                placeholder="Phone Number"
                name="phoneNumber"
                value={studentData.phoneNumber}
                onChange={handleInputChange}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPerson />
              <select
                name="classIncharge"
                value={studentData.classIncharge}
                onChange={handleInputChange}
                className="w-full"
              >
                <option value="">Select Class Incharge</option>
                {staffs.map((staff) => <option value={staff._id}>{staff.fullName}</option>)}
              </select>

            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPerson />
              <select
                name="counsellor"
                value={studentData.counsellor}
                onChange={handleInputChange}
                className="w-full "
              >
                <option value="">Select Student Counsellor</option>
                {staffs.map((staff) => <option value={staff._id}>{staff.fullName}</option>)}
              </select>
            </label>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPerson />
              <select
                name="hod"
                value={studentData.hod}
                onChange={handleInputChange}
                className="w-full "
              >
                <option value="">Select Department Hod</option>
                {staffs.map((staff) => <option value={staff._id}>{staff.fullName}</option>)}
              </select>
            </label>

            {/* Profile Image File Input */}
            <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser />
              <input
                type="file"
                accept="image/*"
                className='file-input w-full '
                onChange={handleFileChange}
              />
            </label>

            <button type="submit" className="btn btn-soft btn-primary font-extrabold">
              Add Student
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddStudent;
