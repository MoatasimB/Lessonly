import { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Title from "./components/Title";

function App() {
  const [count, setCount] = useState(0);

  // State for notes. Use an object keyed by `year-monthIndex-day`,
  // each value is an array of note objects: { id: number, title: string, text: string }
  const [notes, setNotes] = useState({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // { monthIndex, day, year }

  // Modal views: 'main', 'add', 'edit'
  const [viewMode, setViewMode] = useState("main");

  // For adding/editing notes
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [titleText, setTitleText] = useState("");

  // Add state to store the old title when editing
  const [oldTitle, setOldTitle] = useState("");

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

  const year = 2024;

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = (monthIndex, day) => {
    if (!day) return;
    const dateKey = getDateKey(year, monthIndex, day);
    setSelectedDate({ monthIndex, day, year });
    // Open modal in "main" view showing the list of notes
    setViewMode("main");
    setModalOpen(true);
  };

  const getDateKey = (year, monthIndex, day) => {
    return `${year}-${monthIndex}-${day}`;
  };

  // Add note handlers
  const startAddNote = () => {
    setTitleText("");
    setNoteText("");
    setViewMode("add");
  };

  const saveNewNote = () => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day);
    const newNote = { id: Date.now(), title: titleText, text: noteText };
    setNotes((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newNote],
    }));
    setViewMode("main");
  
    const dateKeyForBackend =
      String(selectedDate.year) +
      String(selectedDate.monthIndex + 1).padStart(2, "0") +
      String(selectedDate.day).padStart(2, "0");
  
    const createObj = {
      datekey: dateKeyForBackend,
      teachers_id: 1,
      topic: titleText,
      grade: null,
      plan: noteText,
    };
  
    console.log("Create Object:", createObj);
    // fetch("http://127.0.0.1:8000/lesson-plans/create", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(createObj)
    // })
    // .then(res => res.json())
    // .then(data => console.log("Create response:", data))
    // .catch(err => console.error(err));
  };

  // Edit note handlers
  const startEditNote = (index) => {
    const dateKey = getDateKey(
      selectedDate.year,
      selectedDate.monthIndex,
      selectedDate.day
    );
    const currentNotes = notes[dateKey] || [];
    const note = currentNotes[index];
    setTitleText(note.title || "");
    setNoteText(note.text);
    setCurrentNoteIndex(index);
    setOldTitle(note.title); // Store old title for update endpoint
    setViewMode("edit");
  };
  const clearNoteText = () => {
    setNoteText(""); // Clears the text area by resetting the state
  };
  

  const saveEditedNote = () => {
    if (currentNoteIndex === null || !selectedDate) return;
    const dateKey = getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day);
    setNotes((prev) => {
      const newNotes = [...(prev[dateKey] || [])];
      newNotes[currentNoteIndex] = {
        ...newNotes[currentNoteIndex],
        title: titleText,
        text: noteText,
      };
      return { ...prev, [dateKey]: newNotes };
    });
    setViewMode("main");
    setCurrentNoteIndex(null);
  
    const dateKeyForBackend =
      String(selectedDate.year) +
      String(selectedDate.monthIndex + 1).padStart(2, "0") +
      String(selectedDate.day).padStart(2, "0");
  
    const updateObj = {
      teacher_id: 1,
      datekey: dateKeyForBackend,
      prev_topic: oldTitle,
      new_topic: titleText,
      new_plan: noteText,
    };
  
    console.log("Update Object:", updateObj);
    // fetch("http://127.0.0.1:8000/lesson-plans/update", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updateObj)
    // })
    // .then(res => res.json())
    // .then(data => console.log("Update response:", data))
    // .catch(err => console.error(err));
  };


  const deleteNote = (index) => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day);
    const currentNotes = notes[dateKey] || [];
    const noteToDelete = currentNotes[index];
  
    setNotes((prev) => {
      const newNotes = [...(prev[dateKey] || [])];
      newNotes.splice(index, 1);
      return { ...prev, [dateKey]: newNotes };
    });
  
    const dateKeyForBackend =
      String(selectedDate.year) +
      String(selectedDate.monthIndex + 1).padStart(2, "0") +
      String(selectedDate.day).padStart(2, "0");
  
    const deleteObj = {
      teacher_id: 1,
      datekey: dateKeyForBackend,
      topic: noteToDelete.title,
    };
  
    console.log("Delete Object:", deleteObj);
    // fetch("http://127.0.0.1:8000/lesson-plans/update", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(deleteObj)
    // })
    // .then(res => res.json())
    // .then(data => console.log("Delete response:", data))
    // .catch(err => console.error(err));
  };
  
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setViewMode("main");
    setCurrentNoteIndex(null);
    setNoteText("");
    setTitleText("");
  };

  const currentNotes = selectedDate
    ? notes[
        getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day)
      ] || []
    : [];

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center bg-orange-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{year}</h1>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 px-1 mb-8 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {months.map((monthName, monthIndex) => {
            const daysInMonth = getDaysInMonth(monthIndex, year);
            const firstDay = getFirstDayOfMonth(monthIndex, year);

            const daysArray = Array(firstDay)
              .fill(null)
              .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

            return (
              <div
                key={monthName}
                className="bg-white hover:scale-105 w-60 h-60 transition-transform transform hover:border-4 hover:border-orange-600 rounded-md p-3 shadow-sm"
              >
                <div className="text-center font-bold mb-2">{monthName}</div>
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 text-xs font-semibold text-orange-600 mb-2">
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
                    <button
                      key={index}
                      onClick={() => handleDayClick(monthIndex, day)}
                      className={`h-6 flex items-center justify-center ${
                        day
                          ? "text-gray-800 hover:border-white hover-border rounded-md hover:bg-cyan-400 hover:text-white"
                          : "text-transparent"
                      }`}
                    >
                      {day || "-"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white border-4 rounded-lg pt-6 pb-4 text-center shadow-lg z-10 md:w-1/3 h-2/3 md:h-3/4 flex flex-col">
            <h2 className="text-xl text-orange-600 font-semibold mb-2">
              Notes for {months[selectedDate.monthIndex]} {selectedDate.day},{" "}
              {selectedDate.year}
            </h2>

            {viewMode === "main" && (
              <>
                <div className="flex-grow overflow-auto">
                  {currentNotes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No notes for this day. Click "Add Note" to add one!
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 h-full p-3 mb-4">
                      {currentNotes.map((n, i) => (
                        <div
                          key={n.id}
                          className="border-black border transition-transform hover:scale-105 p-2 rounded-lg flex justify-between items-center"
                        >
                          <div
                            className="overflow-hidden overflow-ellipsis whitespace-nowrap pr-2 cursor-pointer text-left flex-grow"
                            onClick={() => startEditNote(i)}
                          >
                            {n.title || "<no title>"}
                          </div>
                          <button
                            className="bg-red-400 text-white px-4 py-2 rounded-full hover:scale-125 transition-transform hover:bg-red-600 flex-shrink-0"
                            onClick={() => deleteNote(i)}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex space-x-2 px-2 justify-between">
                  <button
                    className="border transition-transform hover:scale-105 border-gray-300 px-4 py-2 w-32 rounded-xl font-semibold text-white bg-gray-600 hover:bg-black"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-cyan-400 font-semibold w-32 hover:scale-105 transition-transform text-white px-4 py-2 rounded-xl hover:bg-orange-300"
                    onClick={startAddNote}
                  >
                    Add Note
                  </button>
                </div>
              </>
            )}

            {viewMode === "add" && (
              <>
                <div className="flex-grow px-2 overflow-auto">
                  <Title titleText={titleText} setTitleText={setTitleText} />
                  <textarea
                    className="w-full h-5/6 border-4 border-orange-200 rounded-lg p-2"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add notes to your lesson plan..."
                  />
                </div>
                <div className="flex justify-between px-2 space-x-2">
                  <button
                    className="border transition-transform hover:scale-105 border-gray-300 mt-4 px-4 py-2 rounded-xl hover:bg-gray-100"
                    onClick={() => setViewMode("main")}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-cyan-400 mt-4 font-bold transition-transform rounded-xl hover:scale-105 hover:border-4 hover:border-green-300 text-white px-10 py-1 rounded-lg hover:bg-green-600"
                    onClick={saveNewNote}
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {viewMode === "edit" && (
              <>
                <div className="flex-grow px-2 overflow-auto">
                  <Title titleText={titleText} setTitleText={setTitleText} />
                  <textarea
                    className="w-full h-4/5 border-4 border-orange-200 rounded-lg p-2"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <div className="flex  justify-start items-center">
                    <button
                      className="bg-yellow-600 text-white transition-transform w-32 hover:scale-105 font-semibold rounded-lg py-2 hover:bg-yellow-600"
                      onClick={clearNoteText}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="flex mt-3 px-2 justify-between space-x-2">
                  <button
                    className="bg-gray-700 rounded-lg w-32 text-white transition-transform hover:scale-105 px-8 font-semibold py-2 hover:bg-black"
                    onClick={() => {
                      setViewMode("main");
                      setCurrentNoteIndex(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-cyan-400 rounded-lg transition-transform hover:bg-green-600 hover:scale-105 text-white px-8 font-semibold py-2"
                    onClick={saveEditedNote}
                  >
                    Update
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
