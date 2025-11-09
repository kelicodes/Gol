import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiNamecheap } from "react-icons/si";
import { AuthContext } from "../../Context/Authcontext.jsx";
import "./Login.css";

const Spinner = () => (
  <div className="button-spinner">
    <div className="spinner"></div>
  </div>
);

const Login = () => {
  const [logstate, setLogstate] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;

      if (logstate === "signup") {
        response = await axios.post(
          "https://goldback2.onrender.com/user/reg",
          { name, email, password } // token returned in response.data.token
        );
      } else {
        response = await axios.post(
          "https://goldback2.onrender.com/user/login",
          { email, password } // token returned in response.data.token
        );
      }

      if (response.data.success) {
        // Save token for token-only auth
        localStorage.setItem("token", response.data.token);

        setName("");
        setEmail("");
        setPassword("");
        toast.success(response.data.message);

        // Optional: track login state in context
        if (setToken) setToken(true);

        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginContainer">
      <form onSubmit={submithandler} className="Login">
        <div className="navbar-logo">
          <h2>Gold<span>Store</span></h2>
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

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <Spinner /> : logstate === "signup" ? "Sign Up" : "Login"}
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
