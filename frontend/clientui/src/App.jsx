import { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Title from "./components/Title";

function App() {
  const [count, setCount] = useState(0);

  const [notes, setNotes] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // { monthIndex, day, year }

  const [viewMode, setViewMode] = useState("main");

  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [oldTitle, setOldTitle] = useState("");

  const [teacherId, setTeacherId] = useState(null);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const year = 2024;

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getDateKey = (year, monthIndex, day) => {
    return `${year}-${monthIndex}-${day}`;
  };

  const handleDayClick = (monthIndex, day) => {
    if (!day) return;
    const date = { monthIndex, day, year };
    setSelectedDate(date);
    setViewMode("main");
    setModalOpen(true);

    if (teacherId) {
      const dateKeyForBackend =
        String(date.year) +
        String(date.monthIndex + 1).padStart(2, "0") +
        String(date.day).padStart(2, "0");

      const queryParams = new URLSearchParams({
        teacher_id: teacherId,
        datekey: dateKeyForBackend,
      }).toString();

      fetch(`http://127.0.0.1:8000/lesson-plans/get?${queryParams}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Get lesson plans response:", data);
          if (data.code === 1 && data.status === "success" && data.lesson_plans) {
            const fetchedNotes = data.lesson_plans.map((lp) => ({
              id: Date.now() + Math.random(),
              title: lp.topic || "<no title>",
              text: lp.plan || "",
            }));
            const dateKey = getDateKey(date.year, date.monthIndex, date.day);
            setNotes((prev) => ({
              ...prev,
              [dateKey]: fetchedNotes,
            }));
          } else {
            const dateKey = getDateKey(date.year, date.monthIndex, date.day);
            setNotes((prev) => ({
              ...prev,
              [dateKey]: [],
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const startAddNote = () => {
    setTitleText("");
    setNoteText("");
    setViewMode("add");
  };

  const saveNewNote = () => {
    if (!selectedDate) return;
    const dateKey = getDateKey(
      selectedDate.year,
      selectedDate.monthIndex,
      selectedDate.day
    );
    const newNote = { id: Date.now(), title: titleText, text: noteText };
    setNotes((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newNote],
    }));
    setViewMode("main");

    if (teacherId) {
      const dateKeyForBackend =
        String(selectedDate.year) +
        String(selectedDate.monthIndex + 1).padStart(2, "0") +
        String(selectedDate.day).padStart(2, "0");

      const createObj = {
        datekey: dateKeyForBackend,
        teachers_id: teacherId,
        topic: titleText,
        grade: null,
        plan: noteText,
      };

      fetch("http://127.0.0.1:8000/lesson-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createObj),
      })
        .then((res) => res.json())
        .then((data) => console.log("Create response:", data))
        .catch((err) => console.error(err));
    }
  };

  const startEditNote = (index) => {
    if (!selectedDate) return;
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
    setOldTitle(note.title);
    setViewMode("edit");
  };

  const clearNoteText = () => {
    setNoteText("");
  };

  const saveEditedNote = () => {
    if (currentNoteIndex === null || !selectedDate) return;
    const dateKey = getDateKey(
      selectedDate.year,
      selectedDate.monthIndex,
      selectedDate.day
    );
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

    if (teacherId) {
      const dateKeyForBackend =
        String(selectedDate.year) +
        String(selectedDate.monthIndex + 1).padStart(2, "0") +
        String(selectedDate.day).padStart(2, "0");

      const updateObj = {
        teacher_id: teacherId,
        datekey: dateKeyForBackend,
        old_topic: oldTitle,
        new_topic: titleText,
        new_plan: noteText,
      };

      console.log("Update Object:", updateObj);
      fetch("http://127.0.0.1:8000/lesson-plans/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateObj),
      })
        .then((res) => res.json())
        .then((data) => console.log("Update response:", data))
        .catch((err) => console.error(err));
    }
  };

  const deleteNote = (index) => {
    if (!selectedDate) return;
    const dateKey = getDateKey(
      selectedDate.year,
      selectedDate.monthIndex,
      selectedDate.day
    );
    const currentNotes = notes[dateKey] || [];
    const noteToDelete = currentNotes[index];

    setNotes((prev) => {
      const newNotes = [...(prev[dateKey] || [])];
      newNotes.splice(index, 1);
      return { ...prev, [dateKey]: newNotes };
    });

    if (teacherId) {
      const dateKeyForBackend =
        String(selectedDate.year) +
        String(selectedDate.monthIndex + 1).padStart(2, "0") +
        String(selectedDate.day).padStart(2, "0");

      const deleteObj = {
        teacher_id: teacherId,
        datekey: dateKeyForBackend,
        topic: noteToDelete.title,
      };

      console.log("Delete Object:", deleteObj);
      const queryParams = new URLSearchParams(deleteObj).toString();

      fetch(`http://127.0.0.1:8000/lesson-plans/delete?${queryParams}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => console.log("Delete response:", data))
        .catch((err) => console.error(err));
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setViewMode("main");
    setCurrentNoteIndex(null);
    setNoteText("");
    setTitleText("");
  };

  const handleLogin = () => {
    const loginObj = {
      email: loginEmail,
      password: loginPassword,
    };
    console.log("Login Object:", loginObj);
    fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login response:", data);
        if (data.code === 1 && data.status === "success" && data.user_id) {
          setTeacherId(data.user_id);
        }
        setLoginModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const handleSignup = () => {
    const signupObj = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      username: signupUsername,
    };
    console.log("Signup Object:", signupObj);
    fetch("http://127.0.0.1:8000/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Signup response:", data);
        if (data.code === 1 && data.status === "success" && data.user_id) {
          setTeacherId(data.user_id);
        }
        setSignupModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    // Clear teacherId and notes on logout
    setTeacherId(null);
    setNotes({});
  };

  const currentNotes = selectedDate
    ? notes[
        getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day)
      ] || []
    : [];

  return (
    <>
      <Nav
        onLoginClick={() => setLoginModalOpen(true)}
        onSignupClick={() => setSignupModalOpen(true)}
        teacherId={teacherId}
        onLogoutClick={handleLogout}
      />
      <div className="flex border-4 flex-col min-h-screen items-center justify-center gap-10 bg-orange-100">
        <h1 className="text-2xl font-bold">{year}</h1>
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

      {/* Notes Modal */}
      {modalOpen && selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
                  <div className="flex justify-start items-center">
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

      {loginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setLoginModalOpen(false)}
          ></div>
          <div className="bg-white border-4 rounded-lg pt-6 pb-4 px-4 text-center shadow-lg z-10 md:w-1/3 flex flex-col">
            <h2 className="text-xl text-orange-600 font-semibold mb-4">Login</h2>
            <div className="overflow-auto flex flex-col items-center px-2">
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between px-2 space-x-2">
              <button
                className="border transition-transform hover:scale-105 border-gray-300 mt-4 px-4 py-2 rounded-xl hover:bg-gray-100"
                onClick={() => setLoginModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-400 mt-4 font-bold transition-transform rounded-xl hover:scale-105 hover:border-4 hover:border-green-300 text-white px-10 py-1 rounded-lg hover:bg-green-600"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {signupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSignupModalOpen(false)}
          ></div>
          <div className="bg-white border-4 border-black rounded-xl px-4 pt-6 pb-4 text-center shadow-lg z-10 md:w-1/3 flex flex-col">
            <h2 className="text-xl text-orange-600 hover:underline decoration-2 decoration-cyan-400 font-semibold mb-4">
              Signup
            </h2>
            <div className="flex-grow overflow-auto flex flex-col items-center px-2">
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="text"
                placeholder="Enter name..."
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="text"
                placeholder="Create a username..."
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
              />
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input
                className="border-2 border-orange-300 rounded-lg mb-2 p-2 w-full"
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between px-2 space-x-2">
              <button
                className="border transition-transform hover:scale-105 border-gray-300 mt-4 px-4 py-2 rounded-xl hover:bg-gray-100"
                onClick={() => setSignupModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-400 mt-4 font-bold transition-transform rounded-xl hover:scale-105 hover:border-4 hover:border-green-300 text-white px-10 py-1 rounded-lg hover:bg-green-600"
                onClick={handleSignup}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
