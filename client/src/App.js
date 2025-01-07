import React from "react";
import DashboardIndex from "./Dashboard/index";
import InitialRouter from "./Router/InitialRouter";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="font-Comfortaa w-full flex">
      {/* <Sidebar /> */}
      <div className="flex-1">
        <InitialRouter />
      </div>
    </div>
  );
};

export default App;
