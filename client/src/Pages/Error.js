import React from "react";
import { useGoFrom } from "../Hooks"
import { Link } from "../Components"

export default function Error(message){
    const from = useGoFrom();

    //set function to return to previous page
    return (<>
        Error Page : {message} <br />
        <Link to={from}>Return to previous page</Link><br />
    </>);
}