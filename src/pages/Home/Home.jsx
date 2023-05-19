import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { chatbox, ellipsisVertical, scanCircleOutline } from "ionicons/icons";
import { mic, searchOutline, happyOutline } from "ionicons/icons";
import { attachOutline, sendOutline, exitOutline } from "ionicons/icons";

import "./Home.css";
import userAvatar from "../../images/userAvatar.png";
import friendAvatar from "../../images/FriendAvatar.png";
import { Contacts } from "../../components/Contacts/Contacts";
import { ChatBox } from "../../components/ChatBox/ChatBox";

const Home = (props) => {
    const [contacts, setContacts] = useState([]);
    const [myMessage, setMyMessage] = useState([]);
    const [value, setValue] = useState("");
    const [userNumber, setUserNumber] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [inComingMessage, setInComingMessage] = useState([]);
    const [sender, setSender] = useState([]);
    const checkContact = (element) => element === userNumber;

    const createContact = (e) => {
        e.preventDefault();
        if (contacts.length === 0) {
            setContacts((contacts) => [...contacts, userNumber]);
        } else if (contacts.some(checkContact) === false) {
            setContacts((contacts) => [...contacts, userNumber]);
        }
        setSearchValue("");

        console.log(contacts);
        console.log(userNumber);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        fetch(
            `https://api.green-api.com/waInstance${props.user.idInstance}/sendMessage/${props.user.apiToken}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: `${userNumber}@c.us`,
                    message: value,
                }),
            }
        );
        setValue("");
        setMyMessage((myMessage) => [...myMessage, value]);

        console.log(contacts);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(
                `https://api.green-api.com/waInstance${props.user.idInstance}/receiveNotification/${props.user.apiToken}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        console.log(data.receiptId);

                        fetch(
                            `https://api.green-api.com/waInstance${props.user.idInstance}/deleteNotification/${props.user.apiToken}/${data.receiptId}`,
                            {
                                method: "DELETE",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.result === true) {
                                    console.log(data.result);
                                }
                            });

                        if (
                            data.body.messageData &&
                            data.body.messageData.textMessageData
                        ) {
                            setInComingMessage((mess) => [
                                ...mess,
                                data.body.messageData.textMessageData
                                    .textMessage,
                            ]);
                            console.log(inComingMessage);
                        }
                        if (data.body.senderData) {
                            setSender((sender) => [
                                ...sender,
                                data.body.senderData,
                            ]);
                            console.log(sender);
                        }
                    }
                });
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div className="container">
                <div className="leftside">
                    <div className="header">
                        <div className="userimg">
                            <img
                                className="cover"
                                src={userAvatar}
                                alt="User Avatar"
                            />
                        </div>
                        <ul className="nav_icons">
                            <li>
                                <IonIcon src={scanCircleOutline}></IonIcon>
                            </li>
                            <li>
                                <IonIcon src={chatbox}></IonIcon>
                            </li>
                            <li>
                                <button onClick={props.logout}>
                                    <IonIcon src={exitOutline}></IonIcon>
                                </button>
                            </li>
                            <li>
                                <IonIcon src={ellipsisVertical}></IonIcon>
                            </li>
                        </ul>
                    </div>
                    <div className="search_chat">
                        <form onSubmit={createContact}>
                            <input
                                type="text"
                                name="userNumber"
                                placeholder="Search or start new chat"
                                onChange={(e) => {
                                    setUserNumber(e.target.value);
                                    setSearchValue(e.target.value);
                                }}
                                value={searchValue}
                            />
                            <button type="submit">
                                <IonIcon
                                    src={searchOutline}
                                    className="search"
                                ></IonIcon>
                            </button>
                        </form>
                    </div>
                    <div className="chatlist">
                        {contacts &&
                            contacts.map((contact) => (
                                <Contacts
                                    contact={contact}
                                    key={contact}
                                    setUserNumber={setUserNumber}
                                    userNumber={userNumber}
                                    contactAvatar={friendAvatar}
                                />
                            ))}
                    </div>
                </div>

                <div className="rightside">
                    <div className="header">
                        <div className="imgText">
                            <div className="userimg">
                                <img className="cover" src={friendAvatar} />
                            </div>

                            <h4>User</h4>
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
                    {(myMessage || inComingMessage) && (
                        <ChatBox
                            my_message={myMessage}
                            friend_message={inComingMessage}
                            friend_name={sender}
                        />
                    )}
                    <div className="chatbox_input">
                        <IonIcon
                            src={happyOutline}
                            className="IonIcon"
                        ></IonIcon>
                        <IonIcon
                            src={attachOutline}
                            className="IonIcon"
                        ></IonIcon>
                        <form onSubmit={sendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
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
                </div>
            </div>
        </>
    );
};
export { Home };

/*
    const receiveNotification = () => {
        fetch(
            `https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`
        )
            .then((res) => res.json())
            .then((data) => {
                setReceiptId(data.receiptId);

                if (
                    data.body.messageData &&
                    data.body.messageData.textMessageData
                ) {
                    setInComingMessage((mess) => [
                        ...mess,
                        data.body.messageData.textMessageData.textMessage,
                    ]);
                    console.log(inComingMessage);
                }
                if (data.body.senderData) {
                    setSender(data.body.senderData);
                }
            });
    };
    useEffect(() => {
        fetch(
            `https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`
        )
            .then((res) => res.json())
            .then((data) => {
                setReceiptId(data.receiptId);
                console.log(receiptId);
                if (
                    data.body.messageData &&
                    data.body.messageData.textMessageData
                ) {
                    setInComingMessage((mess) => [
                        ...mess,
                        data.body.messageData.textMessageData.textMessage,
                    ]);
                    console.log(inComingMessage);
                }
                if (data.body.senderData) {
                    setSender(data.body.senderData);
                }
                const deleteNotification = () => {
                    fetch(
                        `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        }
                    );
                };
                deleteNotification();
            });
    }, [inComingMessage, receiptId]);
*/
/*
<div>
                            <input
                                type="text"
                                placeholder="Search or start new chat"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />

                            <IonIcon
                                src={searchOutline}
                                className="search"
                                onClick={() => {
                                    setContacts((contacts) => [
                                        ...contacts,
                                        searchValue,
                                    ]);
                                }}
                            ></IonIcon>
                        </div>
*/

/*
<input
                            type="text"
                            placeholder="Type a message"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                        />
                        <button
                            className="chatbox_btn"
                            onClick={() => {
                                sendMessage();
                                setValue("");
                                setMyMessage((myMessage) => [
                                    ...myMessage,
                                    value,
                                ]);
                            }}
                        >
                            Send Message
                        </button>
*/
/*
const idInstance = "1101821309";
    const apiTokenInstance =
        "6a9c1aff89e2427ca9435d0a7168e92f0a679ccf6c0a4f4abd"
*/
