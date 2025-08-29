import { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/http/authService";

function ForgotPassword() {
    const [email, setEmail] = useState();

    const sendButtonOnclick = async () => {
        try {
            const res = await forgotPassword(email);

            if (!res.success) {
                return toast.error(res.error.message);
            }

            toast.success(res.data.message);
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
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                />
                <button
                    className="h-12 w-full bg-primary hover:bg-primary-hover rounded-xl text-center text-text-button flex justify-center items-center"
                    onClick={sendButtonOnclick}
                >
                    Send Password Reset Email
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
