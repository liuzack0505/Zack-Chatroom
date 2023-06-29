import React from "react";
import App from "./js/App";
import { AuthcontextProvider } from "./js/context/Authcontext";
import { GroupcontextProvider } from "./js/context/Groupcontext";
const root = document.getElementById("root");
const struct = (
    <AuthcontextProvider>
        <GroupcontextProvider>
            <App />
        </GroupcontextProvider>
    </AuthcontextProvider>
)

ReactDOM.render(struct, root);