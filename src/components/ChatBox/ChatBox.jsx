import { FriendMessage } from "./FriendMessage";
import { MyMessage } from "./MyMessage";

const ChatBox = (props) => {
    console.log(props.my_message);
    console.log(props.friend_message);
    return (
        <div className="chatBox">
            {props.my_message &&
                props.my_message.map((my_message) => (
                    <MyMessage my_message={my_message} />
                ))}
            {props.friend_message &&
                props.friend_message.map((friend_message) => (
                    <FriendMessage friend_message={friend_message} />
                ))}
        </div>
    );
};
export { ChatBox };
