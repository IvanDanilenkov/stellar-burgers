import reducer, { addIngredient, removeIngredient } from './constructorSlice';

describe('constructorSlice reducer', () => {
  it('обрабатывает добавление булки: записывает bun и не добавляет в ingredients', () => {
    const bun = {
      _id: 'bun_1',
      name: 'Булка',
      type: 'bun',
      price: 100
    } as any;

    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает добавление начинки: добавляет элемент в ingredients и присваивает id', () => {
    const filling = {
      _id: 'main_1',
      name: 'Начинка',
      type: 'main',
      price: 10
    } as any;

    const state = reducer(undefined, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(filling);
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('обрабатывает удаление ингредиента по id', () => {
    const filling1 = {
      _id: 'm1',
      name: 'Начинка 1',
      type: 'main',
      price: 10
    } as any;
    const filling2 = {
      _id: 'm2',
      name: 'Начинка 2',
      type: 'main',
      price: 20
    } as any;

    const state1 = reducer(undefined, addIngredient(filling1));
    const state2 = reducer(state1, addIngredient(filling2));

    const idToRemove = state2.ingredients[0].id;

    const state3 = reducer(state2, removeIngredient(idToRemove));

    expect(state3.ingredients).toHaveLength(1);
    expect(state3.ingredients[0].id).not.toBe(idToRemove);
  });
});
