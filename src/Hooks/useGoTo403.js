import { useNavigate } from "react-router-dom";

export default function useGoTo404(){
    const navigate = useNavigate();
    return function goTo(){ navigate( '/403' , { replace: true });  }
}