import React from 'react'
import Button from './components/Button'
import { useNavigate } from "react-router-dom";

const Landing = () => {

  const navigate = useNavigate();

  function handleClick() {
    navigate("/login");
  }

  return (
    <div className="text-center mt-36">
      <h1 className="mb-12 font-nunito text-7xl text-blue-100">TickStudy - v 1.0.0</h1>
      <Button onClick={handleClick} content="Start"></Button>
    </div>
  )
}

export default Landing