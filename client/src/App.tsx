import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/authentication/Login.tsx";
import Register from "./pages/authentication/Register.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";
import ResetPassword from "./pages/authentication/ResetPassword.tsx";
import ChatPageLayout from "./layouts/chats";
import { ChatProvider } from "./context/ChatContext";
import Chats from "./pages/chats";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<></>} />
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
                    <Route
                        path="/chats"
                        element={
                            <ChatProvider>
                                <ChatPageLayout />
                            </ChatProvider>
                        }
                    >
                        <Route index element={<Navigate to="/chats/me" />} />
                        <Route path="me" element={<>Me</>} />
                        <Route path=":serverId/:roomId" element={<Chats />} />
                    </Route>
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
