import React from 'react';
import s from "../styles/app.module.css"
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <div className={s.container}>
      <AppRoutes/>
    </div>
  );
}

export default App;
