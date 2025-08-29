import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/http/authService";

function ResetPassword() {
    const { resetToken } = useParams();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const navigate = useNavigate();

    const resetButtonOnclick = async () => {
        try {
            if (password === confirmPassword) {
                const res = await resetPassword(resetToken, password);

                if (!res.success) {
                    return toast.error(res.error.message);
                }

                localStorage.setItem("token", res.data.token);
                toast.success("Password reset successful");
                navigate("/chats");
            } else {
                return toast.error("The passwords entered do not match.");
            }
        } catch (error) {
            return toast.error(error.message);
        }
    };
    return (
        <div className="bg-main bg-cover bg-center h-dvh w-full flex justify-center items-center">
            <div className="card auth-card gap-2">
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
                <input
                    className={`h-12 w-full rounded-xl border text-md px-4 text-[var(--main-text-color)] bg-[var(--bg-color-opacity)] placeholder-[var(--placeholder-color)] focus:border-primary focus:outline-none ${
                        confirmPassword
                            ? "border-primary"
                            : "border-[var(--border-color)]"
                    }`}
                    placeholder="confirm password"
                    type="password"
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                    className="h-12 w-full bg-primary hover:bg-primary-hover rounded-xl text-center text-text-button flex justify-center items-center"
                    onClick={resetButtonOnclick}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;
