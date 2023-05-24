import { ChatBox } from "../ChatBox/ChatBox";

const Contacts = (props) => {
    return (
        <div
            className="block active"
            onClick={() => {
                props.setUserNumber(props.number);
                // console.log(props.number);
            }}
        >
            <div className="imagebox">
                <img
                    className="cover"
                    alt="Contact Avatar"
                    src={props.avatar}
                />
            </div>
            <div className="details">
                <div className="listHead">
                    <h4>{props.number}</h4>
                </div>
                <div className="details_message">
                    <p>{props.avatar}</p>
                </div>
            </div>
        </div>
    );
};
export { Contacts };
