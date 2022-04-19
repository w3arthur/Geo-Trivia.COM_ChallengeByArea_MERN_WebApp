function ge(id){if(typeof id === 'string') return document.getElementById(id);if(typeof id === 'object') return id;}
function clk(id, externalFunction ){ return ge(id).addEventListener('click', (e)=>{  e.preventDefault(); externalFunction(e) } ); }
function getVal(id){ return ge(id).value; }
function setVal(id, val){ return ge(id).value = val; }

let accessToken, refreshToken;

const refresh = { result: ge('') };
const logout = { result: ge('refresh_result') };

const language = 'english';

//post question
clk('send_question', () => {
    resultAxios( 'POST' , '/api/question/' + language + '?lat=' + getVal('send_latitude_send_question') + '&long=' + getVal('send_longitude_send_question')
        , { question: getVal('question'), answers: [getVal('answer1'), getVal('answer2'), getVal('answer3'), getVal('answer4')], rightAnswer: getVal('right_answar') }
        , {  }
        , 'send_question_result' );
});


//get all questions
clk('get_all_questions', () => {
    resultAxios( 'GET' , '/api/questions/' + language + '?lat='+ getVal('send_latitude_all_questions') + '&long=' + getVal('send_longitude_all_questions')
        , {  }
        , {  }
        , 'get_all_questions_result' );
});
//get 5 questions randomly ( by area)   //to delete
clk('get5_questions', () => {
    resultAxios( 'GET' , '/api/questions/' + language + '?lat='+ getVal('send_latitude_get5_questions') + '&long=' + getVal('send_longitude_get5_questions')
        , {  }
        , {  }
        , 'get5_questions_result' );
});
//get random 5 questions randomly for team X1
clk('get5_questions_result_area', () => {
        resultAxios( 'GET' , '/api/gameTeam/' + language + '?team=1&lat='+ getVal('send_latitude5_team') + '&long=' + getVal('send_longitude5_team')
        , {  }
        , {  }
        , 'get5_team_questions_result' );
});

//send answers and get results and score
clk('send_answers', () => {
        resultAxios( 'POST' , '/api/answers/'
        //fix team to objectId
        , { team: 1, user:3, answers: [ getVal('answar1'), getVal('answar2'), getVal('answar3'), getVal('answar4'), getVal('answar5') ]}
        , { }
        , 'get_score' );
});//get flowers

/* */
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
