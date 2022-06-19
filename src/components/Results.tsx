import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Message from './Message'

function Results(props) {
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let [questions, setQuestions] = useState([]);
    let [surveyTitle, setSurveyTitle] = useState([]);
    let survey_id = useParams().id;
    let navigate = useNavigate();

    let getSurveyResults = async () => {
        let user_token = props.userToken;
        if (!user_token) {
            user_token = localStorage.getItem('user_token');
            if (!user_token) {
                setMessage({ message: "Token Invalid", theme: 1 })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                    return navigate("/login");
                }, 2000);
            }
        }

        let response = await fetch('http://127.0.0.1:8000/api/v1/survey/results', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user_token}`
            }),
            body: JSON.stringify({ id: survey_id })
        })
        let results = await response.json();
        console.log(results.survey[0]);
        console.log(results);
        setQuestions([...results.questions]);
        setSurveyTitle(results.survey[0].title);
    }

    useEffect(() => {
        getSurveyResults();
    }, [])


    return (
        <><Message {...message} />
            <h4 className="title">{surveyTitle}</h4>
            {questions.map((question, index) => {
                return (
                    <>
                        <label className='question'>{index + 1}- {question.content}</label>
                        {question.answers.map((answer, index) => {
                            return (
                                <>
                                    <div className="answer">
                                        {answer.content && <div key={answer.id} id={answer.id} className="answer-content">{answer.content}</div>}
                                        <div className="answer-options">
                                            {answer.options.map((option) =>
                                                (answer.options.length && <div key={option.id} id={option.id} className="answer-option">{option.value}</div>)

                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </>
                )
            })}

        </>

    )
}

export default Results