import { FC, useMemo } from 'react';

import { useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';

import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );

  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // TODO: здесь позже будет dispatch(thunk оформления заказа)
  };

  const closeOrderModal = () => {
    // TODO: позже будет dispatch(action закрытия модалки)
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;

    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
