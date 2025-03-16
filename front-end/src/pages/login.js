
import "../css/login.css"
import axios from "axios";
import { useRef, useContext } from "react";
import { toast, Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';

function Login() {

    const { login } = useContext(AuthContext);
    const userNameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const authenticateUser = (e) => {
        e.preventDefault();
        const userData = {
            "username": userNameRef.current.value,
            "password": passwordRef.current.value
        }
        axios.post('/authenticateUser', userData)
            .then(response => {
                if (response.data.user_name != undefined) {
                    toast.success('User logged in successfully', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    login({ user_name: response.data.user_name, id: response.data.id });
                } else {
                    toast.error('Authentication failed, invalid user or password:' + userNameRef.current.value, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
            }).catch(error => {
                console.log(error.response.data)
            })
    }


    return (
        <>
            <main>
                <div class="container">
                    <div class="login-container">
                        <div class="brand-name">Rini</div>
                        <h2>LOGIN</h2>
                        <form>
                            <input ref={userNameRef} type="text" name="username" placeholder="Username" required />
                            <input ref={passwordRef} type="password" name="password" placeholder="Password" required />
                            <button type="submit" class="login-button" onClick={authenticateUser}>Login</button>
                        </form>
                        <p><a href="#">Forgot your password?</a></p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login;