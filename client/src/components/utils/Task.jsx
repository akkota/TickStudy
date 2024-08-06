import React, { useState } from 'react'
import { GoCheckCircle } from "react-icons/go";
import { GoCheckCircleFill } from "react-icons/go";
import { useAuth } from './AuthContext';

const Task = (props) => {
  
  const [checked, setChecked] = useState(false);
  const { removeTask } = useAuth();

  async function handleChange() {
    setChecked(!checked);
    await removeTask(props.content);
    setChecked(false);
  }

  return (
    <> 
        <div className='card-task'>
            {checked ? (<GoCheckCircleFill id={props.id} onClick={handleChange} className='mr-3 text-emerald-600 text-xl hover:cursor-pointer'/>)
            : (<GoCheckCircle id={props.id} onClick={handleChange} className="mr-3 text-emerald-400 hover:text-emerald-600 hover:cursor-pointer text-xl"/>)}

            <label className={"font-nunito text-lg " + (checked ? "line-through" : "")} htmlfor={props.id}>{props.content}</label>
        </div>
    </>
  )
}

export default Task