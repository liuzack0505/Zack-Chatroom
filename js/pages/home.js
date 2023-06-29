import React from "react";
import Chatbar from "../component/Chatbar.js";
import Sidebar from "../component/Sidebar.js";


function Home(){

    if (Notification.permission === "default") {
        Notification.requestPermission((p) => {
            console.log(p);
        })
    }
    return(
        <div className="home">
            <div className="container">
                <Sidebar />
                <Chatbar />
            </div>
        </div>
    )
}

export default Home;