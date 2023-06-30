const Message = (props) => {
    return (
        <div
            className={`message ${
                props.flagMessage ? "my_message" : "friend_message"
            }`}
        >
            <p>{props.textMessage}</p>
        </div>
    );
};
export { Message };
