import { useLocation } from "react-router-dom";

export default function useGoFrom(){
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    return from;
}