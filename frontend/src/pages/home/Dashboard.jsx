import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import AppliedRequest from './AppliedRequest';
import RisiedComplaints from "./RisiedComplaints";
import { useState, useEffect } from 'react';
import axios from 'axios';


const Dashboard = ({ authUser }) => {

    const [complaints, setComplaints] = useState([]);

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/leave/getallleave');
                const datas = await res.json();
                const ress = await fetch('http://localhost:5000/api/onduty/getallonduty');
                const ondutyData = await ress.json();

                const mergedData = [...datas, ...ondutyData];

                const filteredData = mergedData.filter((s) => s.userId._id == authUser._id);
                filteredData.reverse();
                setUserData(filteredData);
            } catch (error) {
                console.error('Error fetching staffs:', error);
            }
        };
        fetchStaffs();
    }, [authUser._id]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/complaints//user/${authUser._id}`);
                setComplaints(res.data);
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };

        fetchComplaints();
    }, []);
    // Handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
                data: { userId: authUser._id }
                // send userId in body for authorization check
            });
            // Remove from state
            setComplaints((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="lg:p-5 p-1 mb-8">
            <div className='rounded-md px-2 py-1 lg:px-[5%] lg:pt-[3%] bg-slate-500/10'>
                <h1 className="lg:text-3xl text-[27px] font-bold lg:font-extrabold my-4">Welcome, {authUser.fullName}</h1>
                <p className="hidden lg:block lg:text-xl text-[27px] my-2">Welcome to Permiso, the all-in-one platform designed to streamline on-duty and leave requests for students and staff.</p>
                <p className="hidden lg:block lg:text-xl text-[27px] my-2">
                    Whether you're a student requesting time off or going on-duty, or a staff member managing student requests and approvals, Permiso simplifies the process with a seamless interface.</p>
                <div className='w-full lg:h-[275px] lg:flex lg:justify-center lg:items-center'>

                    <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-4 lg:gap-6 gap-3">

                        <div className="py-4 rounded-lg shadow-xl hover:shadow-2xl">
                            <Link to="/single-request" className="flex flex-col justify-center items-center text-secondary-500 ">
                                <FaUser size={100} />
                                <h2 className="text-lg mt-2 lg:text-xl font-medium mb-4">On-Duty Request</h2>
                            </Link>
                        </div>
                        <div className="py-4 rounded-lg shadow-xl hover:shadow-2xl">
                            <Link to="/team-onduty" className="flex flex-col justify-center items-center text-secondary-500">
                                <MdGroups size={100} />
                                <h2 className="text-lg mt-2 lg:text-xl font-medium mb-4">Team On-Duty</h2>
                            </Link>
                        </div>
                        <div className="py-4 rounded-lg shadow-xl hover:shadow-2xl">
                            <Link to="/leave-request" className="flex flex-col justify-center items-center text-secondary-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100"
                                    height="100"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Outer page outline */}
                                    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                    {/* Page lines */}
                                    <line x1="9" y1="9" x2="15" y2="9" />
                                    <line x1="9" y1="13" x2="15" y2="13" />
                                    <line x1="9" y1="17" x2="13" y2="17" />
                                </svg>
                                <h2 className="text-lg mt-2 lg:text-xl font-medium mb-4">Leave Requests</h2>
                            </Link>
                        </div>
                        <div className="py-4 rounded-lg shadow-xl hover:shadow-2xl">
                            <Link to="/complaint" className="flex flex-col justify-center items-center text-secondary-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100"
                                    height="100"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Paper */}
                                    <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
                                    {/* Horizontal lines */}
                                    <line x1="7" y1="8" x2="15" y2="8" />
                                    <line x1="7" y1="12" x2="15" y2="12" />
                                    <line x1="7" y1="16" x2="12" y2="16" />
                                    {/* Pen */}
                                    <path d="M14 20l4-4 2 2-4 4z" />
                                    <path d="M16 18l-4 4" />
                                </svg>
                                <h2 className="text-lg mt-2 lg:text-xl font-medium mb-4">Rise Complaint</h2>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <hr className="border-t-2 border-slate-500/10 mb-10"></hr>
            <div>

                <h1 className="lg:text-3xl text-[27px] font-bold lg:font-extrabold my-4">Raised Complaint's</h1>
                {complaints.length == 0 ? (<p className='text-center my-5'>you did not raise any complaint against the institute</p>) : ((complaints.map((complaint) => (
                    <RisiedComplaints i={complaint} key={complaint._id} onDelete={handleDelete} />
                ))))}
            </div>
            {complaints.length == 0 ? (<></>) : (<hr className="border-t-2 border-slate-500/10 mb-10"></hr>)}
            <div>

                <h1 className="lg:text-3xl text-[27px] font-bold lg:font-extrabold my-4">Applied Request's Status</h1>
                {userData.length == 0 ? (<p className='text-center my-5'>you did not applied any request</p>) : ((userData.map((i) => (
                    <AppliedRequest i={i} key={i._id} />
                ))))}
            </div>

        </div>
    );
};

export default Dashboard;
