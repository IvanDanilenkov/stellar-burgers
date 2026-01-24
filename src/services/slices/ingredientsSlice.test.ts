import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

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

describe('ingredientsSlice async reducer', () => {
  it('pending: isLoading становится true и error сбрасывается', () => {
    const state = reducer(undefined, fetchIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: записывает items и выключает isLoading', () => {
    const mockItems = [
      makeIngredient({ _id: '1', name: 'Ингредиент 1' }),
      makeIngredient({ _id: '2', name: 'Ингредиент 2', type: 'bun' })
    ];

    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(mockItems, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockItems);
    expect(state.error).toBeNull();
  });

  it('rejected: записывает error и выключает isLoading', () => {
    const state = reducer(
      undefined,
      fetchIngredients.rejected(new Error('Network error'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});
