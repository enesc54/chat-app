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
        <div className="card scrollable flex-1">
            <div className="font-bold text-md my-2">Online Friends</div>
            {onlineFriends.map(user => {
                return (
                    <div className="list-item-view text-sm flex items-center gap-2">
                        <img
                            src={user.profilePhoto}
                            className="w-8 h-8 my-1 rounded-xl"
                        />
                        {user.name}
                    </div>
                );
            })}
        </div>
    );
}

export default OnlineFriendsView;
