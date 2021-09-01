import './EditorContainer.css';
import {useState, useEffect} from "react";
import CodeJs from './CodeMirror.js'
import socket from "./socket.js";
import {useLocation} from 'react-router-dom';
function EditorContainer() {
    const [htmlVal, setHtmlVal] = useState('');
    const [cssVal, setCssVal] = useState('');
    const [jsVal, setJsVal] = useState('');
    let location = useLocation();
    let codeVal = "<html><body>" + htmlVal + "</body> <style>" + cssVal + "</style> <script>" + jsVal + "</script></html>"
    useEffect(() => {
      socket.on('connect', () => {
        console.log('Connected');
        socket.emit('Join', location.state.roomId)
      })
      console.log('Connected');
      socket.on('initialData', initial => {
        setHtmlVal(initial.html);
        setCssVal(initial.css);
        setJsVal(initial.js);
      })
    }, [])
  
    socket.on('sendVal', data => {
      if (data.type === 'xml') {
          setHtmlVal(data.val);
      } else if(data.type === 'css') {
          setCssVal(data.val);
      } else if (data.type === 'javascript') {
          setJsVal(data.val);
      }
    })
  
    return (
      <div className="App">
        <div className="titles">
            <div>HTML</div>
            <div>CSS</div>
            <div>JAVASCRIPT</div>
        </div>
        <div className="editors">
          <CodeJs inputVal={htmlVal} codeChange={setHtmlVal} type="xml" socket={socket} room={location.state.roomId}/>
          <CodeJs inputVal={cssVal} codeChange={setCssVal} type="css" socket={socket} room={location.state.roomId}/>
          <CodeJs inputVal={jsVal} codeChange={setJsVal} type="javascript" socket={socket} room={location.state.roomId}/>
        </div>
        <iframe sandbox srcDoc={codeVal} width="100%">
        </iframe>
      </div>
    );
  }

  export default EditorContainer;