import useGoTo from './useGoTo';
import useGoFrom from './useGoFrom';

export default function useGoToFrom(){
    const goTo = useGoTo();
    const gotFrom = useGoFrom();
    return () => goTo(gotFrom);
}