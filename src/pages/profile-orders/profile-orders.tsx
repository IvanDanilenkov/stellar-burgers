import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useProfileOrdersSocket } from '../../services/hooks/useProfileOrdersSocket';

export const ProfileOrders: FC = () => {
  useProfileOrdersSocket();
  const orders = useSelector((state) => state.profileOrders.orders);

  return <ProfileOrdersUI orders={orders} />;
};
