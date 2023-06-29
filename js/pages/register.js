import React, { useContext, useState } from "react";
import { db, auth, storage } from "../../config"
import { createUserWithEmailAndPassword, updateProfile , getAuth} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { doc, setDoc, } from "firebase/firestore"; 
import { Link, useNavigate } from "react-router-dom";

function Register(){
    const navigate = useNavigate();
    const [err, setErr] = useState(false);

    const Signup = async (e) => {
        e.preventDefault();
        const displayname = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const imgURL = e.target[3].files[0];
        if (!displayname | !email | !password | !imgURL) {
            setErr(true);
            return
        }
        
        const date = new Date().getDate();

        const userinfo = await createUserWithEmailAndPassword(auth, email, password);
        const storageRef = ref(storage, `${displayname + date}`);
        await uploadBytesResumable(storageRef, imgURL).then(()=>{
            getDownloadURL(storageRef).then( async (downloadURL) => {
                try{
                    await updateProfile(userinfo.user, {photoURL: downloadURL, displayName:displayname})
                    await setDoc(doc(db, "users", userinfo.user.uid), {
                        uid:userinfo.user.uid,
                        displayname,
                        email,
                        photoURL: downloadURL 
                    });
                    await setDoc(doc(db, "userchat", userinfo.user.uid),{});
                    console.log("setDoc successful");
                    navigate("/");
                }catch(error){
                    setErr(true);
                    console.log(error);
                    console.log("setDoc failed");
                }
            });
        })
    }

    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Zack Chat</span>
                <span className="title">REGISTER</span>
                <form onSubmit={Signup}>
                    <input type="text" placeholder="display name"></input>
                    <input type="email" placeholder="email"></input>
                    <input type="password" placeholder="password"></input>
                    <input type="file" className="file-input"/>
                    <button className="signupBtn">sign up</button>
                    {err && <p className="errorhandler">Something is wrong!</p>}
                </form>
                <p>If you have an account? <Link to="/login/">LOGIN</Link></p>
            </div>
        </div>
    )
}
export default Register;