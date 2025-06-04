import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom';

const SingleOnduty = ({ authUser }) => {
   const baseUrl = "http://localhost:5000";
  const date = new Date();
  let data;
  const navigate = useNavigate();
  const location = useLocation();
   const { user, i } = location.state || {};
   if(user)
   {
      user.userId.eventCoordinatorId = user.eventCoordinatorId;
      data = authUser.role == 'student' ? authUser : user.userId;
   }
   else if(i)
   {
      data = i.userId;
      data.eventCoordinatorId = i.eventCoordinatorId;
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
    numberOfDays: '',
    from: '',
    to: '',
    event: '',
    eventName: '',
    venue: '',
  });

  
    useEffect(() => {
      if (authUser?.role === 'staff' && user) {
        setFormData({
          numberOfDays: user.numberOfDays,
          from: user.from,
          to: user.to,
          event: user.event,
          eventName: user.eventName,
          venue: user.venue
        });
      }
      if (authUser?.role === 'student' && i) {
        setFormData({
            numberOfDays: i.numberOfDays,
          from: i.from,
          to: i.to,
          event: i.event,
          eventName: i.eventName,
          venue: i.venue
        });
      }
    }, [authUser, user, i]);

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updatedForm = { ...prev, [name]: value };

    if (name === 'from' && prev.numberOfDays) {
      const fromDate = new Date(value);
      const days = parseInt(prev.numberOfDays, 10);
      if (!isNaN(days)) {
        // Update 'to' date
        fromDate.setDate(fromDate.getDate() + days - 1);
        updatedForm.to = fromDate.toISOString().split('T')[0];
      }
    }

    if (name === 'numberOfDays' && prev.from) {
      const fromDate = new Date(prev.from);
      const days = parseInt(value, 10);
      if (!isNaN(days)) {
        fromDate.setDate(fromDate.getDate() + days - 1);
        updatedForm.to = fromDate.toISOString().split('T')[0];
      }
    }

    return updatedForm;
  });
};
  const handleAccept = async (e) => {
    e.preventDefault();
    const staffId = authUser._id;
    const id = user._id;
    try {
      const response = await fetch(`${baseUrl}/api/onduty/acceptonduty/${id}/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to Accept the Form');
      }

      window.alert('On-duty request Accepted by you successfully! 🎉');

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
      const response = await fetch(`${baseUrl}/api/onduty/rejectonduty/${id}/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to Reject the Form');
      }

      window.alert('On-duty request Rejected by you !!!');

    } catch (error) {
      window.alert(error.message);
    }
    navigate('/');
  }
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate required fields
  const { numberOfDays, from, to, event, eventName, venue } = formData;

  if (!numberOfDays || !from || !to || !event || !eventName || !venue) {
    window.alert("Please fill in all the fields before submitting.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/onduty/postonduty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authUser._id,
        numberOfDays,
        from,
        to,
        event,
        eventName,
        venue
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit On-Duty request');
    }

    window.alert('On-Duty request submitted successfully! 🎉');

    // Reset form
    setFormData({
      numberOfDays: '',
      from: '',
      to: '',
      event: '',
      eventName: '',
      venue: '',
    });

  } catch (err) {
    window.alert(err.message);
  }
};

  const componentRef = useRef();
  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    // window.location.reload();  // Reload to restore original state
  };

  return (
  <div className={`lg:flex ${!onlyForPrint && authUser.role == 'student' ? 'justify-between' : 'justify-center'} gap-4 p-4`}>
      {/* Left Side Form */}
      {!onlyForPrint && authUser.role == 'student' && <div className="w-[38%] bg-white p-2 rounded-md fixed right-0 top-20">
        <h2 className="text-xl font-bold mb-4 text-center">On-Duty Request Form</h2>
        <div className="flex flex-col gap-4">
          <label>
            Number of Days:
            <input
              type="number"
              name="numberOfDays"
              value={formData.numberOfDays}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
              placeholder="Enter number of days"
            />
          </label>
          <label>
            From Date:
            <input
              type="date"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
            />
          </label>
          <label>
            To Date:
            <input
              type="date"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
              readOnly
            />
          </label>
          <label>
            Event Category:
            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
            >
              <option value="">-- Select Category --</option>
              <option value="Technical">Technical</option>
              <option value="Extracurricular">Extracurricular</option>
              <option value="Sports">Sports</option>
              <option value="Internship">Internship</option>
            </select>
          </label>
          <label>
            Event Name:
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
              placeholder="Enter event name"
            />
          </label>
          <label>
            Venue:
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 bg-white"
              placeholder="Enter venue"
            />
          </label>
        </div>
      </div>}

      {/* Right Side Preview */}
      <main className='flex flex-col'>

        <div ref={componentRef} className="w-full sm:w-[210mm] h-auto text-black mx-auto mt-6 bg-white p-5 sm:p-10 shadow-lg border border-red-950">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center underline">E.G.S.PILLAY ENGINEERING COLLEGE</h1>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center underline">ON-DUTY REQUISITION FORM</h1>
          <div className="flex flex-col sm:flex-row justify-between py-3">
            <h2 className="px-1"><b>Academic year</b> : {date.getFullYear()}-{date.getFullYear() + 1}</h2>
            <h2 className="px-1"><b>Date</b> : {authUser.role=='staff'?( new Date(user.createdAt).toLocaleDateString('en-GB')):(i?( new Date(i.createdAt).toLocaleDateString('en-GB')):(date.toLocaleDateString()))}</h2>
          </div>
          <div className='p-1 flex flex-col gap-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='font-bold'>From:</h1>
                <div className='pl-11 flex justify-between'>
                  <div>
                    <h1>{data.fullName},</h1>
                    <h1>{data.registerNumber},</h1>
                    <h1>{data.classSection},</h1>
                    <h1>E.G.S.Pillay Engineering College,</h1>
                  </div>
                </div>
              </div>
              <div>
                <img src={
                  authUser.role === 'student' && !i
                    ? authUser.profileImg
                    : data.profileImg
                    ? data.profileImg : '/profileAvatar.jpeg'
                } className="w-[130px] h-[150px] object-cover border border-gray-300" />
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
              <h1>Request for On-Duty Leave</h1>
            </div>
            <div>
              <h1 className='font-bold'>Respected Sir,</h1>
              <div className='mb-2 flex text-justify flex-col'>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I'm, <span className='font-medium'>{data.fullName}</span>,a student of <span className='font-medium'>{data.classSection}</span>, with Register Number <span className='font-medium'>{data.registerNumber}</span>, kindly request on-duty leave for <span className='font-medium'>{formData.numberOfDays ? formData.numberOfDays + " days" : "_______ days"}</span> on <>[ </><span className='font-medium'><>
                    {authUser?.role === 'staff' ? (
                      <span>{new Date(new Date(user.from).setDate(new Date(user.from).getDate() + 1)).toLocaleDateString('en-GB')}</span>

                    ) : (
                      <span>{formData.from && (new Date(formData.from).toLocaleDateString('en-GB')) || "_______"}</span>
                    )}
                  </>
                  </span> to <span className='font-medium'><>
                    {authUser?.role === 'staff' ? (
                      <span>{new Date(new Date(user.to).setDate(new Date(user.to).getDate() + 1)).toLocaleDateString('en-GB')}</span>

                    ) : (
                      <span>{formData.to && (new Date(formData.to).toLocaleDateString('en-GB')) || "_______"}</span>
                    )}
                  </>
                  </span><> ]</> as I have to participate in  <span className='font-medium'>{formData.eventName ? formData.eventName : "_______"}</span> at <span className='font-medium'>{formData.venue ? formData.venue : "_______"}</span> under the category <span className='font-medium'>{formData.event ? formData.event : "_______"}</span>.
                </p>
              </div>
              <div className='mb-2 text-justify'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                I assure you that I will compensate for the missed academic sessions and complete all required coursework. I kindly request you to consider my application and grant me the on-duty leave for the mentioned date's.
              </div>
              <div className='mb-2'>Looking forward to your approval.</div>
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
                  <b>Event Co-Ordinator</b>
                </div>
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
                  {user.acceptedby.includes(data.eventCoordinatorId) && <span className="text-green-500">Accepted</span>}
                  {user.rejectedby.includes(data.eventCoordinatorId) && <span className="text-red-500">Rejected</span>}
                  {!user.acceptedby.includes(data.eventCoordinatorId) && !user.rejectedby.includes(data.eventCoordinatorId) && <span className="text-blue-500">Pending</span>}
                  <b>Event Co-Ordinator</b>
                </div>
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
                {/* <div className="w-full sm:w-1/2 text-center flex flex-col"><span className="text-green-500">Accepted</span><b>Sports Coordinator</b></div> */}
                 <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {user.acceptedby.includes(data.hod) && <span className="text-green-500">Accepted</span>}
                  {user.rejectedby.includes(data.hod) && <span className="text-red-500">Rejected</span>}
                  {!user.acceptedby.includes(data.hod) && !user.rejectedby.includes(data.hod) && <span className="text-blue-500">Pending</span>}
                  <b>Head of the Department</b>
                </div>
              </div>}
                {authUser.role=='student' && i && <div className="w-full h-auto flex flex-wrap justify-center items-center">
              <div className="w-full sm:w-1/2 text-center flex flex-col">
                  {i.acceptedby.includes(data.eventCoordinatorId) && <span className="text-green-500">Accepted</span>}
                  {i.rejectedby.includes(data.eventCoordinatorId) && <span className="text-red-500">Rejected</span>}
                  {!i.acceptedby.includes(data.eventCoordinatorId) && !i.rejectedby.includes(data.eventCoordinatorId) && <span className="text-blue-500">Pending</span>}
                  <b>Event Co-Ordinator</b>
                </div>
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
                  value={i ? `${baseUrl}/api/onduty/getonduty/${i._id}` : `${baseUrl}/api/onduty/getonduty/${user._id}`}
                  size={150}
                  fgColor="black"
                  bgColor="white"
                  level="H"
                />
              </div>:<div className="w-full sm:w-auto mt-4 sm:mt-0">
                <QRCode
                  value={`${baseUrl}/api/onduty/notapplied`}
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

export default SingleOnduty;
