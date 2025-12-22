import { FC, useState } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useSelector } from '../../services/store';
import { useFeedSocket } from '../../services/hooks/useFeedSocket';

export const Feed: FC = () => {
  const [reconnectKey, setReconnectKey] = useState(0);

  useFeedSocket('wss://norma.education-services.ru/orders/all', reconnectKey);

  const orders = useSelector((state) => state.feed.orders);
  const status = useSelector((state) => state.feed.status);

  const handleGetFeeds = () => {
    setReconnectKey((prev) => prev + 1);
  };

  if (status !== 'online') {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
