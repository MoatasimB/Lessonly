import { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Title from "./components/Title";
import { FaBoltLightning } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { HiXCircle } from "react-icons/hi2";

function App() {
  const [notes, setNotes] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // { monthIndex, day, year }
  const [viewMode, setViewMode] = useState("main");
  const [displayedYear, setDisplayedYear] = useState(2024);
  const [loginError, setLoginError] = useState("");

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

  const [signupErrors, setSignupErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for AI panel
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [aiGrade, setAIGrade] = useState("");

  const [aiLessonPlan, setAiLessonPlan] = useState(null);
  const formatLessonPlan = (plan) => {
    const {
      grade_level,
      subject,
      topic,
      lesson_objective,
      materials,
      lesson_duration,
      lesson_steps,
      assessment,
    } = plan;

    const materialsList =
      Array.isArray(materials) && materials.length > 0
        ? materials.map((m) => `- ${m}`).join("\n")
        : "None";

    const durationText = `\n\nDuration: ${lesson_duration || "N/A"}\n\n`;

    const formatKnownStep = (value, displayName) => {
      if (value === undefined) return "";
      let result = `${displayName}:\n`;

      if (typeof value === "string") {
        // Single string
        result += `- ${value}\n\n`;
        return result;
      }

      if (Array.isArray(value)) {
        // Array
        value.forEach((item) => {
          result += `- ${item}\n`;
        });
        result += `\n`;
        return result;
      }

      if (typeof value === "object" && value !== null) {
        if (value.description) {
          result += `Description: ${value.description}\n`;
        }
        if (Array.isArray(value.activities) && value.activities.length > 0) {
          result += `Activities:\n`;
          value.activities.forEach((act) => {
            result += `- ${act}\n`;
          });
        }
        result += `\n`;
        return result;
      }

      return "";
    };

    // Extract known steps in order:
    const introductionText = lesson_steps
      ? formatKnownStep(lesson_steps.introduction, "Introduction")
      : "";
    const guidedPracticeText = lesson_steps
      ? formatKnownStep(lesson_steps.guided_practice, "Guided Practice")
      : "";
    const independentPracticeText = lesson_steps
      ? formatKnownStep(
          lesson_steps.independent_practice,
          "Independent Practice"
        )
      : "";
    const closureText = lesson_steps
      ? formatKnownStep(lesson_steps.closure, "Closure")
      : "";

    // Response might have 'formative', 'summative', 'description', 'methods'

    const formatAssessment = (assess) => {
      if (!assess || typeof assess !== "object") return "";

      let text = "Assessment:\n";

      // If 'description' key:
      if (assess.description) {
        text += `Description: ${assess.description}\n`;
      }

      // If 'methods' array:
      if (Array.isArray(assess.methods) && assess.methods.length > 0) {
        text += `Methods:\n`;
        assess.methods.forEach((m) => {
          text += `- ${m}\n`;
        });
      }

      // If 'formative' or 'summative' keys:
      if (assess.formative) {
        text += `Formative: ${assess.formative}\n`;
      }
      if (assess.summative) {
        text += `Summative: ${assess.summative}\n`;
      }

      text += `\n`;
      return text;
    };

    const assessmentText = formatAssessment(assessment);

    return `Topic: ${topic || "N/A"}
  Grade Level: ${grade_level || "N/A"}
  Subject: ${subject || "N/A"}
  Objective: ${lesson_objective || "N/A"}
  
  Materials:
  ${materialsList}${durationText}${introductionText}${guidedPracticeText}${independentPracticeText}${closureText}${assessmentText}`;
  };

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
    const date = { monthIndex, day, year: displayedYear };
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
          console.log("Get lesson plans response:");
          if (
            data.code === 1 &&
            data.status === "success" &&
            data.lesson_plans
          ) {
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
    setShowAIPanel(false); // Reset AI panel state
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
      // console.log("Create Object:", createObj);

      fetch("http://127.0.0.1:8000/lesson-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createObj),
      })
        .then((res) => res.json())
        .then((data) => console.log("Create response:"))
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
    setShowAIPanel(false);
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

      // console.log("Update Object:", updateObj);
      fetch("http://127.0.0.1:8000/lesson-plans/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateObj),
      })
        .then((res) => res.json())
        .then((data) => console.log("Update response:"))
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

      // console.log("Delete Object:", deleteObj);
      const queryParams = new URLSearchParams(deleteObj).toString();

      fetch(`http://127.0.0.1:8000/lesson-plans/delete?${queryParams}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => console.log("Delete response:"))
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
    setShowAIPanel(false); 
    setAiLessonPlan(null); 
  };

  const handleLogin = () => {
    const loginObj = {
      email: loginEmail,
      password: loginPassword,
    };
    setLoginError("");
    // console.log("Login Object:");
    fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login response:");
        if (data.code === (0)  && data.message === "Wrong password or email") {
          setLoginError("Wrong password or email");
          return;
        }
        if (data.code === 422) {
          setLoginError("Incorrect email format or password is less than 6 characters");
          return;
        }

        if (data.code === 1 && data.status === "success" && data.user_id) {
          setTeacherId(data.user_id);
        }
        setLoginModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const handleSignup = () => {
    let hasError = false;
    const newErrors = { name: "", username: "", email: "", password: "" };

    // Name check
    if (!signupName.trim()) {
      newErrors.name = "Name cannot be empty";
      hasError = true;
    }

    // Username check
    if (!signupUsername.trim()) {
      newErrors.username = "Username cannot be empty";
      hasError = true;
    }

    // Email checks
    if (!signupEmail.trim()) {
      newErrors.email = "Email cannot be empty";
      hasError = true;
    } else if (!signupEmail.includes("@")) {
      newErrors.email = "Email is not valid";
      hasError = true;
    }

    // Password checks
    if (!signupPassword) {
      newErrors.password = "Password cannot be empty";
      hasError = true;
    } else if (signupPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    setSignupErrors(newErrors);

    if (hasError) return;

    const signupObj = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      username: signupUsername,
    };

    fetch("http://127.0.0.1:8000/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Signup response:");

        if (data.code === 0 && data.message === "User already exists") {
          // Show "user already exists" error
          setSignupErrors({
            ...newErrors,
            password: "User already exists",
          });
          return;
        }

        if (data.code === 1 && data.status === "success" && data.user_id) {
          setTeacherId(data.user_id);
          setSignupModalOpen(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    setTeacherId(null);
    setNotes({});
  };

  const handleGenerateAI = () => {
    const aiObj = {
      query: aiQuery,
      grade: aiGrade,
    };
    // console.log("AI Object:");
    fetch("http://127.0.0.1:8000/lesson-plans/generate/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("AI Generate response:");
        if (data.code === 1 && data.status === "success" && data.lesson_plan) {
          setAiLessonPlan(data);
        } else {
          setAiLessonPlan(null);
        }
      })
      .catch((err) => console.error(err));
  };

  const currentNotes = selectedDate
    ? notes[
        getDateKey(selectedDate.year, selectedDate.monthIndex, selectedDate.day)
      ] || []
    : [];

  const modalWidthClass = showAIPanel ? "md:w-2/3" : "md:w-1/3";

  return (
    <>
      <Nav
        onLoginClick={() => setLoginModalOpen(true)}
        onSignupClick={() => setSignupModalOpen(true)}
        teacherId={teacherId}
        onLogoutClick={handleLogout}
      />
      <div
        className="flex flex-col min-h-screen items-center justify-center gap-10 bg-orange-100"
        style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
      >
        <div className="text-center mt-2  px-4 rounded-xl flex items-center justify-center gap-4">
          <button
            className="text-gray-600 hover:text-black"
            onClick={() => setDisplayedYear(2024)}
          >
            <FaArrowAltCircleLeft
              color="orange"
              className="transition-transform hover:scale-110"
              size={24}
            />
          </button>

          <h1 className="text-2xl font-bold">{displayedYear}</h1>

          {/* 3. Right Arrow toggles to 2025 */}
          <button
            className="text-gray-600 hover:text-black"
            onClick={() => setDisplayedYear(2025)}
          >
            <FaArrowAltCircleRight
              color="orange"
              className="transition-transform hover:scale-110"
              size={24}
            />
          </button>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-2 px-1 mb-8 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {months.map((monthName, monthIndex) => {
            const daysInMonth = getDaysInMonth(monthIndex, displayedYear);
            const firstDay = getFirstDayOfMonth(monthIndex, displayedYear);

            const daysArray = Array(firstDay)
              .fill(null)
              .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

            return (
              <div
                key={monthName}
                className="bg-white hover:scale-105 w-60 h-60 transition-transform transform hover:border-4 hover:border-orange-600 rounded-md p-3 shadow-sm"
              >
                <div className="text-center font-bold mb-2">{monthName}</div>
                <div className="grid grid-cols-7 text-xs font-semibold text-orange-600 mb-2">
                  <div className="text-center">S</div>
                  <div className="text-center">M</div>
                  <div className="text-center">T</div>
                  <div className="text-center">W</div>
                  <div className="text-center">T</div>
                  <div className="text-center">F</div>
                  <div className="text-center">S</div>
                </div>
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

      {modalOpen && selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
        style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}>
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div
            className={`bg-white border-4 rounded-lg pt-6 pb-4 text-center shadow-lg z-10 ${modalWidthClass} h-2/3 md:h-3/4 flex flex-col transition-all duration-300`}
          >
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
                    <div className="flex flex-col space-y-2 h-full px-10 py-4 mb-4">
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
                            className="text-white rounded-full hover:scale-125 transition-transform flex-shrink-0"
                            onClick={() => deleteNote(i)}
                          >
                            <HiXCircle color="red" size={36} />
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
                    className="bg-cyan-400 flex w-36 justify-center items-center gap-4 font-semibold hover:scale-105 transition-transform text-white px-4 py-2 rounded-xl hover:bg-orange-300"
                    onClick={startAddNote}
                  >
                    Add Note <FaPlus />
                  </button>
                </div>
              </>
            )}

            {viewMode === "add" && (
              <>
                <div
                  className={`flex-grow flex ${
                    showAIPanel ? "flex-row" : "flex-col"
                  } transition-all duration-300`}
                >
                  {/* Left card (Add note card) */}
                  <div
                    className={`flex flex-col h-full px-4 ${
                      showAIPanel
                        ? "w-1/2 border-r-2 border-gray-300"
                        : "w-full"
                    }`}
                  >
                    <Title titleText={titleText} setTitleText={setTitleText} />
                    <textarea
                      className={`w-full h-5/6 border-4 border-orange-200 rounded-lg p-2`}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add notes to your lesson plan..."
                    />
                    <div className="flex justify-end items-center mt-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-800  hover:scale-105 transition-transform rounded-xl flex items-center px-4 py-1 font-bold text-white"
                        onClick={() => setShowAIPanel(true)}
                      >
                        <span>Use AI</span>
                        <FaArrowAltCircleRight className="ml-4" size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Right card (AI card) appears if showAIPanel is true */}
                  {showAIPanel && (
                    <div className="w-1/2 px-4 overflow-auto flex flex-col gap-3">
                      <div className="flex justify-center items-center">
                        <div className="w-full lg:w-2/3 px-2 md:py-2 flex gap-3 justify-center items-center rounded-xl border border-red-400 bg-black text-md font-bold text-white">
                          <FaBoltLightning className="text-red-400" />
                          <div>AI Lesson Plan Generator</div>
                          <FaBoltLightning className="text-red-400" />
                        </div>
                      </div>
                      <textarea
                        className={`border-2 text-top ${
                          aiLessonPlan ? "h-10" : "h-5/6"
                        } border-purple-400 rounded-xl p-2 w-full`}
                        placeholder="What do you want to teach?..."
                        value={aiQuery}
                        onChange={(e) => setAIQuery(e.target.value)}
                      />
                      {aiLessonPlan && (
                        <textarea
                          className="border-2 text-top h-5/6 border-purple-400 rounded-xl p-2 w-full mt-2"
                          readOnly
                          value={formatLessonPlan(aiLessonPlan.lesson_plan)}
                        />
                      )}
                      <div className="flex w-full justify-between">
                        <select
                          className="border-2 w-1/3 border-red-300 rounded-lg p-2"
                          value={aiGrade}
                          onChange={(e) => setAIGrade(e.target.value)}
                        >
                          <option value="">Choose Grade</option>
                          <option value="1st grade">1st grade</option>
                          <option value="2nd grade">2nd grade</option>
                          <option value="3rd grade">3rd grade</option>
                          <option value="4th grade">4th grade</option>
                          <option value="5th grade">5th grade</option>
                          <option value="6th grade">6th grade</option>
                          <option value="MS">MS (Middle School)</option>
                          <option value="HS">HS (High School)</option>
                        </select>
                        <button
                          className="bg-violet-600 text-white rounded-xl px-4 py-1 font-bold hover:bg-green-600 transition-transform hover:scale-105"
                          onClick={handleGenerateAI}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`flex px-2 space-x-2 mt-4 ${
                    showAIPanel ? "justify-start" : "justify-between"
                  }`}
                >
                  <button
                    className="border transition-transform hover:scale-105 border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100"
                    onClick={() => {
                      setViewMode("main");
                      setShowAIPanel(false);
                      setAiLessonPlan(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-cyan-400 font-bold flex justify-center items-center gap-3 transition-transform rounded-xl hover:scale-105 text-white px-6 hover:bg-green-600"
                    onClick={saveNewNote}
                  >
                    <span className="text-lg">Save</span>
                    <FaCheckCircle size={24} />
                  </button>
                </div>
              </>
            )}

            {viewMode === "edit" && (
              <>
                <div
                  className={`flex-grow flex ${
                    showAIPanel ? "flex-row" : "flex-col"
                  } transition-all duration-300`}
                >
                  {/* Left card (Edit note card) */}
                  <div
                    className={`flex flex-col h-full px-4 ${
                      showAIPanel
                        ? "w-1/2 border-r-2 border-gray-300"
                        : "w-full"
                    }`}
                  >
                    <Title titleText={titleText} setTitleText={setTitleText} />
                    <textarea
                      className={`w-full h-5/6 border-4 border-orange-200 rounded-lg p-2`}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Edit your lesson plan notes..."
                    />
                    <div className="flex justify-end items-center mt-2 gap-2">
                      <button
                        className="bg-yellow-600 text-white transition-transform w-32 hover:scale-105 font-semibold rounded-lg py-1 hover:bg-yellow-600"
                        onClick={clearNoteText}
                      >
                        Clear
                      </button>
                      <button
                        className="bg-purple-600 hover:bg-purple-800  hover:scale-105 transition-transform rounded-xl flex items-center px-4 py-1 font-bold text-white"
                        onClick={() => setShowAIPanel(true)}
                      >
                        <span>Use AI</span>
                        <FaArrowAltCircleRight className="ml-4" size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Right card (AI card) appears if showAIPanel is true */}
                  {showAIPanel && (
                    <div className="w-1/2 px-4 overflow-auto flex flex-col gap-3">
                      <div className="flex justify-center items-center">
                        <div className="w-full lg:w-2/3 px-2 flex gap-3 justify-center items-center rounded-xl border border-red-400 bg-black text-md font-bold text-white">
                          <FaBoltLightning className="text-red-400" />
                          <div>AI Lesson Plan Generator</div>
                          <FaBoltLightning className="text-red-400" />
                        </div>
                      </div>

                      <textarea
                        className={`border-2 text-top ${
                          aiLessonPlan ? "h-10" : "h-5/6"
                        } border-purple-400 rounded-xl p-2 w-full`}
                        placeholder="What do you want to teach?..."
                        value={aiQuery}
                        onChange={(e) => setAIQuery(e.target.value)}
                      />
                      {aiLessonPlan && (
                        <textarea
                          className="border-2 text-top h-5/6 border-purple-400 rounded-xl p-2 w-full mt-2"
                          readOnly
                          value={formatLessonPlan(aiLessonPlan.lesson_plan)}
                        />
                      )}
                      <div className="flex justify-between">
                        <select
                          className="border-2 w-32 border-red-300 rounded-lg p-2"
                          value={aiGrade}
                          onChange={(e) => setAIGrade(e.target.value)}
                        >
                          <option value="">Choose Grade</option>
                          <option value="1st grade">1st grade</option>
                          <option value="2nd grade">2nd grade</option>
                          <option value="3rd grade">3rd grade</option>
                          <option value="4th grade">4th grade</option>
                          <option value="5th grade">5th grade</option>
                          <option value="6th grade">6th grade</option>
                          <option value="MS">MS (Middle School)</option>
                          <option value="HS">HS (High School)</option>
                        </select>
                        <button
                          className="bg-violet-600 text-white rounded-xl px-4 py-1 font-bold hover:bg-green-600 transition-transform hover:scale-105"
                          onClick={handleGenerateAI}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`flex px-2 space-x-2 mt-4 ${
                    showAIPanel ? "justify-start" : "justify-between"
                  }`}
                >
                  <button
                    className="border self-start transition-transform hover:scale-105 border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100"
                    onClick={() => {
                      setViewMode("main");
                      setCurrentNoteIndex(null);
                      setShowAIPanel(false);
                      setAiLessonPlan(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-cyan-400 ml-auto  font-bold transition-transform rounded-xl hover:scale-105 hover:border-4 hover:border-green-300 text-white px-10 py-1 hover:bg-green-600"
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
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
        >
          <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:max-w-lg">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setLoginModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-orange-600">
              Login
            </h2>

            <div className="flex flex-col space-y-4">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {loginError && (
                <p className="text-red-600 text-sm mt-2">{loginError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-5 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setLoginModalOpen(false);
                  setLoginError("");
                  setLoginEmail("");
                  setLoginPassword("")
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 hover:shadow-md transition-transform transform hover:scale-105"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {signupModalOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
        >
          {/* Modal Container */}
          <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:max-w-lg">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSignupModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-cyan-600">
              Sign Up
            </h2>

            <div className="flex flex-col space-y-4">
              <div>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  type="text"
                  placeholder="Name..."
                  value={signupName}
                  onChange={(e) => {
                    setSignupName(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, name: "" }));
                  }}
                />
                {signupErrors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {signupErrors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  type="text"
                  placeholder="Username..."
                  value={signupUsername}
                  onChange={(e) => {
                    setSignupUsername(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, username: "" }));
                  }}
                />
                {signupErrors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    {signupErrors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  type="email"
                  placeholder="Email..."
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {signupErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {signupErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  type="password"
                  placeholder="Password..."
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                {signupErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {signupErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-5 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setSignupModalOpen(false)
                  setSignupErrors({ name: "", username: "", email: "", password: "" });
                  setSignupName("");
                  setSignupUsername("");
                  setSignupEmail("");
                  setSignupPassword("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-cyan-400 text-white rounded-lg font-semibold hover:bg-cyan-600 hover:shadow-md transition-transform transform hover:scale-105"
                onClick={handleSignup}
              >
                Sign Up!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
