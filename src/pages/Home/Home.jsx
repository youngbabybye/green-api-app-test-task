import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { chatbox, ellipsisVertical, scanCircleOutline } from "ionicons/icons";
import { searchOutline, exitOutline } from "ionicons/icons";

import "./Home.css";
import userAvatar from "../../images/userAvatar.png";
import friendAvatar from "../../images/FriendAvatar.png";
import { Contacts } from "../../components/Contacts/Contacts";
import { ChatBox } from "../../components/ChatBox/ChatBox";

const Home = (props) => {
    const [value, setValue] = useState("");
    const [userNumber, setUserNumber] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(false);

    const checkContact = (element) => element.number === userNumber;

    const newContact = {
        number: userNumber,
        avatar: friendAvatar,
        allMessages: [],
    };

    const displayContact = contacts.map((contact) => {
        return (
            <Contacts
                onClick={() => {
                    setSelectedContact(contact);
                    setUserNumber(contact.number);
                }}
                key={contact.number}
                number={contact.number}
                avatar={contact.avatar}
                setUserNumber={setUserNumber}
                setSelectedContact={setSelectedContact}
                selectedContact={selectedContact}
            />
        );
    });

    function change() {
        setContacts((contacts) =>
            contacts.map((obj) => {
                if (obj.number === userNumber) {
                    obj.allMessages = [
                        ...obj.allMessages,
                        { text: value, flag: true },
                    ];
                }
                return obj;
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
        change();
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(
                `https://api.green-api.com/waInstance${props.user.idInstance}/receiveNotification/${props.user.apiToken}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
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
                                console.log("deleteNotification", data.result);
                            });

                        if (
                            data.body.messageData &&
                            data.body.messageData.textMessageData
                        ) {
                            setContacts((contacts) =>
                                contacts.map((obj) => {
                                    if (
                                        obj.number ===
                                        data.body.senderData.sender.slice(0, 11)
                                    ) {
                                        obj.allMessages = [
                                            ...obj.allMessages,
                                            {
                                                text: data.body.messageData
                                                    .textMessageData
                                                    .textMessage,
                                                flag: false,
                                            },
                                        ];
                                    }
                                    return obj;
                                })
                            );
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
                        {contacts && <>{displayContact}</>}
                    </div>
                </div>

                <div className="rightside">
                    {selectedContact && (
                        <ChatBox
                            selected={selectedContact}
                            setValue={setValue}
                            sendMessage={sendMessage}
                            value={value}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
export { Home };
