import React /*, {Suspense}*/ from 'react';
import {  BrowserRouter, Routes, Route , Outlet, useNavigate /*, useRoutes*/} from "react-router-dom"; // useParams,

import {  Logo, NavBar, Loading, StatisticChart, Follow, Boom } from "./Components";
//import { useTranslation } from "./Hooks";
import {AcceptInvitation ,Home, Login, Location, Question, QuestionBeExpert, ChooseTeam, Results, Community } from "./Pages";
import { GlobalLayout, colors, fonts } from "./Config"
import { AuthProvider, LoadingProvider ,PlayingTeamProvider } from "./Context";

import AddQuestion from './Pages/Community/AddQuestion';  //to delete


import RequireAuth from "./Auth/RequireAuth";

const { User/*, Editor, Admin*/  } = { User: 1000, Admin: 2000, Editor: 3000, };
const globalMainStyle = { textAlign: 'center', color: colors.bodyTextColor, fontFamily: fonts.bodyFonts };

export default function App() {

return (<><BrowserRouter>
     {/* <AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated }}>  */}
    <Routes>
      <Route path="/"  element={<>
        <AuthProvider> <PlayingTeamProvider> <LoadingProvider>
          <Logo />
          <GlobalLayout sx={{...globalMainStyle}}>
            <Outlet/> 
            <NavBar/>
          </GlobalLayout>
        </LoadingProvider> </PlayingTeamProvider> </AuthProvider>
        </>}>

        <Route index element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/playingTeam/:playingTeamId" element={<AcceptInvitation />} />
<Route path="/Location" element={<Location />} />
        <Route element={<RequireAuth allowedRoles={[User]}/>}>
            <Route path="/Choose" element={<ChooseTeam />} />
            
            <Route path="/Question" element={<Question />} />
            <Route path="/QuestionBeExpert" element={<><QuestionBeExpert /></>} />
            <Route path="/AddQuestion" element={<AddQuestion />} />
            <Route path="/Community" element={<Community />} />
            <Route path="/Results" element={<Results />} />
        </Route>  {/* User Permission Auth */}

        <Route path="/Loading" element={<Loading />} />
        <Route path="/Follow" element={<Follow />} />
        <Route path="/Boom" element={<Boom />} />
        <Route path="/Chart" element={<StatisticChart />} />

        <Route path="unauthorized/*" element={<>[-PageError403-] (Error 403 Unauthorized) <BackwardLink /></>} />
        <Route path="/*" element={<>[-PageError404-] (Error 404 Not Found) <BackwardLink /> </>} />
      </Route>
    </Routes>
</BrowserRouter></>);
}

const BackwardLink = () => {
  const navigate = useNavigate();
  return (<button onClick={() => navigate(-1)} >Go Back</button>)
}