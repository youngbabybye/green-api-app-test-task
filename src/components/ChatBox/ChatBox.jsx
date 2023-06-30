import { Message } from "./Message";

const ChatBox = (props) => {
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
