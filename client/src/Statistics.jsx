import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { useAuth } from './components/utils/AuthContext';
import { useEffect } from 'react';

const Statistics = () => {

  const { getStudyTime } = useAuth();
  const [studyHours, setStudyHours] = useState(0);

  useEffect(() => {
    const fetchStudyTime = async () => {
      const studyTime = await getStudyTime();
      if (studyTime) {
        setStudyHours(studyTime);
      }
    };

    fetchStudyTime();
  }, [getStudyTime]);

  return (
    <div className="flex flex-col h-screen items-center justify-center ml-24">
        <Sidebar from="statistics"/>
        <div className="font-nunito text-8xl mb-12">Study time</div>
        <div className='font-nunito text-9xl text-transparent gradient-text animate-gradient'> {studyHours} hours </div>
    </div>
  )
}

export default Statistics