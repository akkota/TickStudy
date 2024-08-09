import React, { useState, useEffect } from 'react'
import { CiTimer } from "react-icons/ci";
import { FiActivity } from "react-icons/fi";
import { GiTomato } from "react-icons/gi";
import { VscCheck } from "react-icons/vsc";
import { Navigate, useNavigate } from 'react-router-dom';
import { BiRun } from "react-icons/bi";

const Sidebar = (props) => {

  const [dashboard, setDashboard] = useState('sidebar-icon');
  const [statistics, setStatistics] = useState('sidebar-icon')
  const [pomodoro, setPomodoro] = useState('sidebar-icon');
  const [tasks, setTasks] = useState('sidebar-icon');
  const [habits, setHabits] = useState('sidebar-icon')
  const navigate = useNavigate();

  useEffect(() => {
    if (props.from === "statistics") {
      setDashboard('sidebar-icon')
      setStatistics('sidebar-icon sidebar-active')
      setPomodoro('sidebar-icon');
      setTasks('sidebar-icon');
      setHabits('sidebar-icon')
    } else if (props.from === "dashboard") {
      setDashboard('sidebar-icon sidebar-active');
      setStatistics('sidebar-icon');
      setPomodoro('sidebar-icon');
      setTasks('sidebar-icon');
      setHabits('sidebar-icon')
    } else if (props.from === "pomodoro") {
      setStatistics('sidebar-icon');
      setDashboard('sidebar-icon')
      setPomodoro('sidebar-icon sidebar-active');
      setTasks('sidebar-icon');
      setHabits('sidebar-icon')
    } else if (props.from === "tasklist") {
      setTasks('sidebar-icon sidebar-active');
      setStatistics('sidebar-icon');
      setDashboard('sidebar-icon')
      setPomodoro('sidebar-icon')
      setHabits('sidebar-icon')
    } else if (props.from === "habits") {
      setTasks('sidebar-icon');
      setStatistics('sidebar-icon');
      setDashboard('sidebar-icon')
      setPomodoro('sidebar-icon') 
      setHabits('sidebar-icon sidebar-active')
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

  function handleTasks() {
    navigate('/tasklist')
  }

  function handleHabits() {
    navigate('/habits')
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-slate-600 text-white shadow-lg">
        <div className="relative group">
            <CiTimer onClick={handleDashboard} className={dashboard} />
            <span className='sidebar-tooltip group-hover:scale-100'>Regular Timer</span>
        </div> 
        <div className='relative group'>
            <FiActivity onClick={handleStatistics} className={statistics} />
            <span className='sidebar-tooltip group-hover:scale-100'>Statistics</span> 
        </div>    
        <div className='relative group'>
            <GiTomato onClick={handlePomodoro} className={pomodoro} />
            <span className='sidebar-tooltip group-hover:scale-100'>Pomodoro Timer</span> 
        </div>
        <div className='relative group'>
            <VscCheck onClick={handleTasks} className={tasks} />
            <span className='sidebar-tooltip group-hover:scale-100'>Tasks</span> 
        </div>
        <div className='relative group'>
            <BiRun onClick={handleHabits} className={habits} />
            <span className='sidebar-tooltip group-hover:scale-100'>Habits</span> 
        </div>
    </div>
  )
}



export default Sidebar