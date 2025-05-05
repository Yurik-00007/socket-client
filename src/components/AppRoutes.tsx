import React from 'react';
import {Route, Routes} from "react-router-dom";
import Main from "./Main";
import Chat1 from "./Chat1";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Main/>}/>
      <Route path={'/chat'} element={<Chat1/>}/>
    </Routes>
  );
};

export default AppRoutes;