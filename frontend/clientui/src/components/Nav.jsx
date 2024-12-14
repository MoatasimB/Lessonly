import React from "react";

const Nav = () => {
  return (
    <div className="flex justify-between items-center bg-gray-700 w-full">
      <div className="text-white px-10 font-bold">
        <h1>APP NAME HERE</h1>
      </div>
      <div className=" p-4 px-10 justify-between flex gap-4  text-white font-bold text-right">
        <button className="px-4 py-1 border rounded-md border-white bg-orange-400">
          Login
        </button>
        <button className="px-4 py-1 border rounded-md border-white bg-cyan-500">
          {" "}
          Sign Up{" "}
        </button>
      </div>
    </div>
  );
};

export default Nav;
