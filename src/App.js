import "./App.css";
import "@ionic/react/css/core.css";
import { Home } from "./pages/Home/Home";
import { setupIonicReact } from "@ionic/react";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { useState } from "react";
setupIonicReact();

function App() {
    const [user, setUser] = useState();

    if (!user) {
        return <AuthPage onAuth={(user) => setUser(user)} />;
    } else {
        return <Home user={user} logout={() => setUser(null)} />;
    }
}

export default App;
