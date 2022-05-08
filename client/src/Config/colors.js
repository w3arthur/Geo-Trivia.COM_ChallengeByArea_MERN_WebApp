import {colors as MuiColors } from '@mui/material';

const colors = {
    loadingBackgroundColor : '#ffffffaa'
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
    
    , statisticChart: {
        piColors: ['#0088FEFF', '#00C49FFF', '#FFBB28FF', '#FF8042FF', '#FFBB28FF', '#00C49FFF']
    }

    , community: {
        globalTabsLineBackgroundColor: 'azure'
    }

    , question: {
        numberBackgroundColor: '#FFFFFFAA'
        , statisticNumbersColors: ['#0088FEAA', '#00C49FAA', '#FFBB28AA', '#FF8042AA', '#FFBB28AA', '#00C49FAA']
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
}

//  more color configurations inside Styles folder

export default colors;