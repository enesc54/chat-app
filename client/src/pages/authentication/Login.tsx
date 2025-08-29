import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/http/authService";

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const loginButtonOnclick = async () => {
        try {
            const res = await login(email, password);

            if (!res.success) {
                return toast.error(res.error.message);
            }

            localStorage.setItem("token", res.data.token);
            toast.success("Login successful!");
            navigate("/chats");
        } catch (error) {
            return toast.error(error.message);
        }
    };
    return (
        <div className="bg-main bg-cover bg-center h-dvh w-full flex justify-center items-center">
            <div className="card auth-card gap-2">
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        email
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="email"
                    onChange={e => {
                        setEmail(e.target.value);
                    }}
                    type="email"
                />
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        password
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="password"
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                    type="password"
                />
                <a
                    className="self-start text-primary hover:text-primary-hover text-sm italic"
                    href="/forgot-password"
                >
                    Forgot your password?
                </a>
                <button
                    onClick={loginButtonOnclick}
                    className="h-12 w-full bg-primary hover:bg-primary-hover rounded-xl text-center text-text-button flex justify-center items-center"
                >
                    Login
                </button>
                <a
                    className="text-primary hover:text-primary-hover text-sm"
                    href="/register"
                >
                    Don't you have an account?
                </a>
            </div>
        </div>
    );
}

export default Login;
