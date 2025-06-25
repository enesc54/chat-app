import { useState } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState();

    const sendButtonOnclick = async () => {
        try {
            const res = await fetch(
                "http://localhost:3000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }
            );
            const data = await res.json();
            alert(data.message);
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className="bg-[url('/login_background.jpg')] bg-cover bg-center h-dvh w-full flex justify-center items-center">
            <div className="w-4/5 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:1/3 bg-[#252525dd] rounded-2xl p-10 flex flex-col justify-center items-center ">
                <input
                    className="h-8 sm:h-10 lg:h-12 w-full mb-1 rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none text-sm text-[#fafafa] px-2 bg-[#ffffff33]"
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                />
                <button
                    className="h-8 sm:h-10 lg:h-12 w-full bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg my-2 text-center text-[#fafafa] flex justify-center items-center"
                    onClick={sendButtonOnclick}
                >
                    Send Password Reset Email
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
