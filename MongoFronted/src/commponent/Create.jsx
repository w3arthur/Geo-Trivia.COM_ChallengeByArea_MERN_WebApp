import React, { useState } from 'react'
import axios from 'axios';
function Create() {
    const [input, setinput] = useState({
        titel: '',
        content: ''
    })
    function handleChange(event) {
        const { name, value } = event.target;
        setinput(prevInput => {
            return {
                ...prevInput,
                [name]: value,


            }
        })
    }

    function handleClick(event) {
        event.preventDefault();
        console.log(event);
        const newNote = {
            titel: input.titel,
            content: input.content
        }
        axios.post('http://localhost:3001/create', newNote)
    }

    return (
        <div className='container'>
            <h1>create note</h1>
            <form>
                <div className='form-group'>
                    <input onChange={handleChange} name='titel' value={input.titel} autoComplete='off' placeholder='titel' className="form-control" ></input>
                </div>

                <div className='form-group'>
                    <input onChange={handleChange} name='content' value={input.content} autoComplete='off' placeholder='content' className="form-control"></input>
                </div>
                <button onClick={handleClick} className="btn btn-lg btn-info"> ADD </button>
            </form>
        </div>
    )
}

export default Create