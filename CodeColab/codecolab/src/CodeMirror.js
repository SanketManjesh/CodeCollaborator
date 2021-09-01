import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import compStyle from './CodeMirror.module.css';
function CodeJs(props) {
    const {inputVal, codeChange, type, socket, room} = props;

    const inputSetter = (editor, data, value) => {
        codeChange(value);
        socket.emit('inputCode', {val: value, type: type, room: room});
    }

    return (
        <div>
            <CodeMirror value={inputVal} options={
                {lineWrapping: true, lint: true, lineNumbers: true, theme: 'material', mode: {type}}} 
                onBeforeChange={inputSetter} className={compStyle.htmlIn}>
            </CodeMirror>
        </div>
    )
}

export default CodeJs;