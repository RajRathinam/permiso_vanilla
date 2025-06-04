import React, { useState,useEffect } from 'react';
import { BsBell } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { RiMenu4Line } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';


const Header = ({ profile, setProfile, setAuthUser, authUser}) => {

    const [count, setCount] = useState(10);

    const handleLogout = () => {
        localStorage.removeItem("authUser");
        setAuthUser('')
    }
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", localStorage.getItem("theme"));
      }, []); 

    return (
        <div className="drawer sticky top-0 left-0 z-40">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-base-300 w-full">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <RiMenu4Line size={30} />
                        </label>
                    </div>
                    <div className="mx-2 flex-1 lg:px-2"><h1 className='text-3xl font-extrabold'>Permiso</h1></div>
                    <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal gap-2">
                            {/* Navbar menu content here */}
                            <li>
                                <Link to="/">
                                    <div className='flex gap-1 items-center'>
                                        <IoHomeOutline className='text-3xl' />
                                        <h1 className='text-lg'>Dashboard</h1>
                                    </div>
                                </Link>
                            </li>
                            <li className='flex flex-row' onClick={() => { setProfile((prev) => !prev) }}>
                                <div> <div className="avatar">
                                    <div className="w-[30px] h-[30px] rounded-full">
                                        <img src={authUser.profileImg===""? "/profileAvatar.jpeg":authUser.profileImg} />
                                    </div>
                                </div>
                                    <h1 className='text-lg'>Profile</h1>
                                </div>
                            </li>
                            <li>
                                <Link to="/notifications">
                                    <div className='flex gap-1'>
                                        <div>
                                            <BsBell className='text-3xl relative' />
                                            {/* <span className='absolute bottom-8 left-8 bg-red-500 text-white lg:text-[11px] font-bold rounded-full px-1'>{count}</span> */}
                                        </div>
                                        <h1 className='text-lg'>UpdatesFeed</h1>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <div className='flex gap-1' onClick={handleLogout}>
                                        <TbLogout2 className='text-3xl' />
                                        <h1 className='text-lg'>Logout</h1>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Page content here */}
            </div>
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80  gap-2">
                    {/* Sidebar content here */}
                        <Link to="/">
                    <li>
                            <div className='flex gap-2'>
                                <IoHomeOutline className='text-3xl ml-1' />
                                <h1 className='text-lg pl-1'>Dashboard</h1>
                            </div> 
                    </li>
                            </Link>
                    <li onClick={() => { setProfile((prev) => !prev) }} className='pl-1'>
                        <div> <div className="avatar">
                            <div className="w-[30px] h-[30px] rounded-full">
                                <img src={authUser.profileImg || "/profileAvatar.jpeg"} />
                            </div>
                        </div>
                            <h1 className='text-lg pl-1'>Profile</h1>
                        </div></li>
                        <Link to="/notifications">
                    <li>
                            <div className='flex gap-2'>
                                <div>
                                    <BsBell className='text-3xl relative' />
                                    {/* <span className='absolute bottom-7 left-8 bg-red-500 text-white text-xs font-bold rounded-full px-1'>{count}</span> */}
                                </div>
                                <h1 className='text-lg pl-1'>UpdatesFeed</h1>
                            </div>
                    </li>
                        </Link>
                    <Link to="/">
                    <li> 
                        <div className='flex gap-2' onClick={handleLogout}>
                            <TbLogout2 className='text-3xl' />
                            <h1 className='text-lg pl-1'>Logout</h1>
                        </div>   
                    </li> 
                    </Link>
                </ul>
            </div>
        </div>
    )
}

export default Header;
