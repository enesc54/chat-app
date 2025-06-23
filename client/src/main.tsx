import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import Login from "./pages/authentication/Login.tsx";
import Register from "./pages/authentication/Register.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Login />
    </StrictMode>
);
