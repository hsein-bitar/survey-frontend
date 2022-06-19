import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Question from './Question';
import LoadingSpinner from './Spinner';
import Message from './Message';

export default function Respond({ userToken }) {
    let survey_id = parseInt(useParams().id);
    let navigate = useNavigate();
    let [message, setMessage] = useState({ message: "", theme: 0 });
    const [questions, setQuestions] = useState([]);
    const [surveyTitle, setSurveyTitle] = useState("");

    let submitResponse = async () => {
        let data = {
            survey_id: survey_id,
            answers: []
        }
        console.log(data);

        let texts = document.querySelectorAll('textarea');
        let multiples = document.querySelectorAll('.flex-options');
        let selects = document.querySelectorAll('select');
        let dates = document.querySelectorAll('input[type="date"]');
        texts.forEach((text) => {
            let a = {
                "question_id": parseInt(text.id),
                "type": "text",
                "content": text.value,
                "options": []
            }
            data.answers.push(a);
        })
        multiples.forEach((multiple) => {
            console.log(multiple);
            let a = {
                "question_id": parseInt(multiple.id),
                "type": "multiple",
                "content": "",
                "options": []
            }
            multiple.querySelectorAll('input[type=checkbox]:checked').forEach(element => {
                a.options.push(parseInt(element.id))
            });
            data.answers.push(a);
        })

        selects.forEach(select => {
            let a = {
                "question_id": parseInt(select.id),
                "type": "select",
                "content": "",
                "options": []
            }
            for (let item of select.selectedOptions) {
                a.options.push(parseInt(item.id))
            }
            data.answers.push(a);
        })
        dates.forEach(date => {
            let a = {
                "question_id": parseInt(date.id),
                "type": "date",
                "content": (date as HTMLInputElement).value,
                "options": []
            }
            data.answers.push(a);
        })

        let response = await fetch(`http://127.0.0.1:8000/api/v1/survey/respond/`, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }),
            body: JSON.stringify(data)
        })
        // TODO show something when request succeeds
        let result = await response.json();
        if (result.status === 'success') {
            let theme = result.status === 'success' ? 0 : 1;
            setMessage({ message: result.message, theme })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/mine");
            }, 2000);
        }
    }

    const getSurvey = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/survey/show/${survey_id}`, {
            method: 'get',
            headers: new Headers({
                'Authorization': `Bearer ${userToken}`
            }),
        });
        const data = await response.json();
        return data
    }

    useEffect(() => {
        const populate = async () => {
            const data = await getSurvey();
            setSurveyTitle(data.survey[0].title);
            setQuestions(data.survey[0].questions);
        }
        populate();

    }, [survey_id]);

    let goToSurvey = () => {
        let id = (document.getElementById('target-survey') as HTMLInputElement).value;
        return navigate(`/respond/${id}`);
    }

    return (
        <><Message {...message} />
            {
                (questions.length === 0 || !survey_id) ? <>
                    {/* <LoadingSpinner />  */}
                    <div className='enter-survey-id'>
                        <label htmlFor="target-survey">Enter survey id:</label>
                        <input type="number" id='target-survey' name='target-survey' />
                        <button className='primary' onClick={() => goToSurvey()}>Submit</button>
                    </div>
                </> : <>
                    <h4 className="title">{surveyTitle}</h4>
                    {questions.map((q, index) => (<Question key={q.id} index={index} {...q} />))}
                    <div className="entry">
                        <div className='buttons-wrapper'>
                            <button className='primary' onClick={() => submitResponse()}>Submit</button>
                        </div>
                    </div>

                </>
            }
        </>


    )
}
