import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login.tsx";
import Register from "./pages/authentication/Register.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";
import ResetPassword from "./pages/authentication/ResetPassword.tsx";
import { ToastContainer } from "react-toastify";

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
