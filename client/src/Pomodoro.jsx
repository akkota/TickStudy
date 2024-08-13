import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Button from './components/Button'
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useAuth } from './components/utils/AuthContext';
import Coin from './components/Coin';
//TODO: Alerts show up twice when running pomodoro and remainingtime. 
//TODO: Make pomodoro time add to study time in database
const Pomodoro = () => {

  const { saveTime, alert, setAlert } = useAuth();
  const [studyDuration, setStudyDuration] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState(0);
  const [isStudyTime, setStudyTime] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const navigate = useNavigate();

  async function renderSave() {
    await saveTime(sessions * studyDuration * 30); //*30 because renderSave is called twice (bug)
  }
  const renderTime = ({remainingTime}) => {
    setRemainingTime(remainingTime);
    if (remainingTime === 0) {
        if (isStudyTime) {  
            if (currentSession === sessions) {
                setAlert("You are done with all sessions, good job!")
                renderSave();
                setStudyTime(false);
                setStudyDuration(0);
                setBreakDuration(0);
                setPlaying(false);
                setCurrentSession(0);
                setSessions(0);
                setKey(key + 1);
                setTimeout(() => setAlert(null), 3000);
            } else {
                setAlert("Good job! It's time to take a break");
                setStudyTime(false);
                setKey(key + 1);
                setTimeout(() => setAlert(null), 3000);
            }
        } else {
            setAlert("Good break, it's time to study!")
            setCurrentSession(currentSession + 1);
            setStudyTime(true);
            setKey(key + 1)
            setTimeout(() => setAlert(null), 3000);
        }
    }

    return (
        <div className="timer">
            <div className='mt-1 font-nunito text-5xl'>{Math.floor(remainingTime / 60) + ": " + (remainingTime % 60).toString().padStart(2, '0')}</div>
        </div>
    )
  }

  function handlePlusStudy() {
    if (studyDuration === 90) {
        window.alert("Pomodoro mode currently does not support times greater than 90");
    } else {
        setStudyDuration(studyDuration + 5)
    }
  }

  function handleMinusStudy() {
    if (studyDuration === 0) {
        window.alert("Time can't be negative!")
    } else {
        setStudyDuration(studyDuration - 5);
    }
  }

  function handlePlusBreak() {
    if (breakDuration === 90) {
        window.alert("Pomodoro mode currently does not support times greater than 90");
    } else {
        setBreakDuration(breakDuration + 1)
    } 
  }

  function handleMinusBreak() {
    if (breakDuration === 0) {
        window.alert("Time can't be negative!")
    } else {
        setBreakDuration(breakDuration - 1);
    } 
  }

  function handleSession(e) {
    if (e.target.id === "plus-session") {
        if (sessions === 16) {
            window.alert("Does not support more sessions");
        } else {
            setSessions(sessions + 1);
        }
    } else {
        if (sessions === 0) {
            window.alert("Can't have negative sessions");
        } else {
            setSessions(sessions - 1)
        }
    }
  }

  function handleStart() {
    if (studyDuration !=0 && breakDuration != 0 && sessions != 0) {
        setPlaying(true);
        setStudyTime(true);
        setCurrentSession(currentSession + 1);
    } else {
        window.alert("All values have to be set greater than 0!")
    }
  }

  async function handleStop() {
    if (remainingTime > 0) {
        const userConfirm = window.confirm("Are you sure you would like to stop?")
        if (userConfirm) {
            await saveTime((currentSession - 1) * studyDuration * 60 + studyDuration * 60 - remainingTime);
            setPlaying(false);
            setKey(key + 1);
            
        }
      } else {
        setPlaying(false);
        setKey(key + 1)
      }
  }


  return (
    <>
        <Sidebar from="pomodoro" />
        {isPlaying ? 
        (<div>
            <Coin />
            <div className='flex flex-col justify-center items-center h-screen ml-24'>
                {
                    alert &&
                    <Alert className="absolute top-6" icon={<CheckIcon fontSize="inherit" />} variant="filled" severity="success">
                        {alert}
                    </Alert>
                }
                <div className='mb-8 text-3xl font-nunito'>{isStudyTime ? "Study" : "Break"}</div>
                <CountdownCircleTimer
                    key = {key}
                    isPlaying={isPlaying}
                    duration={isStudyTime ? studyDuration * 60 : breakDuration * 60}
                    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                    colorsTime={[isStudyTime ? studyDuration * 60 : breakDuration * 60, isStudyTime ? studyDuration * 60 * 2/5 : breakDuration * 60 * 2/5, isStudyTime ? studyDuration * 60 * 1/15 : breakDuration * 60 * 1/15, 0]}
                    onComplete={() => ({ shouldRepeat: false})}
                    >
                        {renderTime}
                </CountdownCircleTimer>
                <Button className="mt-24" content={"Stop"} onClick={handleStop} />
            </div>
        </div>) 
        : (<div>
            <Coin />
            <div className="grid h-screen grid-cols-2 grid-rows-2 gap-6 ml-24">
                {
                    alert &&
                    <Alert className="absolute top-6" icon={<CheckIcon fontSize="inherit" />} variant="filled" severity="success">
                        {alert}
                    </Alert>
                }
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
            </div>
            </div>)}
        
    </>
  )
}

export default Pomodoro