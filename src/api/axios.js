import axios from 'axios';
import {Logging} from '../classes';

const axiosFunction = axios.create({
    baseURL: 'http://localhost:3500'
    //, timeout: 1000
    , headers: {'Content-Type': 'application/json',}
    , withCredentials: true
});

export const userRegisterApi = (user) => Axios('POST', '/api/users', user, {});
export const loginApi = (user) => Axios('POST', '/api/login', user, {});
export const tokenRenewApi = () => Axios('PATCH', '/api/login', {}, {});    //require cookie
export const tokenDestroyApi = () => Axios('DELETE', '/api/login', {}, {});    //require cookie
const loggingLog = (log) => axiosLogging ('title', '/log/logging', log);
const errorLog = (log) => axiosLogging ('title', '/log/error', log);

export async function Axios(method, additionUrl, data, additionHeader){
    try{
        let response = await axiosFunction({
            method: method
            , url: additionUrl
            , data: JSON.stringify(data)
            , headers: additionHeader
        });
        console.log(':: ajax success');
        console.log(response);
        loggingLog( new Logging({}, data, response ).SentDetails(method, additionUrl, additionHeader) );
        return await response.data;
    }catch(error){
        console.log(':: ajax error');
        // console.log('data', error.response?.data);  //{result: 'user already exist!'}
        // console.log('status', error.response?.status);  //status 452
        // console.log('headers', error.response?.headers);  //{content-length: '32', content-type: 'application/json; charset=utf-8'}
        if(!error.response?.data) throw (()=>'no server connection')() ;
        errorLog( new Logging({}, data, error ).SentDetails(method, additionUrl, additionHeader) );
        throw error.response?.data;
    }
}

async function axiosLogging (title, additionUrl, data) {
    try{ 
        await axiosFunction({ method: 'post' , url: additionUrl , data: JSON.stringify(data) });
        console.log(':: ajax logging :: ' + title);
    }catch(e){ }
}

export function Async(callback){ (async() => { callback(); })(); }

export function databaseRequest(axiosFunction, goodResult, failResult){
    Async( async() => {
        try{
        const result = await axiosFunction();
        if(await result) goodResult(result)
        else throw new Error();
        console.log('result ',result);    //to delete
        }catch(error){ failResult(error);}
  });
}

export class DatabaseRequest{
    #axiosFunction; #goodResult; #failResult;
    constructor(axiosFunction) { this.#axiosFunction = axiosFunction; }
    GoodResult = (goodResult) => { this.#goodResult = goodResult; return this; }
    BadResult = (failResult) => { this.#failResult = failResult; return this; }
    Build = () => {
        if (typeof(this.#axiosFunction) !== 'function' ||  typeof(this.#goodResult) !== 'function' ) {alert('no functions entered inside axios');return;}
        if(typeof(this.#axiosFunction) !== 'function') this.#failResult = () => {return;};
        databaseRequest( 
            () => this.#axiosFunction()
            , (result) => this.#goodResult(result)
            , (error) => this.#failResult(error)
        )
    }
}

  