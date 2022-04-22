import React from "react";
import { Routes, Route, useRoutes } from "react-router-dom"; // useParams,
//Arthur Development
import { GlobalLayout, Question, RequireAuth, } from "./components";
import LocationReduxExample from "./z_development/LocationReduxExample/LocationReduxExample";
import DataGridExample from "./z_development/DataGridExample";
import GeoLocation from "./z_development/GeoLocation/GeoLocation";

import { useTranslation } from "react-i18next";
//import LanguageFlags from "./components/Multilanguage/LanguageFlags";
// import Popup from "reactjs-popup";
// import "reactjs-popup/dist/index.css";
import HeaderContent from "./components/logo/header";
import { FrontPage } from "./components/pages/FrontPage";
import LoginPage from "./components/pages/LoginPage";
import Location from "./components/pages/LocationPage";
// import { useAuth } from "./components/hooks/auth.hook";
// import { AuthContext } from './context/AuthContext';

const { User, Editor, Admin } = { User: 1000, Editor: 1984, Admin: 5150, };

export default function App() {
  const { t } = useTranslation();
  // const { token, login, logout, userId } = useAuth()
  // const isAuthenticated = !!token
  // const routes = useRoutes(isAuthenticated)

  return (
    <div className="App">
      {/* <AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated }}> */}
      <Routes>

        <Route path="/" element={<HeaderContent />}>

            <Route path="/" element={<GlobalLayout />}>
              <Route index element={<FrontPage />} />
              <Route path="/Registration" element={<LoginPage />} />
              <Route path="/Location" element={<Location />} />
        {/* Arthur Development! */}
              <Route path="/Location" element={<Location />} />
              <Route path="/Question" element={<Question />} />
            </Route>
        </Route>

        {/* Arthur Development! */}
              <Route path="/DataGridExample" element={<DataGridExample />} />
              <Route path="/GeoLocation" element={<GeoLocation />} />
            

      </Routes>

    </div>
  );
}
