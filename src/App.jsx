import { Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardPages from "./PAGES/DashboardPages";
import ChaptersPages from "./PAGES/ChaptersPages";
import PrintPages from "./PAGES/PrintPages";
import NewProjectPages from "./PAGES/NewProjectPages";
import { useEffect } from "react";
import { useState } from "react";
import Login from "./PAGES/Login";
import SignUp from "./PAGES/SignUp";
import ForgotPages from "./PAGES/ForgotPages";

function App() {
  const [newBooks, setNewBooks] = useState();
  return (
    <>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/forgot-password" Component={ForgotPages} />
        <Route path="/" Component={DashboardPages} />
        <Route path="/project/:booksId/:booksHeading/new" Component={NewProjectPages} />
        <Route path="/project/:booksId/:booksHeading/:chapterId" Component={ChaptersPages} />
        <Route path="/print" Component={PrintPages} />
      </Routes>
    </>
  );
}

export default App;
