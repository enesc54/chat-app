import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/authentication/Login.tsx";
import Register from "./pages/authentication/Register.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";
import ResetPassword from "./pages/authentication/ResetPassword.tsx";

import Chats from "./pages/chats";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<>aaa</>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:resetToken"
                        element={<ResetPassword />}
                    />
                    <Route path="/chats" element={<Chats />} />
                </Routes>
            </Router>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
            />
        </>
    );
}

export default App;
