import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { useAuth } from './components/utils/AuthContext';
import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import Linegraph from './components/Linegraph';

const Statistics = () => {

  const { getStudyTime, getStudyTimeStat } = useAuth();
  const [studyHours, setStudyHours] = useState(0);
  const [studyTimeStat, setStudyTimeStat] = useState([]);

  useEffect(() => {
    const fetchStudyTime = async () => {
      const studyTime = await getStudyTime();
      if (studyTime) {
        setStudyHours(studyTime);
      }
      const studyTimeStat = await getStudyTimeStat()
      if (studyTimeStat) {
        setStudyTimeStat(studyTimeStat);
      }
    };

    fetchStudyTime();
  }, [getStudyTime]);

  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center ml-24">
          <Sidebar from="statistics"/>
          <div className="font-nunito text-8xl mb-12">Study time</div>
          <div className='font-nunito text-9xl text-transparent gradient-text animate-gradient mb-48'> {studyHours} hours </div>
          <Linegraph content={studyTimeStat} />
      </div>
    </>
  )
}

export default Statistics