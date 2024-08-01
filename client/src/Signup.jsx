import React, { useState } from 'react'
import Button from './components/Button'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  async function handleSignup() {
    if (emailError || passwordError) {
      setEmailError(emailError ? "Invalid signup credentials" : null);
      setPasswordError(passwordError ? "Invalid signup credentials" : null);
    } else {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      const data = await response.json();
      if (data.error) {
        setEmailError(data.error + "\n Please refresh and try again!");
      } else {
        alert("User created! Login to use your account!");
        navigate("/login")
      }
    }
  }

  function handleEmail(e) {
    setEmail(e.target.value)
    if (!email.includes("@")) {
        setEmailError("Email must include '@' symbol");
    } else {
        setEmailError(null);
    }
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!(hasLower && hasUpper && hasNumber && hasMinLength)) {
        setPasswordError("Password must contain lower case, upper case, number, and be at least 8 characters long");
    } else {
        setPasswordError(null);
    }
  }

  function handleVisibility() {
    setVisibility(!visibility);
  }

  return (
    <div className="h-screen flex justify-center items-center font-nunito">
        <div className="card-login relative">
            <div className="mb-8 text-2xl text-center">Sign up</div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" onChange={handleEmail} value={email} className="block border-2 text-sm border-solid border-black bg-slate-200 h-8 w-68 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-3" />
            <label htmlFor="password">Password</label>
            <input onChange={handlePassword} value={password} type={visibility ? "text" : "password"} id="password" className="block border-2 text-sm border-solid border-black bg-slate-200 h-8 w-68 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-6" />
            {!visibility ? <VisibilityOutlinedIcon onClick={handleVisibility} fontSize="small" color="primary" className="absolute top-[191px] left-64" /> : <VisibilityOffOutlinedIcon onClick={handleVisibility} fontSize="small" color="primary" className="absolute top-[191px] left-64"/>}
            <div className="flex justify-center">
                <Button onClick={handleSignup} content="Sign up"></Button>
            </div>
            <div className="flex justify-center mt-6">
                <div>Have an account? Login <a className="underline hover:text-blue-400" href="/login">here</a></div>
            </div>
            {true && <div class="text-red-600 text-center"> {emailError} </div>}
            {true && <div class="text-red-600 text-center"> {passwordError} </div>}
        </div>
    </div>
  )
}

export default Signup