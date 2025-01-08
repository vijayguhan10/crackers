import React from "react";
import { useLocation } from "react-router-dom";
import InitialRouter from "./Router/InitialRouter";
import Sidebar from "./components/Sidebar";

const App = () => {
  const location = useLocation(); 
  const isHomePage = location.pathname === "/"; 

  return (
    <div className="font-Comfortaa w-full flex">
      {!isHomePage && <Sidebar />}{" "}
      <div className={isHomePage ? "w-full" : "flex-1"}>
        <InitialRouter />
      </div>
    </div>
  );
};

export default App;
