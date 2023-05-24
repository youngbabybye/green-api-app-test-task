import { FriendMessage } from "./FriendMessage";
import { MyMessage } from "./MyMessage";
import { Message } from "./Message";

const ChatBox = (props) => {
  // console.log(props.my_message);
  // console.log(props.friend_message);
  return (
    <div className="chatBox">
      {props.messages &&
        props.messages.map((message) => (
          <Message text={message.text} myMessage={message.myMessage} />
        ))}
    </div>
  );
};
export { ChatBox };
