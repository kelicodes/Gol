import { Routes,Route } from "react-router-dom"
import Login from "./Pages/Login/Login.jsx"
import Home from "./Pages/Home/Home.jsx"
import Collection from "./Components/Collection/Collection.jsx"
import Navbar from "./Components/Navbar/Navbar.jsx"
import Footer from "./Components/Footer/Footer.jsx"

const App=()=>{


  return (
    <div className="app">
      <Navbar/>
      <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/collection" element={<Collection/>}/>
      </Routes>
      </main>
      <Footer/>
    </div>
  )
}


export default App