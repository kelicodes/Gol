import { Routes,Route } from "react-router-dom"
import Login from "./Pages/Login/Login.jsx"
import Home from "./Pages/Home/Home.jsx"
import Collection from "./Components/Collection/Collection.jsx"
import Navbar from "./Components/Navbar/Navbar.jsx"
import Footer from "./Components/Footer/Footer.jsx"
import ProductDetail from "./Pages/Productdetail/Productdetail.jsx"
import CheckoutPage from "./Pages/Checkout/Checkout.jsx"
import Cartcheckout from "./Pages/Cartcheckout/Cartcheckout.jsx"
import Spinner from "./Components/Spinner/Spinner.jsx"

const App=()=>{


  return (
    <div className="app">
      <Navbar/>
      <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/collection" element={<Collection/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/check" element={<Spinner/>}/>
      </Routes>
      </main>
      <Footer/>
    </div>
  )
}


export default App