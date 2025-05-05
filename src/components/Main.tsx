import React, {useState, ChangeEvent} from 'react';
import s from '../styles/main.module.css'
import {Link} from "react-router-dom";

const FIELDS = {
  NAME: 'username',
  ROOM: 'room'
}

const Main = () => {
  const {NAME, ROOM} = FIELDS
  const [values, setValues] = useState({[NAME]: '', [ROOM]: ''})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues(prev => ({...prev, [name]: value}))
  }
  const handelClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const isDisabled = Object.values(values).some(el => !el)
    if (isDisabled) {
      e.preventDefault()
    }
  }
  return (
    <div className={s.wrap}>
      <div className={s.container}>
        <h1 className={s.heading}>Join</h1>
        <form className={s.form} action="">
          <div className={s.group}>
            <input type="text" className={s.input} value={values[NAME]} name={'username'} onChange={handleChange}
                   autoComplete={"off"} placeholder={'Username'}/>
          </div>
          <div className={s.group}>

            <input type="text" className={s.input} value={values[ROOM]} name={'room'} onChange={handleChange}
                   autoComplete={"off"}
                   placeholder={'Room'} required/>
          </div>
          <Link
            onClick={handelClick}
            className={s.group}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
            <button type={"submit"} className={s.button}>
              Sign In
            </button>
          </Link>
        </form>
      </div>

    </div>
  );
};

export default Main;