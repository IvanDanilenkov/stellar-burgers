import { useEffect } from 'react';
import { useDispatch } from '../store';
import { getCookie } from '../../utils/cookie';

import {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  wsClear
} from '../slices/profileOrdersSlice';

export const useProfileOrdersSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1) Достаём accessToken из cookie
    const rawToken = getCookie('accessToken');

    // token может быть "Bearer XXX"
    const token = rawToken?.startsWith('Bearer ')
      ? rawToken.slice(7)
      : rawToken;

    // 2) Если токена нет — даже не пытаемся подключиться
    if (!token) {
      dispatch(wsError('Нет accessToken для WebSocket'));
      return;
    }

    const url = `wss://norma.education-services.ru/orders?token=${token}`;

    dispatch(wsConnecting());
    const socket = new WebSocket(url);

    socket.onopen = () => dispatch(wsOpen());
    socket.onerror = () => dispatch(wsError('WebSocket error'));
    socket.onmessage = (event) => {
      try {
        dispatch(wsMessage(JSON.parse(event.data)));
      } catch {
        dispatch(wsError('Invalid WebSocket message'));
      }
    };
    socket.onclose = () => dispatch(wsClose());

    return () => {
      socket.close();
      dispatch(wsClear());
    };
  }, [dispatch]);
};
