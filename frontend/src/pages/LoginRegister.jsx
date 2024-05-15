import axios from "axios";
import { useSnackbar } from 'notistack';
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import bgi from "../assets/bgi.jpg";
import { UserContext } from '../components/UserContext';

const LoginRegister=()=>{

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [registerLogin,setRegisterLogin]=useState('login')
    const {setUsername:setLoggedInUsername,setId}=useContext(UserContext)
    const { enqueueSnackbar } = useSnackbar();
    const navigate=useNavigate();
    const handleSubmit=async()=>{
        try{
            const user={
                username:username,
                password:password,
            }
            const url = (registerLogin === 'register' ? 'register' : 'login');
            const {data}=await axios.post(`http://localhost:5000/api/v1/users/${url}`,user)
            console.log({data})
            setLoggedInUsername(username);
            setId(data.id);
            enqueueSnackbar(`${url}ed successfully`, { variant: 'success' });
            navigate('/Home')
        }
        catch(err){
            enqueueSnackbar('Error: '+err.message, { variant:'error'})
            console.log(err)
        }
    }
    return(
        <div className='flex items-center h-screen bg-cover' style={{ backgroundImage:`url(${bgi})`, backgroundPosition: 'center' }}>
          <div className='flex flex-col justify-center items-center backdrop-blur-md border-2 border-blue-300 rounded-xl w-[400px] h-[400px] p-4 absolute top-1/2 transform -translate-y-1/2 bg-white'style={{ right: '200px' }}>

                <div className='my-1'>
                    <label className='text-3xl mr-4 text-black-600/75 font-serif font-extrabold'>Username</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='border-2 border-gray-200 px-4 py-2 w-full font-semibold bg-white'
                    />
                </div>
                <div className='my-1'>
                    <label className='text-3xl mr-4 text-black-600/75 font-serif font-extrabold'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border-2 border-gray-200 px-4 py-2 w-full font-semibold bg-white'
                    />
                </div>
                <button className='p-2 bg-cyan-400 hover:bg-blue-600 m-6 rounded-md font-semibold text-white-600 italict-xl' onClick={handleSubmit}>
                    {registerLogin==='login'?'Login':'Register'}
                </button>
                <div className="text-center mt-2">
                    {registerLogin === 'register' && (
                        <div>
                            Already a member?
                            <button className="ml-1 font-semibold" onClick={() => setRegisterLogin('login')}>
                                Login here
                            </button>
                        </div>
                    )}
                    {registerLogin === 'login' && (
                        <div>
                            Dont have an account?
                            <button className="ml-1 font-semibold" onClick={() => setRegisterLogin('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>     
    )
}

export default LoginRegister;