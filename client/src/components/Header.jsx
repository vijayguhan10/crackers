import React from "react";

const Header = () => {
  return (
    <div>
      <header className="bg-[#4ADE80] text-white p-4">
        <div className=" flex justify-between items-center">
          <div className="flex items-center gap-2 ml-12 sm:ml-0">
            <span className="text-2xl">🎆</span>
            <h1 className="text-2xl font-bold text-black">AVANTIKA CRACKERS</h1>
          </div>

          <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
        </div>
      </header>
    </div>
  );
};

export default Header;
