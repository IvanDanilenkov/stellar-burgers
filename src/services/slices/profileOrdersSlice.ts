import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  status: 'offline' | 'connecting' | 'online';
  orders: TOrder[];
  error: string | null;
};

const initialState: TProfileOrdersState = {
  status: 'offline',
  orders: [],
  error: null
};

type TOrdersMessage = {
  orders: TOrder[];
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    wsOpen: (state) => {
      state.status = 'online';
      state.error = null;
    },
    wsClose: (state) => {
      state.status = 'offline';
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsMessage: (state, action: PayloadAction<TOrdersMessage>) => {
      state.orders = action.payload.orders;
    },
    wsClear: (state) => {
      state.status = 'offline';
      state.orders = [];
      state.error = null;
    }
  }
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage, wsClear } =
  profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
