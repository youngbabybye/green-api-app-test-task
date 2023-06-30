import { Message } from "./Message";
import { IonIcon } from "@ionic/react";
import friendAvatar from "../../images/FriendAvatar.png";
import { mic, happyOutline, ellipsisVertical } from "ionicons/icons";
import { attachOutline, sendOutline, searchOutline } from "ionicons/icons";

const ChatBox = (props) => {
    return (
        <>
            <div className="header">
                <div className="imgText">
                    <div className="userimg">
                        <img
                            className="cover"
                            src={friendAvatar}
                            alt="Friend Avatar"
                        />
                    </div>

                    <h4>{props.selected.number}</h4>
                </div>
                <ul className="nav_icons">
                    <li>
                        <IonIcon src={searchOutline}></IonIcon>
                    </li>
                    <li>
                        <IonIcon src={ellipsisVertical}></IonIcon>
                    </li>
                </ul>
            </div>

            <div className="chatBox">
                {props.selected &&
                    props.selected.allMessages.map((message) => (
                        <Message
                            key={Math.random()}
                            textMessage={message.text}
                            flagMessage={message.flag}
                        />
                    ))}
            </div>
            <div className="chatbox_input">
                <IonIcon src={happyOutline} className="IonIcon"></IonIcon>
                <IonIcon src={attachOutline} className="IonIcon"></IonIcon>
                <form onSubmit={props.sendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={props.value}
                        onChange={(e) => {
                            props.setValue(e.target.value);
                        }}
                    />
                    <button className="chatbox_btn" type="submit">
                        <IonIcon
                            src={sendOutline}
                            className="IonIcon"
                        ></IonIcon>
                    </button>
                </form>

                <IonIcon src={mic} className="IonIcon"></IonIcon>
            </div>
        </>
    );
};
export { ChatBox };
