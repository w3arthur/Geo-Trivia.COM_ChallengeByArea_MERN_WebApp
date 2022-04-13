import React from "react";
import { Route, Router } from "react-router-dom";
import LanguageFlags from "../Multilanguage/LanguageFlags";
import { useTranslation } from 'react-i18next';
import './header.css';

export default function HeaderContent () {

 const { t } = useTranslation();

 return(
 <div className="header"><LanguageFlags />
{/* 
 <Router >
     <Route>

     </Route>
 </Router>
 */}
 </div>
 )}