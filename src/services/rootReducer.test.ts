import { rootReducer } from './rootReducer';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при UNKNOWN_ACTION', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const expectedState = {
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      profileOrders: profileOrdersReducer(undefined, unknownAction)
    };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(expectedState);
  });
});
