function Register() {
    return (
        <div className="bg-[url('/login_background.jpg')] bg-cover bg-center h-dvh w-full flex justify-center items-center">
            <div className="w-4/5 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:1/3 bg-[#252525dd] rounded-2xl p-10 flex flex-col justify-center items-center ">
                <input
                    className="h-8 sm:h-10 lg:h-12 w-full mb-1 rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none text-sm text-[#fafafa] px-2 bg-[#ffffff33]"
                    placeholder="fullname"
                />
                <input
                    className="h-8 sm:h-10 lg:h-12 w-full mb-1 rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none text-sm text-[#fafafa] px-2 bg-[#ffffff33]"
                    placeholder="username"
                />
                <input
                    className="h-8 sm:h-10 lg:h-12 w-full mb-1 rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none text-sm text-[#fafafa] px-2 bg-[#ffffff33]"
                    placeholder="email"
                    type="email"
                />
                <input
                    className="h-8 sm:h-10 lg:h-12 w-full mb-1 rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none text-sm text-[#fafafa] px-2 bg-[#ffffff33]"
                    placeholder="password"
                    type="password"
                />
                <button className="h-8 sm:h-10 lg:h-12 w-full bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg my-2 text-center text-[#fafafa] flex justify-center items-center">
                    Register
                </button>
                <a className="text-[#007BFFdd] text-xs" href="/register">
                    Do you already have an account?
                </a>
            </div>
        </div>
    );
}

export default Register;
