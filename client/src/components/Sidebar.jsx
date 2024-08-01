import React, { useState, useEffect } from 'react'
import { CiTimer } from "react-icons/ci";
import { FiActivity } from "react-icons/fi";
import { GiTomato } from "react-icons/gi";
import { Navigate, useNavigate } from 'react-router-dom';

const Sidebar = (props) => {

  const [dashboard, setDashboard] = useState('sidebar-icon');
  const [statistics, setStatistics] = useState('sidebar-icon')
  const [pomodoro, setPomodoro] = useState('sidebar-icon');
  const navigate = useNavigate();

  useEffect(() => {
    if (props.from === "statistics") {
      setDashboard('sidebar-icon')
      setStatistics('sidebar-icon sidebar-active')
      setPomodoro('sidebar-icon');
    } else if (props.from === "dashboard") {
      setDashboard('sidebar-icon sidebar-active');
      setStatistics('sidebar-icon');
      setPomodoro('sidebar-icon');
    } else if (props.from === "pomodoro") {
      setStatistics('sidebar-icon');
      setDashboard('sidebar-icon')
      setPomodoro('sidebar-icon sidebar-active') 
    }
  }, [props.from])
  

  function handleDashboard() {
    navigate('/dashboard');
  }

  function handleStatistics() {
    navigate('/statistics')
  }

  function handlePomodoro() {
    navigate('/pomodoro')
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-slate-600 text-white shadow-lg">
        <div className="relative group">
            <CiTimer onClick={handleDashboard} className={dashboard} />
            <span className='sidebar-tooltip group-hover:scale-100'>Study Timer</span>
        </div> 
        <div className='relative group'>
            <FiActivity onClick={handleStatistics} className={statistics} />
            <span className='sidebar-tooltip group-hover:scale-100'>Statistics</span> 
        </div>    
        <div className='relative group'>
            <GiTomato onClick={handlePomodoro} className={pomodoro} />
            <span className='sidebar-tooltip group-hover:scale-100'>Pomodoro Timer</span> 
        </div>
    </div>
  )
}



export default Sidebar