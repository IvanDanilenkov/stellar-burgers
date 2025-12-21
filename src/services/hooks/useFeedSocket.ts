import { useEffect } from 'react';
import { useDispatch } from '../store';
import {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  wsClear
} from '../slices/feedSlice';

export const useFeedSocket = (url: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1) Говорим стору: "пытаемся подключиться"
    dispatch(wsConnecting());

    // 2) Открываем WebSocket соединение
    const socket = new WebSocket(url);

    // 3) Когда соединение открыто
    socket.onopen = () => {
      dispatch(wsOpen());
    };

    // 4) Если случилась ошибка соединения
    socket.onerror = () => {
      dispatch(wsError('WebSocket error'));
    };

    // 5) Когда пришло сообщение (обычно JSON со списком заказов)
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(wsMessage(data));
      } catch {
        dispatch(wsError('Invalid WebSocket message'));
      }
    };

    // 6) Когда сокет закрылся
    socket.onclose = () => {
      dispatch(wsClose());
    };

    // 7) cleanup: когда страница размонтировалась (ушли с /feed)
    return () => {
      socket.close();
      dispatch(wsClear());
    };
  }, [dispatch, url]);
};
