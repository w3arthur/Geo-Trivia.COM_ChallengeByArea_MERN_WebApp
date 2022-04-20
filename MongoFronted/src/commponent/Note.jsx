import React, { useEffect, useState } from 'react'


function Note() {
    const [notes, setNotes] = useState([{

        content: ''
    }])
    useEffect(() => {
        fetch("/note").then(res => {
            if (res.ok) {
                return res.json()
            } else {
                console.log("errr")
            }
        }).then(jsonRes => setNotes(jsonRes));
    })


    return (

        < div className='container'>
            <h1>notesp</h1>

        </div >

    )

}



export default Note