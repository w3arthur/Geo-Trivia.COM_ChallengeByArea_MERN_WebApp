import {colors as MuiColors } from '@mui/material';

const colors = {
bodyTextColor: '#6c059c'
, logoLargeScreenBackgroundColor: '#1A7273'
, languageIconColor: 'cyan'
, loading: {
    textBackGround: '#ffffffaa'
    , screenBackground: '#ffffff22'
}
, globalLayout: {
    primary: `#FFA500`//mainColor
    , secondary: `#6c059c`//purple
    , mainColor: `#FFA500`
    , mainColorLight: `#FCE9D9FF`
    , mainColorLighter: `#FFFBF5`
    , mainColorDark: `#E39602`
    , mainColorText1: `#edb200`
    , mainColorText2: `#e0b002`
    , mainColorText3: `#8c6e00`
    , purple: `#6c059c`
    , purple2: MuiColors.deepPurple[500]
    , white: `#ffffff`
    , shadow: `#888888`
    , shadowLight: `#CCCCCC`
    , checkbox: 'primary'
}
, chooseTeam_AddTeamMember: {
    selectionMemberTextColor: "secondary"
    , avatarBackgroundColor: '#faae1c'
    , userAcceptedGreenBorder: '3px solid  #187071'
}
, facebookButton: {
    boxShadowColor: '#AAAAAA'
    , textShadowColor: '#CCCCCC'
}
, statisticChart: {
    piColors: ['#0088FEFF', '#00C49FFF', '#FFBB28FF', '#FF8042FF', '#FFBB28FF', '#00C49FFF']
    , piBorderColor: '#8884d8'
}
, followBackgroundColor: '#faae1c'
, question: {
    numberBackgroundColor: '#FFFFFFAA'
    , statisticNumbersColors: ['#0088FEAA', '#00C49FAA', '#FFBB28AA', '#FF8042AA', '#FFBB28AA', '#00C49FAA']
    , answerBorderColor: '#FFA500'
}
, community: {
    globalTabsLineBackgroundColor: 'azure'
}
, questionBeExpert:{
    numberBackgroundColor: '#FFFFFFAA'
}
, newestQuestions:{
    numberBackgroundColor: '#FFFFFFAA'
    , rightAnswerBackgroundColor: 'azure'
}
, expertToApproveQuestions:{
    questionTitle: 'azure'
}
, advertisement: {
    textColor: 'black'
}
}
//  more color configurations inside Styles folder
export default colors;