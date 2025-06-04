import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import baseUrl from '../../config/config';

const ChangePassword = ({authUser}) => {
    
    const [updatedInfo,setUpdatedInfo]=useState({
        registerNumber:"",
        password:"",
        newPassword:"",
        role:authUser.role
    });

    const handleInputChange = (e) => {
        setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(updatedInfo.registerNumber!==authUser.registerNumber){
                throw new Error("Username not same")
            }
            const response = await fetch(`${baseUrl}/api/users/changepassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedInfo),
            });
            const data = await response.json();
          
            if (!response.ok) {
                throw new Error(data.message || 'Password Updation failed');
            }
            if(response.ok){
                window.alert("Password Updated Successfully !!!")
                setUpdatedInfo({
                    registerNumber:"",
                    password:"",
                    newPassword:"",
                })
            }
        } catch (err) {
           window.alert(err)
        }
    };


    return (
        <>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn btn-soft btn-primary font-extrabold" onClick={() => document.getElementById('my_modal_3').showModal()}>Change Password</button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-extrabold text-lg mb-4">Change Password</h3>
                    <form action="" className='flex flex-col gap-2' onSubmit={handleSubmit}>
                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow'
                                placeholder='username'
                                name='registerNumber'
                                onChange={handleInputChange}
                                value={updatedInfo.registerNumber}
                            />
                        </label>

                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type='password'
                                className='grow'
                                placeholder='Current Password'
                                name='password'
                                onChange={handleInputChange}
                                value={updatedInfo.password}
                            />
                        </label>

                        <label className='input input-bordered rounded flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type='password'
                                className='grow'
                                placeholder='New Password'
                                name='newPassword'
                                onChange={handleInputChange}
                                value={updatedInfo.newPassword}
                            />
                        </label>
                        <button className="btn btn-soft btn-primary font-extrabold">Password Update</button>
                    </form>
                </div>
            </dialog></>
    )
}

export default ChangePassword;
