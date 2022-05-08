import React, { Routes, Route , Outlet, useNavigate /*, useRoutes*/} from "react-router-dom"; // useParams,

import {  Logo, NavBar, Loading, StatisticChart, Follow, Boom } from "./Components";
import { useTranslation } from "./Hooks";
import {AcceptInvitation ,Home, Login, Location, Question, QuestionBeExpert, ChooseTeam, Results, Community } from "./Pages";
import GlobalLayout from "./Styles/GlobalLayout"
import AddQuestion from './Pages/Community/AddQuestion';  //to delete

//import LocationReduxExample from "./z_development/LocationReduxExample/LocationReduxExample";
import DataGridExample from "./z_development/DataGridExample";
import GeoLocation from "./z_development/GeoLocation/GeoLocation";

import RequireAuth from "./Auth/RequireAuth";
const { User, Editor, Admin  } = { User: 1000, Admin: 2000, Editor: 3000, };


export default function App() {
const { t } = useTranslation();
return (<>
    {/* <AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated }}> */}
    <Routes>
      <Route path="/"  element={<>
          <Logo />
          <GlobalLayout> <Outlet/> <NavBar/> </GlobalLayout>
        </>}>
          <Route index element={<Home />} />
          <Route path="/Login" element={<Login />} />

          <Route element={<RequireAuth allowedRoles={[User]}/>}>
              <Route path="/Choose" element={<ChooseTeam />} />
              <Route path="/Location" element={<Location />} />
              <Route path="/Question" element={<Question />} />
              
              <Route path="/QuestionBeExpert" element={<><QuestionBeExpert /></>} />
          </Route> 
          {/* Arthur Development! */}
              <Route path="/Follow" element={<Follow />} />
              <Route path="/Boom" element={<Boom />} />
              <Route path="/AddQuestion" element={<AddQuestion />} />
              <Route path="/Community" element={<Community />} />
              <Route path="/Results" element={<Results />} />
              <Route path="/Loading" element={<Loading />} />
              
              <Route path="/Chart" element={<StatisticChart />} />
              <Route path="/:playingTeamId" element={<AcceptInvitation />} />
      </Route>

      {/* Arthur Development! */}
            <Route path="/DataGridExample" element={<DataGridExample />} />
            <Route path="/GeoLocation" element={<GeoLocation />} />
      <Route path="unauthorized/*" element={<>[-PageError403-] (Error 403 Unauthorized) <BackwardLink /></>} />
      <Route path="/*" element={<>[-PageError404-] (Error 404 Not Found) <BackwardLink /> </>} />
    </Routes>

</>);
}



const BackwardLink = () => {
  const navigate = useNavigate();
  return (<button onClick={() => navigate(-1)} >Go Back</button>)
}