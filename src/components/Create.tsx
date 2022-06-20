import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import QuestionBuilder from './QuestionBuilder'
import Message from './Message';

function Create({ userToken }) {
    let [message, setMessage] = useState({ message: "", theme: 0 })
    let [type, setType] = useState('text');
    let [questions, setQuestions] = useState([]);
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
    }, []);
    let addQuestion = () => {
        let q = {
            "type": type,
            "content": (document.getElementById('question-content') as HTMLInputElement).value,
            "options": document.getElementById('question-options') ? (document.getElementById('question-options') as HTMLInputElement).value.split(',') : []
        }
        setQuestions([...questions, q]);
    }

    let submitSurvey = async () => {
        let survey = {
            "title": (document.getElementById('survey-title') as HTMLInputElement).value,
            "questions": questions
        }
        console.log(survey);
        let response = await fetch(`http://127.0.0.1:8000/api/v1/survey/create`, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user_token}`
            }),
            body: JSON.stringify(survey)
        })
        let result = await response.json();
        if (result.status) {
            let theme = result.status === 'success' ? 0 : 1;
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
            }, 3500);
        }
        console.log(result);
    }
    return (
        <>
            <Message {...message} />
            <h4 className="title">Creating a new survey</h4>
            <div className="entry">
                <label className="bold" htmlFor="survey-title">A- Enter the title of your survey</label>
                <input type="text" id='survey-title' name='survey-title' placeholder='A survey about cat lovers in Lebanon' />
                <label className="bold" htmlFor="survey-questions">B- Start adding questions</label>
                <label htmlFor="question-content">1- What type of answer does your next question expect?</label>
                <div className="types-wrapper">
                    <button onClick={() => setType('text')} className={`${type === 'text' ? 'primary' : 'secondary'}`}>text</button>
                    <button onClick={() => setType('multiple')} className={`${type === 'multiple' ? 'primary' : 'secondary'}`}>multiple</button>
                    <button onClick={() => setType('date')} className={`${type === 'date' ? 'primary' : 'secondary'}`}>date</button>
                    <button onClick={() => setType('select')} className={`${type === 'select' ? 'primary' : 'secondary'}`}>select</button>
                </div>
                <label htmlFor="question-content">2- What is your question?</label>
                <input type="text" id='question-content' name='question-content' placeholder={'what\'s you\'re fav country?'} />
                {(type === 'multiple' || type === 'select') &&
                    <>
                        <label htmlFor="question-options">3- Enter possible answers of your question, separated by commas</label>
                        <input type="text" id='question-options' name='question-options' placeholder='germany, italy, lebanon' />
                    </>}
                <button onClick={() => addQuestion()} className={"secondary"}>Add</button>
            </div>
            <>
                {questions.map((q, index) => (<QuestionBuilder key={index} index={index} {...q} />))}
                <div className="entry">
                    <button onClick={() => submitSurvey()} className={questions.length > 0 ? 'primary' : "secondary"} disabled={questions.length === 0}>Submit</button>
                </div>
            </>
        </>
    )
}

export default Create