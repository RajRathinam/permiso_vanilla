import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Charts from './Charts.jsx';
import BarCharts from './BarCharts.jsx';
// import TwoCharts from './TwoCharts.jsx';
import baseUrl from '../../config/config.js';



const StaffDashboard = ({ authUser }) => {

    const [userData, setUserData] = useState([]);
    const [CounsellingStudents, setCounsellingStudents] = useState([]);
    const [ClassStudents, setClassStudents] = useState([]);


    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/leave/getallleave`);
                const leaveData = await res.json();

                const ress = await fetch(`${baseUrl}/api/onduty/getallonduty`);
                const ondutyData = await ress.json();

                const mergedData = [...leaveData, ...ondutyData];
                const filteredData = mergedData.filter(
                    (s) => s.staffs?.staff?._id === authUser._id
                );

                setUserData(filteredData);
                setClassStudents(authUser.classStudents || []);
                setCounsellingStudents(authUser.counsellingStudents || []);
            } catch (error) {
                console.error('Error fetching staffs:', error);
            }
        };

        fetchStaffs();
    }, [authUser._id]);

    // Log when state actually changes
   const [countByRequestType, setCountByRequestType] = useState({});
const [countByRequestTypeCounsellor, setCountByRequestTypeCounsellor] = useState({});

  useEffect(() => {
    const classStudents = ClassStudents;
    const counts = classStudents.reduce((acc, curr) => {
        acc[curr.requestType] = (acc[curr.requestType] || 0) + 1;
        return acc;
    }, {});
    setCountByRequestType(counts);
}, [ClassStudents]);

useEffect(() => {
    const counsellingStudents = CounsellingStudents;
    const counts = counsellingStudents.reduce((acc, curr) => {
        acc[curr.requestType] = (acc[curr.requestType] || 0) + 1;
        return acc;
    }, {});
    setCountByRequestTypeCounsellor(counts);
}, [CounsellingStudents]);

const counsellingData = [
    { name: 'In Leave', value: countByRequestTypeCounsellor["Leave Request"] || 1  },
    { name: 'In On-Duty', value: countByRequestTypeCounsellor["On-duty Request"] || 1 },
    { name: 'Complaints', value: countByRequestTypeCounsellor["Complaint"] || 1 },
];
const classData = [
    { name: 'In Leave', value: countByRequestType["Leave Request"] || 1 },
    { name: 'In On-Duty', value: countByRequestType["On-duty Request"] || 1 },
    { name: 'Complaints', value: countByRequestType["Complaint"] || 1 }
];

    return (
        <main className='px-4 py-2 mb-3'>
            <div className='rounded-md px-[3%] py-2 bg-slate-500/10'>
                <h1 className="text-2xl mb-2 font-bold text-center">Welcome, {authUser.fullName}.</h1>
                <h1 className="text-xl font-light text-center">See Your Student's Leave & On-Duty Analytics</h1>
                <div className='w-full h-[430px] flex items-center justify-between'>
                    <BarCharts />
                    <Charts title={"Counselling Student's"} colour={"purple"} data={counsellingData} />
                    <Charts title={"Class Student's"} colour={"teal"} data={classData} />
                    {/* <TwoCharts /> */}
                </div>
            </div>
            <div className="p-6 m-7">
                <div className="overflow-x-auto">
                    <table className="table">

                        <thead className='py-16'>
                            <tr>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>SI.NO</div></th>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>NAME & REGISTER NUMBER</div></th>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>DEPARTMENT & SECTION</div></th>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>REQUEST TYPE</div></th>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>UPLOADED DATE</div></th>
                                <th><div className='text-[20px] font-extrabold text-center pb-5 border-b-2'>DETAILS</div></th>
                            </tr>
                        </thead>
                        <tbody className='mb-20'>

                            {userData && userData.map((user, index) => {
                                return (<tr key={user._id}>
                                    <th className='text-center'>
                                        {index + 1}.
                                    </th>
                                    <td>
                                        <div className="flex items-center ml-12 gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.userId.profileImg || "/profileAvatar.jpeg"}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.userId.fullName}</div>
                                                <div className="text-sm opacity-50">{user.userId.registerNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='text-center'>
                                            <div className="font-bold">{user.userId.department}</div>
                                            <div className="text-sm opacity-50">{user.userId.classSection}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='text-center'>{user.requesttype}</div>
                                    </td>
                                    <td>
                                        <div className='text-center'>{new Date(user.createdAt).toLocaleDateString('en-GB')}</div>
                                    </td>
                                    <th className='text-center'>
                                        {user.requesttype == 'Leave Request' && <Link to="/leave-request"
                                            state={{ user }} >
                                            <button className="py-2 px-4 rounded-lg bg-gradient-to-r from-slate-500/10 to-slate-700/20 hover:from-slate-200 hover:text-black hover:to-slate-400">Details</button>
                                        </Link>}
                                        {user.requesttype == 'On-duty Request' && <Link to="/single-request"
                                            state={{ user }} >
                                            <button className="py-2 px-4 rounded-lg bg-gradient-to-r from-slate-500/10 to-slate-700/20 hover:from-slate-200 hover:text-black hover:to-slate-400">Details</button>
                                        </Link>}
                                    </th>
                                </tr>)
                            })

                            }
                        </tbody>
                    </table>
                    {userData.length == 0 && <p className='text-center my-5'>There is no pending request</p>}
                </div>
            </div>
        </main>
    )
}
export default StaffDashboard;
