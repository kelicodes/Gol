import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiNamecheap } from "react-icons/si";
import { AuthContext } from "../../Context/Authcontext.jsx";
import "./Login.css";

const Login = () => {
  const [logstate, setLogstate] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      let response;

      if (logstate === "signup") {
        response = await axios.post("https://goldback2.onrender.com/user/reg", {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post("https://goldback2.onrender.com/user/login", {
          email,
          password,
        });
      }

      if (response.data.success) {
        // Save token to localStorage AND context
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);

        // Clear fields
        setName("");
        setEmail("");
        setPassword("");

        toast.success(response.data.message);
        navigate("/"); // redirect after login/signup
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="LoginContainer">
      <form onSubmit={submithandler} className="Login">
        <div className="navbar-logo">
          <h2>
            Gold<span>Store</span>
          </h2>
        </div>

        {logstate === "signup" && (
          <div className="enter">
            <SiNamecheap />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
        )}

        <div className="enter">
          <MdAttachEmail />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="enter">
          <RiLockPasswordFill />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="btn">
          {logstate === "signup" ? "Sign Up" : "Login"}
        </button>

        <p>
          {logstate === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setLogstate(logstate === "signup" ? "login" : "signup")}>
            {logstate === "signup" ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
