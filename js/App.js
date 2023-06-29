import React, { Children, useContext } from "react";
import Register from "./pages/register"
import Login from "./pages/login"
import Home from "./pages/home"
import {Authcontext} from "./context/Authcontext"
import "../css/index.scss"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Groupcontext } from "./context/Groupcontext";

function App(){
    
    const {curUser} = useContext(Authcontext);
    const {curGroup} = useContext(Groupcontext);
    console.log(curUser);
    console.log(curGroup);

    const Protectroute = ({children}) => {
        if (!curUser) {
            return (
                <Navigate to="/login/" />
            );
        } 
        return children;
    }
    return(
        <BrowserRouter>
            <Routes path="/">
                <Route index element = {
                    <Protectroute>
                        <Home />
                    </Protectroute>}>
                </Route>
                <Route path="/login/" element = {<Login />} />
                <Route path="/register/" element = {<Register />} />
            </Routes>
        </BrowserRouter>
        
    )
}
export default App;