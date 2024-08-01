import React, { useState } from 'react'
import { FaBook } from "react-icons/fa";

const Sidebar = () => {

  const [dashboard, setDashboard] = useState('sidebar-icon sidebar-active');

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-slate-600 text-white shadow-lg">
        <div className="relative group">
            <FaBook className={dashboard} />
            <span id="#dashboard" className='sidebar-tooltip group-hover:scale-100'>Dashboard</span>
        </div> 
    </div>
  )
}



export default Sidebar