import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrderModal } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
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
