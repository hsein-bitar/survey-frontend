import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Question from './Question';
import LoadingSpinner from './Spinner';

export default function Respond() {

    let params = useParams();
    const [questions, setQuestions] = useState([]);
    const [surveyTitle, setSurveyTitle] = useState("");

    let submitResponse = async () => {
        let data = {
            survey_id: parseInt(params.id),
            answers: []
        }

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
                'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2F1dGgvbG9naW4iLCJpYXQiOjE2NTU0NzA4MjcsImV4cCI6MTY1NTcxMDgyNywibmJmIjoxNjU1NDcwODI3LCJqdGkiOiI0YWVoNjN2ZnJlZFFvNEN1Iiwic3ViIjoiMyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.DLh3DwaVu5uPCbSJ2TxRIGw5_f8vM-tOW8r74VKs_4A`
            }),
            body: JSON.stringify(data)
        })
        // TODO show something when request succeeds
        // let result = await response.json()
    }

    const getSurvey = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/survey/show/${params.id}`);
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

    }, []);

    return (
        <>
            {
                questions.length === 0 ? <LoadingSpinner /> : <>
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
