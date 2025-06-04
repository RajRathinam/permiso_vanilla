import React from 'react';
import ThemeController from "../../components/common/ThemeController";
import ChangePassword from './ChangePassword';
import AddStudent from './AddStudent';

const ProfileContent = ({ authUser, setTheme }) => {




    return (
        <div className="flex w-full flex-col">
            <div className='flex justify-between'>
                <h1 className='text-3xl font-semibold text-center flex justify-center items-center'>Profile</h1>
                <ThemeController setTheme={setTheme} />
            </div>
            <hr className="border-t-2 border-slate-500/50 mb-3 mt-2"></hr>
            <div className="avatar justify-center -z-20">
                <div className="w-[75%] rounded">
                    <img src={authUser.profileImg === "" ? "/profileAvatar.jpeg" : authUser.profileImg} />
                </div>
            </div>
            <hr className="border-t-2 border-slate-500/50 mt-3"></hr>
            <div className="bg-base-300  grid place-items-start px-2 py-2"><b>Name : {authUser.fullName}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Register Number : {authUser.registerNumber}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            {authUser.role == 'student' &&<><div className="bg-base-300 grid place-items-start px-2 py-2"><b>Class Incharge : {authUser.classIncharge.fullName}</b></div>
                <hr className="border-t-2 border-slate-500/50"></hr>
                <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Counsellor : {authUser.counsellor.fullName}</b></div>
                <hr className="border-t-2 border-slate-500/50"></hr></>}
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Date of Birth : {authUser.dateOfBirth}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Class & Section : {authUser.classSection}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Department : {authUser.department}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>E-mail : {authUser.email}</b></div>
            <hr className="border-t-2 border-slate-500/50"></hr>
            <div className="bg-base-300 grid place-items-start px-2 py-2"><b>Phone Number : {authUser.phoneNumber}</b></div>
            {authUser.role == 'staff' && <>
                <hr className="border-t-2 mb-2 border-slate-500/50"></hr>
                <AddStudent authUser={authUser}/>
            </>}
            <hr className="border-t-2 my-2 border-slate-500/50"></hr>
            <ChangePassword authUser={authUser} />
        </div>
    )
}

export default ProfileContent
