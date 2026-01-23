import reducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice async reducer', () => {
  it('pending: isLoading становится true и error сбрасывается', () => {
    const state = reducer(undefined, fetchIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: записывает items и выключает isLoading', () => {
    const mockItems = [
      { _id: '1', name: 'Ингредиент 1', type: 'main', price: 10 },
      { _id: '2', name: 'Ингредиент 2', type: 'bun', price: 20 }
    ] as any;

    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(mockItems, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockItems);
    expect(state.error).toBeNull();
  });

  it('rejected: записывает error и выключает isLoading', () => {
    const errorMessage = 'Network error';

    const state = reducer(
      undefined,
      fetchIngredients.rejected(new Error(errorMessage), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
