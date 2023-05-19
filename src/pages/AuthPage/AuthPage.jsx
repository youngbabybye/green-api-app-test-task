import { useState } from "react";

import "./AuthPage.css";
const AuthPage = (props) => {
    const [idInstance, setIdInstance] = useState("");
    const [apiToken, setApiToken] = useState("");
    const onLogin = (e) => {
        e.preventDefault();
        props.onAuth({ idInstance, apiToken });
    };

    return (
        <div className="login-page">
            <div className="card">
                <form onSubmit={onLogin}>
                    <div className="title">Login</div>
                    <input
                        type="text"
                        name="idInstance"
                        className="input_auth"
                        placeholder="Your idInstance"
                        onChange={(e) => setIdInstance(e.target.value)}
                    />
                    <input
                        type="text"
                        name="apiToken"
                        placeholder="Your apiToken"
                        className="input_auth"
                        onChange={(e) => setApiToken(e.target.value)}
                    />
                    <button type="submit" className="btn_auth">
                        LOG IN
                    </button>
                </form>
            </div>
        </div>
    );
};
export { AuthPage };
