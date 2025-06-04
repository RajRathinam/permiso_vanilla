import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import ComplainsPanel from "./ComplainsPanel";
import React, { useEffect, useState } from 'react';
import "../../index.css";
import axios from "axios";

const notifications = [
    { id: 1, status: "success", title: "On-Duty Request Approved", description: "Your on-duty request has been approved.", timestamp: "2025-01-15", read: false },
    { id: 2, status: "rejected", title: "Leave Request Rejected", description: "Your leave request has been rejected.", timestamp: "2025-01-14", read: true },
    { id: 3, status: "success", title: "On-Duty Request Approved", description: "Your on-duty request has been approved.", timestamp: "2025-01-15", read: false },
    { id: 4, status: "success", title: "On-Duty Request Approved", description: "Your on-duty request has been approved.", timestamp: "2025-01-15", read: false }
];

const NotificationPage = ({authUser}) => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/complaints");
                setComplaints(res.data.reverse());
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };

        fetchComplaints();
    }, []);

    return (
        <section className="w-full min-h-screen flex flex-col items-center py-5 px-4 relative">
            <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8">
                {/* Complaints - 60% */}
                <div className="w-full lg:w-[60%] flex flex-col gap-6 pr-4 mb-10">
                    <h1 className="text-3xl font-bold text-center">Complaints</h1>
                    <div className="flex flex-col gap-5">
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <ComplainsPanel key={complaint._id} complaint={complaint} authUser={authUser} currentUserId={authUser._id}/>
                            ))
                        ) : (
                            <p className="text-center mt-[20%]">No complaints to display.</p>
                        )}
                    </div>
                </div>

                {/* Notifications - 40% */}
                <div className="hidden lg:flex hide-scrollbar flex-col gap-4 w-[35%] h-[85vh] fixed right-10  overflow-y-auto rounded-lg">
                    <h1 className="text-3xl font-bold text-center">Notifications</h1>
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-3 flex items-center gap-3 rounded-md shadow ${notif.status === "success" ? 'border-l-4 border-green-600' : 'border-l-4 border-red-500'}`}
                        >
                            <span className={`w-14 h-14 p-2 text-2xl text-white flex justify-center items-center rounded-full ${notif.status === "success" ? 'bg-green-600' : 'bg-red-500'}`}>
                                {notif.status === "success" ? <FiCheck /> : <IoClose />}
                            </span>
                            <div className="flex justify-between w-[85%]">
                               <div>
                               <h2 className="text-lg font-bold">{notif.status}</h2>
                               <p className="text-base">{notif.title}</p>
                               </div>
                               <div className="flex items-end">
                               <span className="text-sm text-gray-600">{new Date(notif.timestamp).toLocaleDateString()}</span>
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NotificationPage;
