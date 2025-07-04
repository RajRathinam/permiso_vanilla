import Leave from '../models/Leave.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';

// post leave
export const postLeave = async (req, res) => {
  const { userId, numberOfDays, from, to, reason } = req.body;

  try {
    const existSameDate = await Leave.findOne({
      userId,
      from,
      to
    });

    if (existSameDate) {
      return res.status(400).json({ message: 'Leave request already exists for the selected date range' });
    }

    const user = await User.findById(userId);
    console.log(user);

    const leaveRequest = new Leave({
      userId,
      requesttype: 'Leave Request',
      numberOfDays,
      from,
      to,
      reason,
      officials: [user.counsellor, user.classIncharge, user.hod],
      staffs: {
        staff: user.counsellor,
        approved: null
      },
    });

    await leaveRequest.save();

    res.status(201).json({
      message: 'Leave request added successfully',
      leaveRequest
    });

  } catch (error) {
    console.error('Error in leave post:', error);
    res.status(500).json({ message: 'Server Error while adding leave post' });
  }
}
// get all request under the staff as me
export const getAllRequest = async (req, res) => {
  try {
    const requests = await Leave.find().populate({
      path: 'staffs.staff',
      select: '_id' // only include _id
    }).populate({
      path: 'userId',
      select: '-password'
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests', details: error.message });
  }
};

//get Leave Request
export const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id)
      .populate({
        path: 'userId',
        select: 'fullName classIncharge counsellor hod',
        populate: [
          { path: 'classIncharge', select: 'fullName' },
          { path: 'counsellor', select: 'fullName' },
          { path: 'hod', select: 'fullName' }
        ]
      });

    if (!leave) {
      return res.status(404).send(`<h1>Leave request not found</h1>`);
    }
    const htmlnotfully = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Leave Request Not Found</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
        }
        .card {
          background: #fff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .card h1 {
          margin-bottom: 20px;
          color: #c0392b;
          font-size: 24px;
        }
        .status {
          padding: 12px;
          background-color: #fcebea;
          color: #c0392b;
          border: 1px solid #e74c3c;
          border-radius: 8px;
          font-weight: bold;
        }
           .card img.logo {
      width: 75px;
      display: block;
      margin: 0 auto 20px;
    }
      </style>
    </head>
    <body>
      <div class="card">
      <img class="logo" src="/egslogo.jpg" alt="EGS Logo" />
        <h1>Leave Request Not Found</h1>
        <div class="status">You are Not allowed to get the leave</div>
      </div>
    </body>
    </html>
    `;

    if (leave.acceptedby.length !== 3 || leave.rejectedby.length !== 0) {
      return res.status(400).send(htmlnotfully);
    }

    const fromDate = new Date(leave.from).toLocaleDateString('en-GB');
    const toDate = new Date(leave.to).toLocaleDateString('en-GB');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Leave Approval</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background: #fff;
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            text-align: center;
          }
          .card img.logo {
            width: 100px;
          }
          .card h1 {
            margin-bottom: 20px;
            color: #2c3e50;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            text-align: left;
          }
          td.label {
            background-color: #f1f1f1;
            font-weight: bold;
            width: 40%;
            color: #34495e;
          }
          .status {
            margin-top: 20px;
            padding: 12px;
            background-color: #e0f7e9;
            color: #27ae60;
            border: 1px solid #27ae60;
            border-radius: 8px;
            font-weight: bold;
          }
             @media (max-width: 480px){
             .card {
        padding: 16px;
      }

      .card h1 {
        font-size: 18px;
      }
          .card img.logo {
      width: 75px;
      display: block;
      margin: 0 auto 20px;
    }
             }
        </style>
      </head>
      <body>
        <div class="card">
          <img class="logo" src="/egslogo.jpg" alt="EGS Logo" />
          <h1>Leave Request Approved</h1>
          <table>
            <tr><td class="label">Student Name</td><td>${leave.userId.fullName}</td></tr>
            <tr><td class="label">From Date</td><td>${fromDate}</td></tr>
            <tr><td class="label">To Date</td><td>${toDate}</td></tr>
            <tr><td class="label">Counsellor</td><td>${leave.userId.counsellor?.fullName || 'N/A'}</td></tr>
            <tr><td class="label">Class In-Charge</td><td>${leave.userId.classIncharge?.fullName || 'N/A'}</td></tr>
            <tr><td class="label">HOD</td><td>${leave.userId.hod?.fullName || 'N/A'}</td></tr>
          </table>
          <div class="status">Approved by Student Counsellor, Class In-Charge & HOD</div>
        </div>
      </body>
      </html>
      `;

    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send(`<h1>Error: ${error.message}</h1>`);
  }
};

//get not applied Leave Request
export const notApplied = async (req, res) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Leave Request Not Found</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
        }
        .card {
          background: #fff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .card h1 {
          margin-bottom: 20px;
          color: #c0392b;
          font-size: 24px;
        }
        .status {
          padding: 12px;
          background-color: #fcebea;
          color: #c0392b;
          border: 1px solid #e74c3c;
          border-radius: 8px;
          font-weight: bold;
        }
           .card img.logo {
      width: 75px;
      display: block;
      margin: 0 auto 20px;
    }
      </style>
    </head>
    <body>
      <div class="card">
      <img class="logo" src="/egslogo.jpg" alt="EGS Logo" />
        <h1>Leave Request Not Found</h1>
        <div class="status">This Leave Request is not posted at Permiso</div>
      </div>
    </body>
    </html>
    `;

    res.status(400).send(html);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to render leave request status',
      details: error.message
    });
  }
};

export const staffAccept = async (req, res) => {
  try {
    const { id, staffId } = req.params;

    const leave = await Leave.findById(id).populate({
      path: 'userId',
      select: 'fullName'
    });
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.acceptedby.includes(staffId)) {
      return res.status(400).json({ message: 'This staff has already accepted the request' });
    }

    leave.acceptedby.push(staffId);

    // Check if current staff is the last one in officials
    const remainingOfficials = leave.officials.filter(
      (officialId) => !leave.acceptedby.includes(officialId.toString())
    );

    if (remainingOfficials.length === 0) {
      // All approvals done
      leave.staffs.staff = null;
      leave.staffs.approved = true; // Optional: set approved flag

      const counsel = await Staff.findById(leave.officials[0]);
      const incharge = await Staff.findById(leave.officials[1]);

      const data = {
        name:leave.userId.fullName,
        requestType:leave.requesttype,
        requestFor:leave.reason
      }

      counsel.counsellingStudents.push(data);
      incharge.classStudents.push(data);

      await counsel.save();
      await incharge.save();

    } else {
      // Set the next staff
      leave.staffs.staff = remainingOfficials[0];
    }

    await leave.save();

    res.status(200).json({ message: 'Request accepted successfully', leave });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept the request', details: error.message });
  }
};

export const staffReject = async (req, res) => {
  try {
    const { id, staffId } = req.params;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.acceptedby.includes(staffId)) {
      return res.status(400).json({ message: 'This staff has already accepted the request' });
    }

    leave.rejectedby.push(staffId);

    // Check if current staff is the last one in officials
    const remainingOfficials = leave.officials.filter(
      (officialId) => !leave.acceptedby.includes(officialId.toString()) && !leave.rejectedby.includes(officialId.toString())
    );

    remainingOfficials.forEach(official => {
      leave.rejectedby.push(official);
    })

    leave.staffs.staff = null;
    leave.staffs.approved = false;


    await leave.save();

    res.status(200).json({ message: 'Request rejected successfully', leave });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject the request', details: error.message });
  }
};