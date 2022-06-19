import React from "react";
import "./question.css";

const QuestionBuilder = ({ type, content, options, index }) => {
    const renderSwitch = (type: any) => {
        switch (type) {
            case 'text':
                return (
                    <div className="entry">
                        <label className="block-label" data-type={type} data-content={content} data-options={[]}>{index + 1}- {content}</label>
                        <textarea data-type={type} rows={2}></textarea>
                    </div >
                );
            case 'multiple': return (
                <div className="entry">
                    <label className="block-label" data-type={type} data-content={content} data-options={options}>{index + 1}- {content}</label>
                    <div className="flex-options">
                        {options.map((o, index) => (
                            <div key={index}>
                                <input type="checkbox" />
                                <label>{o}</label>
                            </div>
                        ))}
                    </div>
                </div >
            )
            case 'select': return (<div className="entry">
                <label className="block-label" data-type={type} data-content={content} data-options={options}>{index + 1}- {content}</label>
                <select>
                    {options.map((o, index) => (
                        <option key={index} >{o}</option>
                    ))}
                </select>
            </div>);
            case 'date': return (<div className="entry ">
                <label className="block-label" data-type={type} data-content={content} data-options={[]}>{index + 1}- {content}</label>
                <input type="date" /> </div>);
            default: return <div className="entry">Question Type Unknown</div>;
        }
    }
    return (
        renderSwitch(type)
    );
}

export default QuestionBuilder;