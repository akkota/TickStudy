import React, { useState, useEffect } from 'react'
import Button from './components/Button'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useAuth } from './components/utils/AuthContext';

const Login = () => {

  const [visibility, setVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let {user, loginUser, error} = useAuth();

  async function handleLogin() {
    const message = await loginUser({email, password});
  }

  function handleEmail(e) {
    setEmail(e.target.value)
  }

  function handlePassword(e) {
    setPassword(e.target.value)
  }

  function handleVisibility() {
    setVisibility(!visibility);
  }

  return (
    <div className="h-screen flex justify-center items-center font-nunito">
        <div className="card-login relative">
            <div className="mb-8 text-2xl text-center">Login</div>
            <label htmlFor="email">Email</label>
            <input type="text" onChange={handleEmail} value={email} id="email" className="block border-2 text-sm border-solid border-black bg-slate-200 h-8 w-68 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-3" />
            <label htmlFor="password">Password</label>
            <input onChange={handlePassword} value={password} type={visibility ? "text" : "password"} id="password" className="block border-2 text-sm border-solid border-black bg-slate-200 h-8 w-68 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-6" />
            {!visibility ? <VisibilityOutlinedIcon onClick={handleVisibility} fontSize="small" color="primary" className="absolute top-[191px] left-64" /> : <VisibilityOffOutlinedIcon onClick={handleVisibility} fontSize="small" color="primary" className="absolute top-[191px] left-64"/>}
            <div className="flex justify-center">
                <Button onClick={handleLogin} content="Login"></Button>
            </div>
            <div className="flex justify-center mt-6">
                <div>Don't have an account? Sign up <a className="underline hover:text-blue-400" href="/signup">here</a></div>
            </div>
            {error && <div className="text-red-600">{error}</div>}
        </div>
    </div>
  )
}

export default Login