import react, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from './Message'

let Login = ({ userToken, setUserToken }) => {
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let navigate = useNavigate();

    let login = async () => {
        // try {
        let user = {
            email: (document.getElementById('login-email') as HTMLInputElement).value,
            password: (document.getElementById('login-password') as HTMLInputElement).value
        }
        let response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }),
            body: JSON.stringify(user)
        })
        let result = await response.json();
        console.log(result);
        let theme = result.status === 'success' ? 0 : 1;
        if (result.status === 'success' && result.authorisation.token) {
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/mine");
            }, 2000);
            localStorage.setItem('user_token', result.authorisation.token);
            await setUserToken(result.authorisation.token)
        } else {
            // TODO fix this logic, not displaying error message
            setMessage({ message: 'response invalid', theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/mine");
            }, 2000);
        }
        // } catch (error) {
        //     setMessage({ message: 'error occured', theme: 1 })
        //     setTimeout(() => {
        //         setMessage({ message: "", theme: 0 })
        //         return navigate("/mine");
        //     }, 2000);
        // }
    }

    return (
        <><Message {...message} />
            {!userToken ?
                <form id="login-form" name="login-form" action="" noValidate>
                    <label htmlFor="email">Enter your email:</label>
                    <input type="email" id="login-email" required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="login-password" name="password" required />
                    <div className='button'>
                        <button onClick={() => login()} id="login-submit" className="primary" type="button"> Login</button>
                    </div>
                </form>
                : <></>}
        </>
    )



}

export default Login;