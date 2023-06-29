import { FriendMessage } from "./FriendMessage";
import { MyMessage } from "./MyMessage";
import { Message } from "./Message";
import { Message } from "./Message";

const ChatBox = (props) => {
    // console.log(props.my_message);
    // console.log(props.friend_message);
    return (
        <div className="chatBox">
            {props.messages &&
                props.messages.map((message) => (
                    <Message
                        text={message.text}
                        myMessage={message.myMessage}
                    />
                ))}
        </div>
    );
    return (
        <div className="chatBox">
            {props.messages &&
                props.selected &&
                props.selected.all.map((message) => (
                    <Message
                        key={Math.random()}
                        text={message.text}
                        myMessage={message.flag}
                    />
                ))}
        </div>
    );
};
export { ChatBox };
