import react, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Message from './Message';

let Register = ({ userToken, setUserToken }) => {
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let navigate = useNavigate();

    let register = async () => {
        let user = {
            name: (document.getElementById('register-name') as HTMLInputElement).value,
            email: (document.getElementById('register-email') as HTMLInputElement).value,
            password: (document.getElementById('register-password') as HTMLInputElement).value
        }
        let response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }),
            body: JSON.stringify(user)
        })
        let result = await response.json();
        if (result.status === 'success') {
            let theme = result.status === 'success' ? 0 : 1;
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/mine");
            }, 2000);
        }
        await setUserToken(result.authorisation.token)
    }

    return (
        <><Message {...message} />
            {!userToken ?
                <form id="register-form" name="register-form" action="" noValidate>
                    <label htmlFor="name">Enter your name:</label>
                    <input type="text" id="register-name" required />
                    <label htmlFor="email">Enter your email:</label>
                    <input type="email" id="register-email" required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="register-password" name="password" required />
                    <div className='button'>
                        <button onClick={() => register()} id="register-submit" className="primary" type="button"> Register</button>
                    </div>
                </form>
                : <></>}
        </>
    )

}

export default Register;