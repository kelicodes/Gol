import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Collection from "./Components/Collection/Collection.jsx";
import ProductDetail from "./Pages/Productdetail/Productdetail.jsx";

import Cartcheckout from "./Pages/Cartcheckout/Cartcheckout.jsx";
import CheckoutPage from "./Pages/Checkout/Checkout.jsx";

import ProtectedRoute from "./Components/Protected/ProtectedRoute.jsx"

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cart routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cartcheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
