import React, { useState } from 'react'
import { GoCheckCircle } from "react-icons/go";
import { GoCheckCircleFill } from "react-icons/go";
import { useAuth } from './AuthContext';

const Task = (props) => {
  
  const [checked, setChecked] = useState(false);
  const { removeTask, setAlert } = useAuth();

  async function handleChange() {
    setChecked(!checked);
    const alert = await removeTask(props.content.task_title);
    setAlert(alert);
    setTimeout(() => setAlert(null), 3000);
    setChecked(false);
  }

  return (
    <div className="mt-2"> 
        <div className={((props.content.priority === "high") ? "card-task-hard" : "") + ((props.content.priority === "normal") ? "card-task-medium" : "") + ((props.content.priority === "low") ? "card-task-easy" : "")}>
            {checked ? (<GoCheckCircleFill id={props.id} onClick={handleChange} className='mr-3 text-emerald-600 text-xl hover:cursor-pointer'/>)
            : (<GoCheckCircle id={props.id} onClick={handleChange} className="mr-3 text-emerald-400 hover:text-emerald-600 hover:cursor-pointer text-xl"/>)}

            <label className={"font-nunito text-lg " + (checked ? "line-through" : "") } htmlFor={props.id}>{props.content.task_title}</label>
        </div>
    </div>
  )
}

export default Task