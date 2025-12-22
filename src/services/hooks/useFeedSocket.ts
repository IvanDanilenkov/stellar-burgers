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

export const useFeedSocket = (url: string, reconnectKey = 0) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(wsConnecting());

    const socket = new WebSocket(url);

    socket.onopen = () => {
      dispatch(wsOpen());
    };

    socket.onerror = () => {
      dispatch(wsError('WebSocket error'));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(wsMessage(data));
      } catch {
        dispatch(wsError('Invalid WebSocket message'));
      }
    };

    socket.onclose = () => {
      dispatch(wsClose());
    };

    return () => {
      socket.close();
      dispatch(wsClear());
    };
  }, [dispatch, url, reconnectKey]);
};
