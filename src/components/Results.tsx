import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Message from './Message'

function Results({ userToken }) {
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let [questions, setQuestions] = useState([]);
    let [surveyTitle, setSurveyTitle] = useState([]);
    let survey_id = useParams().id;

    let navigate = useNavigate();
    let user_token = userToken || localStorage.getItem('user_token');;

    let getSurveyResults = async () => {
        if (!user_token) {
            setMessage({ message: "Token Invalid", theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/login");
            }, 1500);
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
        let result = await response.json();
        let theme = result.status === 'success' ? 0 : 1;
        if (result.status === 'success' && result.questions) {
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
            }, 1500);
            setQuestions([...result.questions]);
            setSurveyTitle(result.survey[0].title);
        } else {
            // user trying to check results of a survey they don't own, redirect them to their home page
            setMessage({ message: 'You are not allowed to view this page', theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/mine");
            }, 1500);
        }
    }

    useEffect(() => {
        if (!user_token) {
            setMessage({ message: "Token Invalid", theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/login");
            }, 1500);
        }
        getSurveyResults();
    }, [])

    let renderAnswers = (answer, index) => {
        return (<>
            <div className="answer">
                {answer.content && <div key={answer.id} id={answer.id} className="answer-content">{index + 1}- {answer.content}</div>}
                {/* check options array and list options chosen */}
                {(answer.options.length > 0) &&
                    <div className="answer-options">{index + 1}-
                        {answer.options.map((option) =>
                            (<div key={option.id} id={option.id} className="answer-option">{option.value}</div>)
                        )}
                    </div>}
            </div></>)
    }


    return (
        <><Message {...message} />
            <h4 className="title">{surveyTitle}</h4>
            {questions.map((question, index) => {
                return (
                    <div className='question-with-responses'>
                        <label className='question'>{index + 1}- {question.content}</label>
                        {question.answers.map((answer, index) => {
                            return renderAnswers(answer, index);
                        })}
                    </div>
                )
            })}
            <div className="entry"></div>
        </>

    )
}

export default Results