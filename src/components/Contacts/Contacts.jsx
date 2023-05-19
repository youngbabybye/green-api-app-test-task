import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Contacts = (props) => {
    const { id } = useParams();

    return (
        <>
            <div
                className="block active"
                onClick={() => {
                    props.setUserNumber(props.contact);
                    console.log(props.userNumber);
                }}
            >
                <div className="imagebox">
                    <img
                        className="cover"
                        src={props.contactAvatar}
                        alt="Contact Avatar"
                    />
                </div>
                <div className="details">
                    <div className="listHead">
                        <h4>{props.contact}</h4>
                    </div>
                    <div className="details_message">
                        <p></p>
                    </div>
                </div>
            </div>
        </>
    );
};
export { Contacts };
