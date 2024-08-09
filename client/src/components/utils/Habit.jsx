import React, { useState, useEffect } from 'react'
import { GoCheckCircle } from "react-icons/go";
import { GoCheckCircleFill } from "react-icons/go";
import { useAuth } from './AuthContext';
import { MdLocalFireDepartment } from "react-icons/md";

const Habit = (props) => {
  
  const [checked, setChecked] = useState(false);
  const [streak, setStreak] = useState(props.streak)
  const { updateStreakHabit } = useAuth();
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastDone = props.date.split('T')[0];
    if (lastDone === currentDate) {
      setChecked(true);
    }
  })

  async function handleChange() {
    setChecked(true);
    setStreak(streak + 1);
    updateStreakHabit(props.habit_name);
  }

  return (
    <div className="mt-2 flex flex-row"> 
        <div className="card-task-easy">
            {checked ? (<GoCheckCircleFill id={props.id} className='mr-3 text-yellow-600 text-xl hover:cursor-pointer'/>)
            : (<GoCheckCircle id={props.id} onClick={handleChange} className="mr-3 text-yellow-400 hover:text-yellow-600 hover:cursor-pointer text-xl"/>)}

            <label className={"font-nunito text-lg " + (checked ? "line-through" : "") } htmlFor={props.id}>{props.habit_name}</label>
        </div>
        <div className="flex flex-row items-center font-nunito relative ml-6"> 
              <MdLocalFireDepartment className="mt-1 mr-1 text-red-400" />
              <div className="font-nunito mt-[5px]">{streak} </div>
        </div> 
    </div>
  )
}

export default Habit