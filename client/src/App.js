import React, { Routes, Route /*, useRoutes*/} from "react-router-dom"; // useParams,

import { Logo, Loading } from "./Components";
import { useTranslation } from "./Hooks";
import { AcceptInvitation ,Home, Login, Location, Question, ChooseTeam, Results } from "./Pages";
import GlobalLayout from "./Styles/GlobalLayout"

import LocationReduxExample from "./z_development/LocationReduxExample/LocationReduxExample";
import DataGridExample from "./z_development/DataGridExample";
import GeoLocation from "./z_development/GeoLocation/GeoLocation";

//import RequireAuth from "./Auth/RequireAuth";
//const { User, Editor, Admin } = { User: 1000, Editor: 1984, Admin: 5150, };


export default function App() {
const { t } = useTranslation();
return (<>
    {/* <AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated }}> */}
    <Routes>
      <Route path="/" element={<Logo />}>
          <Route path="/" element={<GlobalLayout />}>
            <Route index element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Choose" element={<ChooseTeam />} />
            <Route path="/Location" element={<Location />} />
            <Route path="/Question" element={<Question />} />
            {/* Arthur Development! */}
            <Route path="/Results" element={<Results />} />
            <Route path="/Loading" element={<Loading />} />
            <Route path="/:playingTeamId" element={<AcceptInvitation />} />
          </Route>
      </Route>

      {/* Arthur Development! */}
            <Route path="/DataGridExample" element={<DataGridExample />} />
            <Route path="/GeoLocation" element={<GeoLocation />} />
      <Route path="/*" element={<>404</>} />
    </Routes>

</>);
}
