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
    const [myMessage, setMyMessage] = useState([]);
    const [value, setValue] = useState("");
    const [userNumber, setUserNumber] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [inComingMessage, setInComingMessage] = useState([]);
    const [sender, setSender] = useState([]);
    const checkContact = (element) => element.number === userNumber;

    const newContact = {
        number: userNumber,
        avatar: friendAvatar,
        userMessages: [],
        hisFriendMessages: inComingMessage,
    };

    const [contacts, setContacts] = useState([]);
    const displayContact = contacts.map((contact) => {
        return (
            <Contacts
                key={contact.number}
                number={contact.number}
                avatar={contact.avatar}
                setUserNumber={setUserNumber}
                userMessages={contact.userMessages}
                hisFriendMessages={contact.hisFriendMessages}
            />
        );
    });
    function change() {
        setContacts(
            contacts.map((obj) => {
                if (obj.number === userNumber) {
                    return {
                        ...obj,
                        userMessages: [...obj.userMessages, value],
                    };
                } else {
                    return obj;
                }
            })
        );
    }

    const createContact = (e) => {
        e.preventDefault();
        if (contacts.length === 0) {
            setContacts([...contacts, newContact]);
        } else if (contacts.some(checkContact) === false) {
            setContacts([...contacts, newContact]);
        }
        setSearchValue("");
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
        change();
    };
    console.log(contacts);
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
                            setContacts(
                                contacts.map((obj) => {
                                    if (
                                        obj.number ===
                                        data.body.senderData.sender.slice(0, 11)
                                    ) {
                                        return {
                                            ...obj,
                                            hisFriendMessages: [
                                                ...obj.hisFriendMessages,
                                                data.body.messageData
                                                    .textMessageData
                                                    .textMessage,
                                            ],
                                        };
                                    } else {
                                        return console.log("lox");
                                    }
                                })
                            );

                            setInComingMessage((mess) => [
                                ...mess,
                                data.body.messageData.textMessageData
                                    .textMessage +
                                    " " +
                                    data.body.senderData.sender,
                            ]);
                        }
                    }
                });
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    console.log(inComingMessage);
    console.log(sender);
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
                        {contacts && <>{displayContact}</>}
                    </div>
                </div>

                <div className="rightside">
                    <div className="header">
                        <div className="imgText">
                            <div className="userimg">
                                <img
                                    className="cover"
                                    src={friendAvatar}
                                    alt="Friend Avatar"
                                />
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

/*
 {(myMessage || inComingMessage) && (
                        <ChatBox
                            my_message={myMessage}
                            friend_message={inComingMessage}
                            friend_name={sender}
                        />
                    )}

*/
/*
setContacts(
                                contacts.map(
                                    (obj) => {
                                        if (
                                            obj.number ===
                                            data.body.senderData.sender.slice(
                                                0,
                                                11
                                            )
                                        ) {
                                           
                                            return {
                                                ...obj,
                                                hisFriendMessages: [
                                                    ...obj.hisFriendMessages,
                                                    data.body.messageData
                                                        .textMessageData
                                                        .textMessage,
                                                ],
                                            };
                                        } else {
                                            
                                            return obj;
                                        }
                                    }
                                )
                            );


*/
