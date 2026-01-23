import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('возвращает начальное состояние при UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toBeDefined();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
  });
});
