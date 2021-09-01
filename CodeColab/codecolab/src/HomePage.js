import {useState, useEffect, useRef} from "react";
import './HomePage.css';
import {
    Link} from 'react-router-dom';
import axios from 'axios';
import socket from "./socket.js";
function HomePage() {
    const[containerList, setContainerList] = useState([]);
    const[isInitial, setIsInitial] = useState(true);
    let containerRefs = useRef({});
    useEffect(() => {
        axios.get('http://localhost:5000/getContainerData')
        .then((response) => {
            setIsInitial(false);
            console.log('woah');
            setContainerList(response.data);
            console.log('get');
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (!isInitial) {
            axios.post('http://localhost:5000/savedcontainers', {
                containers: containerList
            })
            .then((response) => {
                console.log('post');
            })
            .catch((error) => {
                console.log(error)
            });
        }
    }, [containerList])


    const addEditor = () => {
      setContainerList([...containerList, {id: containerList.length, value: `Go To Editor ${containerList.length + 1}`}]);
    }

    const displayRefs = (index) => {
        const roomId = `Room ${index + 1}`
        socket.emit('Join', roomId)
    }
    
    const displayContainers = containerList.map((element, index) => 
    <Link to= {{ pathname: `/room/${element.id}`, state: { roomId: `Room ${element.id + 1}`} }} key={element.id} className="main" onClick={() => displayRefs(element.id)}>
        <div key={element.id} border-style="solid" ref ={(curElement) => { containerRefs.current[index] = curElement}}>{element.value}</div>
    </Link>);

    return (
    <div border="2px solid black">
      <button onClick={addEditor}>Add Editor</button>
      {displayContainers}
    </div>)
}

export default HomePage;