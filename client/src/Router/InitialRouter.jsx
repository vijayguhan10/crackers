import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Dashboard from "../Dashboard/index";
import Billing from "../cart/Productdata";
import CustomerHistory from "../History/CustomerHistory";
import StockTable from "../stocks/StockTable";
import CustomerData from "../customer/index";
import GiftIndex from "../Gift/GiftIndex";
import UserSettings from "../Settings/UserIndex";
import Signup from "../components/Signup";

const InitialRouter = () => {
  const [Name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("cracker_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          const userName = decoded.name;
          setName(userName);
          console.log("user name : ", userName);
          console.log("Welcome:", userName);

          // Navigate to dashboard only if on root path
          if (location.pathname === "/") {
            navigate("/dashboard");
          }
        } else {
          localStorage.removeItem("cracker_token");
        }
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("cracker_token");
      }
    }
    setIsLoading(false);
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!isLoading) {
      const token = localStorage.getItem("cracker_token");
      if (!token) {
        navigate("/");
      }
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard userName={Name} />} />
      <Route path="/History" element={<CustomerHistory />} />
      <Route path="/billing/:id/:name" element={<Billing />} />
      <Route path="/stocks" element={<StockTable />} />
      <Route path="/customer" element={<CustomerData />} />
      <Route path="/settings" element={<UserSettings />} />
      <Route path="/gift" element={<GiftIndex />} />
    </Routes>
  );
};

export default InitialRouter;
