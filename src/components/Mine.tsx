import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Results from './Results';

function Mine({ userToken }) {
    let [mySurveys, setMySurveys] = useState([]);

    useEffect(() => {
        populateMySurvey();
    }, [])

    let populateMySurvey = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/v1/survey/list`, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }),
        })
        let result = await response.json();
        setMySurveys(result.surveys);
    }


    return (
        <div className='gallery'>{mySurveys.map((survey) => (
            <>
                <Link className='item' to={`/results/${survey.id}`}>
                    <div>{survey.title}</div>
                </Link>
            </>
        ))}
        </div>
    )
}

export default Mine