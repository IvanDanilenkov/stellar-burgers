import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useSelector } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  // 1) Берём полный список ингредиентов из стора (он нужен, чтобы из id собрать объекты)
  const ingredients = useSelector(
    (state) => state.ingredients.items
  ) as TIngredient[];

  // 2) Собираем "расширенную" инфу о заказе: ингредиенты, цена, дата и т.д.
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // превращаем массив id ингредиентов заказа -> массив объектов ингредиентов
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], itemId: string) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // считаем общую стоимость
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // показываем только первые 6 ингредиентов (остальные уходят в "+N")
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
