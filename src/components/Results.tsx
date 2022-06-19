import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function Results(props) {
    let [questions, setQuestions] = useState([]);
    let [surveyTitle, setSurveyTitle] = useState([]);
    let survey_id = useParams().id;

    let getSurveyResults = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/v1/survey/results', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${props.userToken}`
            }),
            body: JSON.stringify({ id: survey_id })
        })
        let results = await response.json();
        console.log(results.survey[0]);
        setQuestions([...results.questions]);
        setSurveyTitle(results.survey[0].title);
    }

    useEffect(() => {
        getSurveyResults();
    }, [])


    return (
        <>
            {questions.map((question) => <div className="entry">{question.content}</div>)}
        </>

    )
}

export default Results