import React from "react";
import LanguageFlags from "../multilanguage/LanguageFlags";
import { useTranslation } from 'react-i18next';
import './header.css';

import { Outlet } from "react-router-dom";

export default function HeaderContent () {

 const { t } = useTranslation();

 return(<>
  <div className="logo">
      <LanguageFlags />
 </div>

<Outlet/>
 
 </>);}