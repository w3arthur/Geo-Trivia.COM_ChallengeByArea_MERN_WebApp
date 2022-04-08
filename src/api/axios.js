import axios from 'axios';

const axiosFun = axios.create({
    baseURL: 'http://localhost:3500'
    //, timeout: 1000
    , headers: {'Content-Type': 'application/json',}
    , withCredentials: true
});

export async function Axios(method, additionUrl, data, additionHeader){
    try{
        let response = await axiosFun({
                method: method
                , url: additionUrl
                , data: JSON.stringify(data)
                //, headers: additionHeader
            });
        console.log(':: ajax success');
        return await response.data;
    }catch(error){
        console.log(':: ajax error');
        if(error === 'Error: Network Error'){alert('dgfdfgdf')}
        console.log('data', error.response?.data);  //{result: 'user already exist!'}
        console.log('status', error.response?.status);  //status 452
        console.log('headers', error.response?.headers);  //{content-length: '32', content-type: 'application/json; charset=utf-8'}
        if(!error.response?.data) throw (()=>'no server connection')() ;
        throw error.response?.data;
    }
}
 
export function Async(callback){
    (async() => { callback(); })();
}