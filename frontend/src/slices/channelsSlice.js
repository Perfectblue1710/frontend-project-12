import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
  loading: false,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
      if (!state.currentChannelId && action.payload.length > 0) {
        state.currentChannelId = action.payload[0].id;
      }
    },
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(ch => ch.id !== action.payload);
      if (state.currentChannelId === action.payload && state.channels.length > 0) {
        state.currentChannelId = state.channels[0].id;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find(ch => ch.id === id);
      if (channel) {
        channel.name = name;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChannels,
  setCurrentChannel,
  addChannel,
  removeChannel,
  renameChannel,
  setLoading,
  setError,
} = channelsSlice.actions;

export default channelsSlice.reducer;
