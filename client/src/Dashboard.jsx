import React, { useEffect, useState } from 'react'
import { useAuth } from './components/utils/AuthContext'
import Sidebar from './components/Sidebar';
import Button from './components/Button';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
const Dashboard = () => {

  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(1);
  const [key, setKey] = useState(0);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const { user, saveTime } = useAuth();

  const renderTime = ({remainingTime}) => {
    setRemainingTime(remainingTime)
    if (remainingTime === 0) {
        return <div className='ml-12 text-3xl'>Take a break!</div>
    }

    return (
        <div className="timer">
            <div className='mt-1 font-nunito text-5xl'>{Math.floor(remainingTime / 60) + ": " + (remainingTime % 60).toString().padStart(2, '0')}</div>
        </div>
    )
  }

  function handleStart() {
    setPlaying(true);
  }

  function handlePlus() {
    const newDuration = duration + 1;
    if (newDuration > 99) {
        alert("Timer does not support times larger than 99 minutes");
        return;
    }
    setDuration(duration + 1);
  }

  async function handleStop() {
    if (remainingTime > 0) {
      const userConfirm = window.confirm("Are you sure you would like to stop?")
      if (userConfirm) {
          setPlaying(false);
          setKey(key + 1);
          await saveTime(duration * 60 - remainingTime);
      }
    } else {
      setPlaying(false);
      setKey(key + 1)
      await saveTime(duration * 60)
    }
  }

  function handleMinus() {
    const newDuration = duration - 1;
    if (newDuration < 1) {
        alert("Minutes more than one minute must be chosen");
        return;
    }
    setDuration(duration - 1);
  }

  return (
    <div>
        <Sidebar />
        <div className="flex flex-col h-screen items-center justify-center ml-24">
            <div className="mr-2 mb-24 scale-150">
                <CountdownCircleTimer
                key = {key}
                isPlaying={playing}
                duration={duration * 60}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[duration * 60, duration * 60 * 2/5, duration * 60 * 1/15, 0]}
                onComplete={() => ({ shouldRepeat: false})}
                >
                    {renderTime}
                </CountdownCircleTimer>
            </div>
            {playing ? <Button onClick={handleStop} content="Stop"></Button> : (<div>
                <div className={(duration >= 10 ? " ml-[21px]" : "")}>
                    <div className='mb-10'>
                        <Button className="ml-8" onClick={handleStart} content="Start"></Button>
                    </div>
                    <div>
                        <Button onClick={handlePlus} className="mr-8" content="+"></Button>
                        <Button onClick={handleMinus} content="-"></Button>
                    </div>
                </div>
                <div className="mt-8">
                <span className={'font-nunito text-7xl'}>
                    {duration + ": 00"}
                </span>
                </div>
            </div>)}
            
        </div>
    </div>
  )
}

export default Dashboard;