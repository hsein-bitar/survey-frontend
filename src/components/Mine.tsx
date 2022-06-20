import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { AiFillCopy } from 'react-icons/ai';
import Message from './Message'

// component that lists all surveys a certain user has created
function Mine({ userToken }) {
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let [mySurveys, setMySurveys] = useState([]);

    let navigate = useNavigate();
    let user_token = userToken || localStorage.getItem('user_token');

    useEffect(() => {
        if (!user_token) {
            setMessage({ message: "Token Invalid", theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/login");
            }, 1500);
        }
        populateMySurvey();
    }, [])

    let populateMySurvey = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/v1/survey/list`, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user_token}`
            }),
        })
        let result = await response.json();
        console.log(result);
        setMySurveys(result.surveys || []);
    }

    let renderMySurveys = () => {
        return mySurveys.length > 0 ?
            <>
                <div className='gallery'>{mySurveys.map((survey) => (
                    <>
                        <Link className='item' key={survey.id} to={`/results/${survey.id}`}>
                            <div>{survey.title}</div>
                            <hr />
                            <div>{survey.responses_count} <AiFillCopy fill='var(--accent)' /></div>
                        </Link>
                    </>
                ))}
                </div>
            </> : <>
                <div className='center'>You have zero surveys, try creating some new ones</div>
            </>
    }

    return (<>
        <Message {...message} />
        {renderMySurveys()}
    </>
    )
}

export default Mine