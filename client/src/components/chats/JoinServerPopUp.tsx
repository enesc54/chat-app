function JoinServerPopUp() {
    return (
        <div className="flex flex-col justify-center w-full">
            <input
                type="url"
                placeholder="Invitation Link"
                onChange={e => {
                    setServerName(e.target.value);
                }}
                className="bg-[#252525dd] w-full h-12 text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3"
            />
            <div className="bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg p-4 flex items-center mt-4 justify-center">
                Join Server
            </div>
        </div>
    );
}

export default JoinServerPopUp;
