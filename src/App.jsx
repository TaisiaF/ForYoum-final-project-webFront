import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Discussion from "./pages/Discussion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import CreateDiscussion from "./pages/CreateDiscussion";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discussion/create" element={<CreateDiscussion />}/>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/verify" element={<Verify />} />
                <Route path="/discussion/:id" element={<Discussion />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/account-settings"element={<ProtectedRoute> <AccountSettings /> </ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;