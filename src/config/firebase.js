// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";





const firebaseConfig = {
  apiKey: "AIzaSyAQkFHUrj6MFAlA0iRzUZr_WIVMJgGUXU0",
  authDomain: "chat-app-49ef6.firebaseapp.com",
  projectId: "chat-app-49ef6",
  storageBucket: "chat-app-49ef6.appspot.com",
  messagingSenderId: "1028458573158",
  appId: "1:1028458573158:web:93cc23ce75bf41cdac6ca7",
  measurementId: "G-KMYCEL3KVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
 try {
    const res = await createUserWithEmailAndPassword(auth,email,password);
    const user = res.user;
    await setDoc(doc(db,"users",user.uid),{
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey, There I am using chat-app",
        lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
        chatsData:[]
    })

 } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(""));
 }
}

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
        
    }
}

const logout = async () =>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
   
    }

    
}

const resetPass = async (email) => {
    if(!email){
       toast.error("Enter your email"); 
       return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
           await sendPasswordResetEmail(auth,email);
           toast.success("Reset Email Sent")
        }
        else{
            toast.error("Email doesn't exist")
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        
    }
}
 
export {signup , login,logout,auth,db,resetPass}
