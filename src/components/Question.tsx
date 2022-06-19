import React from "react";
import "./question.css";

const Question = ({ id, survey_id, content, type, options, index }) => {
    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return (
                    <div className="entry">
                        <label className="block-label" htmlFor={id}>{index + 1}- {content}</label>
                        <textarea id={id} name={id} data-survey-id={survey_id} data-type={type} rows={2}></textarea>
                    </div >
                );
            case 'multiple': return (
                <div className="entry">
                    <label className="block-label" htmlFor={id}>{index + 1}- {content}</label>
                    <div className="flex-options" id={id}>
                        {options.map((o, index) => (
                            <div key={o.id}>
                                <input type="checkbox" id={o.id} name={o.id} value={o.id} />
                                <label htmlFor={o.id}>{o.value}</label>
                            </div>
                        ))}
                    </div>
                </div >
            )
            case 'select': return (<div className="entry">
                <label htmlFor={id}>{index + 1}- {content}</label>
                <select name={id} id={id}>
                    {options.map((o, index) => (
                        <option key={o.id} value={o.value} id={o.id}>{o.value}</option>
                    ))}
                </select>
            </div>);
            case 'date': return (<div className="entry ">
                <label htmlFor={id}>{index + 1}- {content}</label>
                <input type="date" id={id} /> </div>);
            default: return <div className="entry">Question Type Unknown</div>;
        }
    }
    return (
        renderSwitch(type)
    );
}

export default Question;