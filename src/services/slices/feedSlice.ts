import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  status: 'offline' | 'connecting' | 'online';
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TFeedState = {
  status: 'offline',
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

type TFeedMessage = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedSlice = createSlice({
  name: 'feed',
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
    wsMessage: (state, action: PayloadAction<TFeedMessage>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsClear: (state) => {
      state.status = 'offline';
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
    }
  }
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage, wsClear } =
  feedSlice.actions;

export default feedSlice.reducer;
