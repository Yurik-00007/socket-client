import {useLocation, useNavigate} from "react-router-dom";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import s from "../styles/chat.module.css";
import Messages from "./Messages";
import icon from "../images/emoji.svg";
import EmojiPicker from "emoji-picker-react";
import {io} from "socket.io-client";

export type MessageData = {
  user: { name: string };
  message: string;
};

const socket = io(process.env.REACT_APP_SOCKET_URL!);

const Chat1 = () => {

    const navigate = useNavigate()

    const [state, setState] = useState<MessageData[]>([])

    const {search} = useLocation()//возвращает объект location Например:
    const [params, setParams] = useState<Record<string, string>>({room: '', user: ''})
    const [message, setMessage] = useState<string>('')

    //Храним значение, которое открывает или закрывает окно смайликов
    const [isOpen, setIsOpen] = useState<boolean>(false)

    //Храним значение, количество users, приходит с сервера
    const [users, setUsers] = useState<number>(0)

// Следит за изменением строки запроса и при изменении отправляет новые параметры на сервер и сохраняет их
// в локальное состояние.
    useEffect(() => {
      // 1. Преобразуем строку запроса (например, "?room=123&user=Alice") в объект {room: '123', user: 'Alice'}
      const searchParams = Object.fromEntries(new URLSearchParams(search))
      // 2. Сохраняем параметры в состояние (например, в `params`)
      setParams(searchParams)
      // 3. Отправляем параметры на сервер через WebSocket
      socket.emit('join', searchParams)
      //socket.emit() — отправляет данные на сервер от клиента
    }, [search]);

    // console.log(params)

    useEffect(() => {
      const handleMessage = ({data}: { data: MessageData }) => setState((prev) => [...prev, data]);
      socket.on('message', handleMessage)// ← Здесь ловим ВСЕ сообщения
      //Проблема: socket.off() возвращает Socket, а нужно void
      return () => {
        //Проблема: socket.off() возвращает Socket, а нужно void
        socket.off('message', handleMessage);
        return undefined; // Явный возврат void
      };
    }, []);


    useEffect(() => {
      socket.on('room', ({data: {users}}) => setUsers(users.length))// ← Здесь ловим ВСЕ сообщения
      //Проблема: socket.off() возвращает Socket, а нужно void
      /*
            return () => {
              //Проблема: socket.off() возвращает Socket, а нужно void
              socket.off('message', handleMessage);
              return undefined; // Явный возврат void
            };
      */
    }, []);

    // console.log(state)

    const handelLeftRoom = () => {
      socket.emit('leftRoom', {params})
      navigate('/');
    }

    // Сохраняет введенные данные из input в локальное состояние message
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value)
    }

    // Добавляет выбранный смайлик в input и сохраняет в локальное состояние message
    const handelOnEmojiClick = ({emoji}: { emoji: string }) => {
      setMessage(`${message}${emoji}`)
    }

    // Обработчик формы. При нажатии на input type="submit"(кнопку) отменяет перезагрузку и из локального состояния message и params
    //{room: 'bla', user: 'bla'} и отчищает локального состояния message
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!message) return
      socket.emit('sendMessage', {message, params})
      setMessage('')
    }
    return (
      <div className={s.wrap}>
        <div className={s.header}>
          <div className={s.title}>
            {params?.room}
          </div>
          <div className={s.users}>
            {users} users in this room
          </div>
          <button className={s.left} onClick={handelLeftRoom}>
            Left the room
          </button>
        </div>
        <div className={s.massages}>
          <Messages name={params.name} messages={state}/>
        </div>
        <form action="" className={s.form} onSubmit={handleSubmit}>
          <div className={s.input}>
            <input
              type="text"
              name={'message'}
              placeholder={'What do you want to write to say?'}
              value={message}
              onChange={handleChange}
              autoComplete={"off"}
              required
            />
          </div>
          <div className={s.emoji}>
            <img src={icon} alt="" onClick={() => setIsOpen(!isOpen)}/>
            {isOpen && (<div className={s.emojies}>
              <EmojiPicker onEmojiClick={handelOnEmojiClick}/>
            </div>)}
          </div>
          <div className={s.button}>
            <input type="submit" value={'Send a message'}/>
          </div>
        </form>
      </div>
    );
  }
;

export default Chat1;