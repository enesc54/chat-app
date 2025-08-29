import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/http/authService";

function Register() {
    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const registerButtonOnclick = async () => {
        try {
            const res = await register({
                fullname: fullname,
                username,
                email,
                password
            });

            if (!res.success) {
                return toast.error(res.error.message);
            }

            localStorage.setItem("token", res.data.token);
            toast.success("Registration successful");
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
                        fullname
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="fullname"
                    onChange={e => setFullname(e.target.value)}
                />
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        username
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        email
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="email"
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        password
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="password"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="h-12 w-full bg-primary hover:bg-primary-hover rounded-xl text-center text-text-button flex justify-center items-center"
                    onClick={registerButtonOnclick}
                >
                    Register
                </button>
                <a
                    className="text-primary hover:text-primary-hover text-sm"
                    href="/register"
                >
                    Do you already have an account?
                </a>
            </div>
        </div>
    );
}

export default Register;
