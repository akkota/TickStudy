import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Button from './components/Button'
import { useNavigate } from 'react-router-dom';

const Pomodoro = () => {

  const [studyDuration, setStudyDuration] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState(0);
  const [isStudyTime, setStudyTime] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const navigate = useNavigate();

  function handlePlusStudy() {
    if (studyDuration === 90) {
        alert("Pomodoro mode currently does not support times greater than 90");
    } else {
        setStudyDuration(studyDuration + 5)
    }
  }

  function handleMinusStudy() {
    if (studyDuration === 0) {
        alert("Time can't be negative!")
    } else {
        setStudyDuration(studyDuration - 5);
    }
  }

  function handlePlusBreak() {
    if (breakDuration === 90) {
        alert("Pomodoro mode currently does not support times greater than 90");
    } else {
        setBreakDuration(breakDuration + 5)
    } 
  }

  function handleMinusBreak() {
    if (breakDuration === 0) {
        alert("Time can't be negative!")
    } else {
        setBreakDuration(breakDuration - 5);
    } 
  }

  function handleSession(e) {
    if (e.target.id === "plus-session") {
        if (sessions === 16) {
            alert("Does not support more sessions");
        } else {
            setSessions(sessions + 1);
        }
    } else {
        if (sessions === 0) {
            alert("Can't have negative sessions");
        } else {
            setSessions(sessions - 1)
        }
    }
  }

  function handleStart() {
    if (studyDuration !=0 && breakDuration != 0 && sessions != 0) {
        setPlaying(true);
    } else {
        alert("All values have to be set greater than 0!")
    }
  }


  return (
    <>
        <Sidebar from="pomodoro" />
        {isPlaying ? 
        (<div className='flex justify-center items-center h-screen ml-24'>
            <div>Study Time</div>
        </div>) 
        : (<div className="grid h-screen grid-cols-2 grid-rows-2 gap-6 ml-24">
            <div className='col-span-2 text-center mt-24'>
                <h3 className='mt-12 mb-4 text-5xl font-nunito'>Number of sessions</h3>
                <p className='font-nunito mb-6 text-5xl'> {sessions}</p>
                <div className='flex-col'>
                    <div>
                        <Button id="plus-session" className="mr-12" content={"+"} onClick={handleSession}>

                        </Button>
                        <Button id="minus-session" content={"-"} onClick={handleSession}>

                        </Button>
                    </div>
                    <Button className="mt-48 scale-150" content="Start" onClick={handleStart}>

                    </Button>
                </div>
            </div>
            <div className='text-center'>
                <h2 className='font-nunito mb-12 text-5xl'>Study Time</h2>
                <p className='font-nunito mb-8 text-5xl'> {studyDuration} : 00</p>
                <Button className="mr-12" content={"+5"} onClick={handlePlusStudy}>

                </Button>
                <Button content={"-5"} onClick={handleMinusStudy}>

                </Button>
            </div>
            <div className='text-center'>
            <h2 className='font-nunito mb-12 text-5xl'>Break Time</h2>
                <p className='font-nunito mb-8 text-5xl'> {breakDuration} : 00</p>
                <Button className="mr-12" content={"+"} onClick={handlePlusBreak}>

                </Button>
                <Button content={"-"} onClick={handleMinusBreak}>

                </Button> 
            </div>
        </div>)}
        
    </>
  )
}

export default Pomodoro