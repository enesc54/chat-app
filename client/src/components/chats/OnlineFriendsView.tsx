import { useState } from "react";

function OnlineFriendsView() {
    const [onlineFriends, setOnlineFriends] = useState([
        {
            userId: "user1",
            name: "Friend 1",
            profilePhoto: "/login_background.jpg"
        },
        {
            userId: "user2",
            name: "Friend 2",
            profilePhoto: "/login_background.jpg"
        },
        {
            userId: "user3",
            name: "Friend 3",
            profilePhoto: "/login_background.jpg"
        }
    ]);

    return (
        <div className="flex-1 bg-[#252525dd] h-full rounded-lg p-4 overflow-y-auto scrollbar-hide">
            <div className="text-white font-bold text-lg my-2">
                Online Friends
            </div>
            {onlineFriends.map(user => {
                return (
                    <div className="text-white flex items-center mb-1 p-1 hover:bg-[#25252544] rounded-lg">
                        <img
                            src={user.profilePhoto}
                            className="w-6 h-6 rounded-lg"
                        />
                        <div className="ml-2 text-sm">{user.name}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default OnlineFriendsView;
