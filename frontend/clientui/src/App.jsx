import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // Define an array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Year for the calendar
  const year = 2024;

  // A helper function to get the number of days in a given month/year
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // A helper function to get the starting weekday of a month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-700 w-full">
        <div className="text-white font-bold">Calendar</div>
        <div className=" p-4 justify-between flex gap-4  text-white font-bold text-right">
          <button className="px-4 py-1 border rounded-md border-white bg-orange-400">Login</button>
          <button className="px-4 py-1 border rounded-md border-white bg-cyan-500"> Sign Up </button>
        </div>
      </div>
      <div className="flex flex-col min-h-screen items-center justify-center bg-orange-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{year}</h1>
          <p className="text-sm text-gray-600"></p>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {months.map((monthName, monthIndex) => {
            const daysInMonth = getDaysInMonth(monthIndex, year);
            const firstDay = getFirstDayOfMonth(monthIndex, year);

            // Create an array to represent the calendar cells for the month
            // We will pad with empty slots before the first day of the month
            const daysArray = Array(firstDay)
              .fill(null)
              .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

            return (
              <div
                key={monthName}
                className="bg-white border border-gray-300 rounded-md p-3 shadow-sm w-56"
              >
                <div className="text-center bg-green- font-bold mb-2">
                  {monthName}
                </div>
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 text-xs font-semibold bg text-orange-600 mb-2">
                  <div className="text-center">S</div>
                  <div className="text-center">M</div>
                  <div className="text-center">T</div>
                  <div className="text-center">W</div>
                  <div className="text-center">T</div>
                  <div className="text-center">F</div>
                  <div className="text-center">S</div>
                </div>
                {/* Month Days */}
                <div className="grid grid-cols-7 text-sm gap-1">
                  {daysArray.map((day, index) => (
                    <div
                      key={index}
                      className={`h-6 flex items-center justify-center ${
                        day ? "text-gray-800" : "text-transparent"
                      }`}
                    >
                      {day || "-"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
            onClick={() => setCount(count + 1)}
          >
            count is {count}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
