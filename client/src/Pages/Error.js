import React from "react";
import { useGotFrom } from "../Hooks"
import { Link } from "../Components"

export default function Error(message){
    const from = useGotFrom();

    //set function to return to previous page
    const render = () => (<>
        Error Page : {message} <br />
        <Link to={from}>Return to previous page</Link><br />
    </>);
return render();}