import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LeaveRequest = ({ authUser }) => {
  const baseUrl = "http://localhost:5000";
  const navigate = useNavigate();
  const location = useLocation();
  const { user, i } = location.state || {};
  const date = new Date();
  let data;
  if (user) {
    data = authUser.role == 'student' ? authUser : user.userId;
  }
  else if (i) {
    data = i.userId;
  }
  else {
    data = authUser;
  }
  let onlyForPrint;
  let down = true;
  if (user) {
    onlyForPrint = user.staffs.approved == null ? false : true;
    if(user.rejectedby.length !== 0)
    {
        down = false;
    }   
  }
  if (i) {
    onlyForPrint = i.staffs.approved == null ? false : true;
     if(i.rejectedby.length !== 0)
    {
        down = false;
    } 
  }
  const [formData, setFormData] = useState({
    days: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  useEffect(() => {
    if (authUser?.role === 'staff' && user) {
      setFormData({
        days: user.numberOfDays,
        fromDate: user.from,
        toDate: user.to,
        reason: user.reason,
      });
    }
    if (authUser?.role === 'student' && i) {
      setFormData({
        days: i.numberOfDays,
        fromDate: i.from,
        toDate: i.to,
        reason: i.reason,
      });
    }
  }, [authUser, user, i]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === 'fromDate' && prev.days) {
        const fromDate = new Date(value);
        const days = parseInt(prev.days, 10);
        if (!isNaN(days)) {
          fromDate.setDate(fromDate.getDate() + days - 1);
          updatedForm.toDate = fromDate.toISOString().split('T')[0]; // YYYY-MM-DD
        }
      }

      if (name === 'days' && prev.fromDate) {
        const fromDate = new Date(prev.fromDate);
        const days = parseInt(value, 10);
        if (!isNaN(days)) {
          fromDate.setDate(fromDate.getDate() + days - 1);
          updatedForm.toDate = fromDate.toISOString().split('T')[0];
        }
      }

      return updatedForm;
    });
  };

  const componentRef = useRef();
  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    //window.location.reload();
  };
  const handleAccept = async (e) => {
    e.preventDefault();
    const staffId = authUser._id;
    const id = user._id;
    try {
      const response = await fetch(`${baseUrl}/api/leave/acceptleave/${id}/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to Accept the Form');
      }

      window.alert('Leave request Accepted by you successfully! 🎉');

    } catch (error) {
      window.alert(error.message);
    }
    navigate('/');
  }
    const handleReject = async (e) => {
    e.preventDefault();
    const staffId = authUser._id;
    const id = user._id;
    try {
      const response = await fetch(`${baseUrl}/api/leave/acceptreject/${id}/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to Reject the Form');
      }

      window.alert('Leave request Rejected by you !!!');

    } catch (error) {
      window.alert(error.message);
    }
    navigate('/');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { days, fromDate, toDate, reason } = formData;

    if (!days || !fromDate || !toDate || !reason) {
      window.alert("Please fill in all the fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/leave/postleave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authUser._id,
          numberOfDays: formData.days,
          from: formData.fromDate,
          to: formData.toDate,
          reason: formData.reason
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit leave request');
      }

      window.alert('Leave request submitted successfully! 🎉');

      setFormData({
        days: '',
        fromDate: '',
        toDate: '',
        reason: '',
      });

    } catch (err) {
      window.alert(err.message);
    }
  };

console.log(user);


  return (
    <div className={`lg:flex ${!onlyForPrint && authUser.role == 'student' ? 'justify-between' : 'justify-center'} gap-4 p-4`}>
      {/* Left Side Form */}
      {!onlyForPrint && authUser.role == 'student' && <div className="w-[38%] bg-white p-4 shadow border rounded-md fixed right-0 top-40">
        <h2 className="text-xl font-bold mb-4">Leave Request Form</h2>
        <div className="flex flex-col gap-4">
          <label>
            Number of Days:
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              className="w-full border px-2 bg-white py-1 mt-1"
              placeholder="Enter number of days"
            />
          </label>
          <label>
            From Date:
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full border px-2 bg-white py-1 mt-1"
            />
          </label>
          <label>
            To Date:
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full border px-2 bg-white py-1 mt-1"
              readOnly
            />

          </label>
          <label>
            Reason:
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border px-2 bg-white py-1 mt-1"
              placeholder="Enter reason for leave"
              min={3}
            />
          </label>
        </div>
      </div>
      }
      {/* Right Side Preview */}
      <main className='flex flex-col'>
        <div ref={componentRef} className="w-full sm:w-[210mm] h-auto text-black mx-auto mt-6 bg-white p-5 sm:p-10 shadow-lg border border-red-950">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center underline">E.G.S.PILLAY ENGINEERING COLLEGE</h1>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center underline">LEAVE REQUISITION FORM</h1>
          <div className="flex flex-col sm:flex-row justify-between py-3">
            <h2 className="px-1"><b>Academic year</b> : {date.getFullYear()}-{date.getFullYear() + 1}</h2>
            <h2 className="px-1"><b>Date</b> : {authUser.role=='staff'?( new Date(user.createdAt).toLocaleDateString('en-GB')):(i?( new Date(i.createdAt).toLocaleDateString('en-GB')):(date.toLocaleDateString()))}</h2>
          </div>
          <div className='p-1 flex flex-col gap-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='font-bold'>From:</h1>
                <div className='pl-11'>
                  <h1>{data.fullName},</h1>
                  <h1>{data.registerNumber},</h1>
                  <h1>{data.classSection},</h1>
                  <h1>E.G.S.Pillay Engineering College,</h1>
                </div>
              </div>
              <div>
                <img
                src={
                  authUser.role === 'student' && !i
                    ? authUser.profileImg
                    : data.profileImg
                    ? data.profileImg : '/profileAvatar.jpeg'
                }
                
                  className="w-[130px] h-[150px] object-cover border border-gray-300" 
                  />
              </div>
            </div>
            <div>
              <h1 className='font-bold'>To:</h1>
              <div className='pl-11'>
                <h1>The Head of the Department,</h1>
                <h1>{data.department},</h1>
                <h1>E.G.S.Pillay Engineering College,</h1>
              </div>
            </div>
            <div className='flex gap-2'>
              <h1 className='font-bold'>Subject:</h1>
              <h1>Requesting for Leave.</h1>
            </div>
            <div>
              <h1 className='font-bold'>Respected Sir,</h1>
              <div className='mb-2 text-justify'>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  I am <span className='font-medium'>{data.fullName}</span>, studying in <span className='font-medium'>{data.classSection}</span>, Register Number <span className='font-medium'>{data.registerNumber}</span>. I kindly request leave for <span className='font-medium'>{formData.days ? formData.days + " days" : "_______ days"}</span> on <>[ </><span className='font-medium'><>
                    {authUser?.role === 'staff' ? (
                      <span>{new Date(new Date(user.from).setDate(new Date(user.from).getDate() + 1)).toLocaleDateString('en-GB')}</span>

                    ) : (
                      <span>{formData.fromDate && (new Date(formData.fromDate).toLocaleDateString('en-GB')) || "_______"}</span>
                    )}
                  </>
                  </span> to <span className='font-medium'><>
                    {authUser?.role === 'staff' ? (
                      <span>{new Date(new Date(user.to).setDate(new Date(user.to).getDate() + 1)).toLocaleDateString('en-GB')}</span>

                    ) : (
                      <span>{formData.toDate && (new Date(formData.toDate).toLocaleDateString('en-GB')) || "_______"}</span>
                    )}
                  </>
                  </span><> ]</> due to <span className='font-medium break-words'>{formData.reason || "_______"}</span>.
                </p>
              </div>
              <div className='mb-2 text-justify'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                I assure you that I will make up for any missed academic work and responsibilities during the leave period. Kindly grant me permission for the leave on the mentioned date(s).
              </div>
              <div className='mb-2'>Looking forward to your kind approval.</div>
              <div className='mb-2 text-center'>Thank you.</div>
            </div>
            <div>
              <h1 className='font-bold text-end'>Yours sincerely,</h1>
              <h1 className='text-end'>{data.fullName}</h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between p-5 mb-2 border-2">
            {authUser.role=='student' && !i && <div className="w-full h-auto flex flex-wrap justify-center items-center">
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  <span className="text-slate-500 text-sm">Form Not Submitted</span>
                  <b>Student Counsellor</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                 <span className="text-slate-500 text-sm">Form Not Submitted</span>
                  <b>Class In-Charge</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  <span className="text-slate-500 text-sm">Form Not Submitted</span>
                  <b>Head of the Department</b>
                </div>
              </div>}
              {user && <div className="w-full h-auto flex flex-wrap justify-center items-center">
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {user.acceptedby.includes(data.counsellor) && <span className="text-green-500">Accepted</span>}
                  {user.rejectedby.includes(data.counsellor) && <span className="text-red-500">Rejected</span>}
                  {!user.acceptedby.includes(data.counsellor) && !user.rejectedby.includes(data.counsellor) && <span className="text-blue-500">Pending</span>}
                  <b>Student Counsellor</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {user.acceptedby.includes(data.classIncharge) && <span className="text-green-500">Accepted</span>}
                  {user.rejectedby.includes(data.classIncharge) && <span className="text-red-500">Rejected</span>}
                  {!user.acceptedby.includes(data.classIncharge) && !user.rejectedby.includes(data.classIncharge) && <span className="text-blue-500">Pending</span>}
                  <b>Class In-Charge</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {user.acceptedby.includes(data.hod) && <span className="text-green-500">Accepted</span>}
                  {user.rejectedby.includes(data.hod) && <span className="text-red-500">Rejected</span>}
                  {!user.acceptedby.includes(data.hod) && !user.rejectedby.includes(data.hod) && <span className="text-blue-500">Pending</span>}
                  <b>Head of the Department</b>
                </div>
              </div>}
              {authUser.role=='student' && i && <div className="w-full h-auto flex flex-wrap justify-center items-center">
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {i.acceptedby.includes(data.counsellor) && <span className="text-green-500">Accepted</span>}
                  {i.rejectedby.includes(data.counsellor) && <span className="text-red-500">Rejected</span>}
                  {!i.acceptedby.includes(data.counsellor) && !i.rejectedby.includes(data.counsellor) && <span className="text-blue-500">Pending</span>}
                  <b>Student Counsellor</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {i.acceptedby.includes(data.classIncharge) && <span className="text-green-500">Accepted</span>}
                  {i.rejectedby.includes(data.classIncharge) && <span className="text-red-500">Rejected</span>}
                  {!i.acceptedby.includes(data.classIncharge) && !i.rejectedby.includes(data.classIncharge) && <span className="text-blue-500">Pending</span>}
                  <b>Class In-Charge</b>
                </div>
                <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {i.acceptedby.includes(data.hod) && <span className="text-green-500">Accepted</span>}
                  {i.rejectedby.includes(data.hod) && <span className="text-red-500">Rejected</span>}
                  {!i.acceptedby.includes(data.hod) && !i.rejectedby.includes(data.hod) && <span className="text-blue-500">Pending</span>}
                  <b>Head of the Department</b>
                </div>
              </div>}
            {i||user?<div className="w-full sm:w-auto mt-4 sm:mt-0">
                <QRCode
                  value={i ? `${baseUrl}/api/leave/getleave/${i._id}` : `${baseUrl}/api/leave/getleave/${user._id}`}
                  size={150}
                  fgColor="black"
                  bgColor="white"
                  level="H"
                />
              </div>:<div className="w-full sm:w-auto mt-4 sm:mt-0">
                <QRCode
                  value={`${baseUrl}/api/leave/notapplied`}
                  size={150}
                  fgColor="black"
                  bgColor="white"
                  level="H"
                />
              </div>}
            </div>
          </div>
        </div>
        {authUser.role === 'staff' ? (
          <div className='flex justify-center gap-5'>
            <button onClick={handleAccept} className="btn bg-green-500 mt-5 mb-12 px-6 text-md">Accept</button>
            <button onClick={handleReject} className="btn bg-red-500 mt-5 mb-12 px-6 text-md">Reject</button>
          </div>
        ) : (
          !onlyForPrint ? (
            <button onClick={handleSubmit} className="btn btn-primary mx-auto mt-5 mb-12">Submit</button>
          ) : (
           <button onClick={handlePrint} className={`btn btn-primary mx-auto mt-5 mb-12`} disabled={!down}>Download PDF</button>
          )
        )}

      </main>
    </div>
  );
};

export default LeaveRequest;
