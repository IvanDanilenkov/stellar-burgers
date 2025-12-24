import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      // orderBurgerApi возвращает объект, внутри которого есть order
      return data.order as TOrder;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Order error'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = String(
          action.payload ?? action.error.message ?? 'Order error'
        );
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
