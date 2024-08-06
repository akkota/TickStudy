import React, { useState, useEffect } from 'react'
import { useAuth } from './components/utils/AuthContext'
import Sidebar from './components/Sidebar'
import Task from './components/utils/Task'
import { GoPlusCircle } from "react-icons/go";
import { GoNoEntry } from "react-icons/go";
import axios from 'axios'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Button from './components/Button';

const Tasklist = () => {

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('normal')
  const [display, setDisplay] = useState(false);
  const { getTasks, addTask, alert, setAlert } = useAuth();


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [getTasks]);

  function handleDisplay() {
    setDisplay(!display);
  }

  function handleTask(e) {
    setTask(e.target.value);
  }

  function handlePriority(e) {
    setPriority(e.target.value);
  }

  async function submitTask() {
    if (task === "") {
      alert("Task must contain something");
    }

    let newTask = { task_title: task, priority }
    setTasks((prevTasks) => [...prevTasks, newTask]);
    const alertInfo = await addTask(task, priority);
    setAlert(alertInfo);
    setTimeout(() => setAlert(null), 3000);
  }

  return (
    <>
      <Sidebar from="tasklist" />
      <div className="ml-24 flex flex-col h-screen justify-center items-center">
        {
          alert &&
          <Alert className="absolute top-6" icon={<CheckIcon fontSize="inherit" />} variant="filled" severity="success">
              {alert}
          </Alert>
        }
        <div className='flex text-4xl mb-4'>
          <h1 className="mr-4 font-nunito">Task List</h1>
          {display ? 
          (<>
            <GoNoEntry onClick={handleDisplay} className="text-3xl mt-1 text-emerald-400 hover:text-emerald-600 hover:cursor-pointer" />
            
          </>
          )
          : (<GoPlusCircle onClick={handleDisplay} className="text-3xl mt-1 text-emerald-400 hover:text-emerald-600 hover:cursor-pointer" />)}
        </div>
        <div className="mb-12 w-[800px] flex flex-col items-center">
          {display ? 
          (<>
            <label htmlfor="task" className='text-xl font-nunito'>Enter Task Title: </label>
            <input onChange={handleTask} value={task} type="text" id="task" className="block border-2 text-lg border-solid border-black bg-slate-200 h-10 w-96 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-3" />
            <label htmlfor="priority" className='text-xl font-nunito mb-2'>Priority</label>
            <select name="priority" value={priority} onChange={handlePriority} id="priority" className="border-2 border-solid border-black bg-slate-200 h-10 w-96 text-lg text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-3">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            
            <Button onClick={submitTask} className="w-[200px]" content="Submit Task" />
          </>) 
          : (<></>)}
        </div>
        
        <div>
            {tasks.map((task, index) => {
              return <Task key={index} content={task} />
            })}
        </div>
      </div>
    </>
  )
}

export default Tasklist