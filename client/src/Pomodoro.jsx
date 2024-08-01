import React from 'react'
import Sidebar from './components/Sidebar'

const Pomodoro = () => {
  return (
    <>
        <Sidebar from="pomodoro" />
        <div className="grid h-screen grid-cols-2 grid-rows-2 gap-6 ml-24">
            <div className='col-span-2'></div>
            <div className=''></div>
            <div className=''></div>
        </div>
    </>
  )
}

export default Pomodoro