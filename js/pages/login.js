import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import googleimg from "../../img/google.png"
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const loginin = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        if(!email | !password){
            setErr(true);
            return
        }

        await signInWithEmailAndPassword(auth, email, password).then(()=>{
            console.log("login in successful");
            navigate("/");
        }).catch((error) => {
            console.log("login in failed")
            console.log(error);
            setErr(true);
        })
    }

    const loginwithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try{
            const credential = await signInWithPopup(auth, provider);
            const user = credential.user;
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                await setDoc(doc(db, "users", user.uid), {
                    uid:user.uid,
                    displayname:user.displayName,
                    email:user.email,
                    photoURL:user.photoURL
                });
                await setDoc(doc(db, "userchat", user.uid), {})
                console.log("setDoc successful")
            }
            navigate("/")
        }catch(error) {
            setErr(true);
            console.log(error);
        }
    }
    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Zack Chat</span>
                <span className="title">LOGIN IN</span>
                <form onSubmit={loginin}>
                    <input type="email" placeholder="email"></input>
                    <input type="password" placeholder="password"></input>
                    <button className="loginBtn">login in</button>
                    {err && <p className="errorhandler">Something is wrong!</p>}
                </form>
                <span className="login-span">OR</span>
                <button className="GoogleloginBtn" onClick={loginwithGoogle}><img className="GoogleloginBtn-img" src={googleimg}></img>Login with Google</button>
                <p>If you don't have an account? <Link to="/register">REGISTER</Link></p>
            </div>
        </div>
    )
}
export default Register;