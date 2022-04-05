function ge(id){if(typeof id === 'string') return document.getElementById(id);if(typeof id === 'object') return id;}
function clk(id, externalFunction ){ return ge(id).addEventListener('click', (e)=>{  e.preventDefault(); externalFunction(e) } ); }
function getVal(id){ return ge(id).value; }
function setVal(id, val){ return ge(id).value = val; }

let accessToken, refreshToken;

const refresh = { result: ge('') };
const logout = { result: ge('refresh_result') };

clk('register_action', () => {
    resultAxios( 'POST' , '/api/users'
        , { name: getVal('register_name'), email: getVal('register_email'), password: getVal('register_password'), type: getVal('register_type') }
        , {  }
        , 'register_result' );
});
clk('login_action', () => {
    resultAxios( 'POST' , '/api/login'
        , { email: getVal('login_email'), password: getVal('login_password') }
        , {  }
        , 'login_result' );
});
clk('refresh_action', () => { //'Authorization': refreshToken
        resultAxios( 'PATCH' , '/api/login'
            , {  }
            , {  }
            , 'refresh_result' );
});
clk('logout_action', () => { //'Authorization': refreshToken
        resultAxios( 'DELETE' , '/api/login'
        , {  }
        , {  }
        , 'refresh_result' );
});
clk('get_action', () => {
        resultAxios( 'GET' , '/api/flowers'
        , { }
        , {'Authorization': 'Bearer ' + accessToken,}
        , 'get_result' );
});//get flowers


async function resultAxios(method, url, data, additionHeader, resultId){
    setVal(resultId, '');
    try {
        const response = await axios.create({
            baseURL: 'http://localhost:3500/',
            //timeout: 1000,
            headers: {'Content-Type': 'application/json',},
            withCredentials: true
            })({
                method: method,
                url: url,
                data: JSON.stringify(data),
                headers: additionHeader,
            });

            
        if (await response.data?.refreshToken) refreshToken = await response.data.refreshToken;
        if (await response.data?.accessToken) accessToken = await response.data.accessToken;
        const responseString = typeof(await response) === 'object' ? JSON.stringify(await response.data) : await response ;
        setVal(resultId, await responseString);
    }catch(error){
        console.log('data', error.response?.data);
        console.log('status', error.response?.status);
        console.log('headers', error.response?.headers);
        //with validator
        const dataError = typeof(error.response?.data) === 'object' ?  error.response?.data?.error : error.response?.data;
        setVal(resultId, error.response?.status + ' ' + dataError  );//Joi
    } 
}
