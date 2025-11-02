import { useState,useEffect,useContext } from "react"
import {useNavigate,Link} from 'react-router-dom'
import {toast} from "react-toastify"
import axios from "axios"
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
 import { SiNamecheap } from "react-icons/si";
import "./Login.css"

const Login=()=>{
    const [logstate,setLogstate]=useState("login")
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const navigate=useNavigate()


    const submithandler=async(e)=>{
        e.preventDefault()
        try{
            const formdata=new FormData()
           
            if(logstate === "signup"){
                 formdata.append("name",name)
                formdata.append("email",email)
                formdata.append("password",password)
                console.log("we on 1")

                const response= await axios.post("https://goldback2.onrender.com/user/reg",{
                    email,password,name
                })

                if(response){
                    setEmail("")
                    setName('')
                    setPassword("")
                    toast.success(response.data.message)
                    navigate('/add')
                }
            }else if(logstate === "login"){
                formdata.append("email",email)
                formdata.append("password",password)
                 console.log(email,password)
                 console.log("we on 202")
                

                const response= await axios.post("https://goldback2.onrender.com/user/login",{
                    email,password
                })

                if(response){
                
                    setEmail("")
                    setName('')
                    setPassword("")
                     toast.success(response.data.message)
                    navigate('/add')
                }
            }
            
        }catch(e){
            console.log(e)
            toast.error(e)
        }
    }


    return(<form onSubmit={submithandler} className="Login">
         <div className="navbar-logo">
        <h2>Gold<span>Store</span></h2>
      </div>
        {
            logstate === "signup" ? <div className="Name">
                <div className="Nameinput enter">
                   
<SiNamecheap />
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="enter name" />
                </div>
            </div> : <></>
        }

        <div className="Email enter">
            <MdAttachEmail />
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder="Enter email " />
        </div>
          <div className="Password enter">
            <RiLockPasswordFill />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password"   placeholder="Enter password " />
        </div>
        {
            logstate === "signup" ? <p onClick={()=>setLogstate("login")}>Already have an account? <span>Login</span></p> :
             <p onClick={()=>setLogstate("signup")}>Dont have an account? <span>Signin</span></p>
        }

        <button className="btn">SUBMIT</button>
    </form>)
}



export default Login