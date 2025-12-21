import { FC, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  // 1) number из URL всегда строка
  const { number } = useParams<{ number: string }>();

  // 2) определяем, из какой страницы пришли
  const { pathname } = useLocation();
  const isFeedPage = pathname.startsWith('/feed');
  const isProfileOrdersPage = pathname.startsWith('/profile/orders');

  // 3) ингредиенты (общий справочник)
  const ingredients = useSelector(
    (state) => state.ingredients.items
  ) as TIngredient[];

  // 4) источники заказов
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);

  // 5) находим заказ по номеру в нужной ветке
  const orderData = useMemo(() => {
    const orderNumber = Number(number);
    if (!orderNumber) return null;

    if (isFeedPage) {
      return feedOrders.find((o) => o.number === orderNumber) ?? null;
    }

    if (isProfileOrdersPage) {
      return profileOrders.find((o) => o.number === orderNumber) ?? null;
    }

    // запасной вариант: если маршрут вдруг другой, пробуем найти хоть где-то
    return (
      feedOrders.find((o) => o.number === orderNumber) ??
      profileOrders.find((o) => o.number === orderNumber) ??
      null
    );
  }, [number, isFeedPage, isProfileOrdersPage, feedOrders, profileOrders]);

  // 6) готовим данные для UI
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = { ...ingredient, count: 1 };
          }
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
