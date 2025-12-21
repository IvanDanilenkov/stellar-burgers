import { FC } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useSelector } from '../../services/store';
import { useFeedSocket } from '../../services/hooks/useFeedSocket';

export const Feed: FC = () => {
  // 1) Подключаемся к публичному WebSocket каналу ленты
  useFeedSocket('wss://norma.education-services.ru/orders/all');

  // 2) Берём заказы из Redux
  const orders = useSelector((state) => state.feed.orders);

  // 3) Пока данных нет — показываем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {};

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
