import reducer, { addIngredient, removeIngredient } from './constructorSlice';
import { TIngredient } from '@utils-types';

const makeIngredient = (overrides: Partial<TIngredient>): TIngredient => ({
  _id: 'id',
  name: 'name',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_mobile: '',
  image_large: '',
  ...overrides
});

describe('constructorSlice reducer', () => {
  it('обрабатывает добавление булки: записывает bun и не добавляет в ingredients', () => {
    const bun = makeIngredient({ _id: 'bun_1', type: 'bun', name: 'Булка' });

    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает добавление начинки: добавляет элемент в ingredients и присваивает id', () => {
    const filling = makeIngredient({
      _id: 'main_1',
      type: 'main',
      name: 'Начинка'
    });

    const state = reducer(undefined, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(filling);
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('обрабатывает удаление ингредиента по id', () => {
    const filling1 = makeIngredient({ _id: 'm1', name: 'Начинка 1' });
    const filling2 = makeIngredient({ _id: 'm2', name: 'Начинка 2' });

    const state1 = reducer(undefined, addIngredient(filling1));
    const state2 = reducer(state1, addIngredient(filling2));

    const idToRemove = state2.ingredients[0].id;
    const state3 = reducer(state2, removeIngredient(idToRemove));

    expect(state3.ingredients).toHaveLength(1);
    expect(state3.ingredients[0].id).not.toBe(idToRemove);
  });
});
