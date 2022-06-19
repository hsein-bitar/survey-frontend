import React, { useEffect, useState } from 'react'
// import LoadingSpinner from './Spinner';

import QuestionBuilder from './QuestionBuilder'
import Message from './Message';


function Create() {
    let [message, setMessage] = useState({ message: "", theme: 0 })
    let [type, setType] = useState('text');
    let [questions, setQuestions] = useState([]);

    // useEffect(() => {
    //     let q: any = {
    //         "type": "multiple",
    //         "content": "tick the languages that you use often",
    //         "options": ['arabic', 'english', 'french', 'german', 'italian']
    //     }
    //     setQuestions([...questions, q]);

    //     // eslint-disable-next-line
    // }, []);
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
                'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2F1dGgvbG9naW4iLCJpYXQiOjE2NTU0NzA4MjcsImV4cCI6MTY1NTcxMDgyNywibmJmIjoxNjU1NDcwODI3LCJqdGkiOiI0YWVoNjN2ZnJlZFFvNEN1Iiwic3ViIjoiMyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.DLh3DwaVu5uPCbSJ2TxRIGw5_f8vM-tOW8r74VKs_4A`
            }),
            body: JSON.stringify(survey)
        })
        let result = await response.json();
        if (result.status) {
            let theme = result.status === 'success' ? 0 : 1;
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
            }, 2000);
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