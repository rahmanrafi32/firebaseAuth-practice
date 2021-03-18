import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from './firebaseConfig';

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({success: false})
  const [newUser,setNewUser] = useState()
  //google sign in 
  const googleSignIn = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      setUser(user);
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }
  //handeling informations from input
  const handleBlur = (e)=>{
    let validField = true;
    if(e.target.name === 'email'){
      const validField = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const validField = /(?=.*[0-9])(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?=\\S+$)/.test(e.target.value)
    }
    if(validField){
      const newUser = {...user};
      newUser[e.target.name]=e.target.value;
      setUser(newUser);
    }
    
  }

  //sign up new user
  const signUp = (e)=>{
    e.preventDefault();
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const newUser = {...user}
        newUser.error = '';
        newUser.success = true;
        setUser(newUser);

      })
      .catch((error) => {
        const newUser = {...user}
        newUser.error = error.message;
        newUser.success = false;
        setUser(newUser);
      });
    }
  }
  return (
    <div className="App">
      {/* google signIn */}
      <>
        <button onClick={googleSignIn}>Google SignI</button>
        <br/>
        <h3>Welcome: {user.displayName}</h3>
      </>
      {/* signUp with rendom eamil id an password */}
      <>
        <form onSubmit ={signUp}>
          <input type="text" onBlur={handleBlur} name="email" placeholder='enter your email' required/>
          <br/>
          <input type="password" onBlur={handleBlur} name="password" placeholder='enter your password' required/>
          <br/>
          <input type="submit" value="Sign Up"/>
        </form>
        {
          user.success ? <p>Sign Up successful</p> : <p>{user.error}</p>
        }
      </>
    </div>
  );
}

export default App;
