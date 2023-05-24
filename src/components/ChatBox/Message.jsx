const Message = (props) => {
  return (
    <div
      className={`message ${props.myMessage ? "my_message" : "friend_message"}`}
    >
      <p>{props.text}</p>
    </div>
  );
};
export { Message };
