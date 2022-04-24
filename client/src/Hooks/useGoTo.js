import { useNavigate } from "react-router-dom";

export default function useGoTo(){
    const navigate = useNavigate();
    return function goTo(to){ navigate( to , { replace: true });  }
}