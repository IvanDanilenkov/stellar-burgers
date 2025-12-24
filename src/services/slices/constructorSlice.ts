import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const makeConstructorId = () => crypto.randomUUID();

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push({
        ...ingredient,
        id: makeConstructorId()
      });
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;

      // 1) Защита от выхода за границы массива
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }

      // 2) Достаём элемент из позиции fromIndex
      const movedItem = state.ingredients[fromIndex];

      // 3) Удаляем его из массива
      state.ingredients.splice(fromIndex, 1);

      // 4) Вставляем в новую позицию
      state.ingredients.splice(toIndex, 0, movedItem);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export default constructorSlice.reducer;
