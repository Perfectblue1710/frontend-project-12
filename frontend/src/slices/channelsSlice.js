import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelsAPI } from '../services/api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.getChannels();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.createChannel(name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.renameChannel(id, name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      await channelsAPI.deleteChannel(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
addChannel: (state, action) => {
  const channelExists = state.channels.some((ch) => ch.id === action.payload.id);
  if (!channelExists) {
    state.channels.push(action.payload);
  }
},
    removeChannel: (state, action) => {
      const channelId = action.payload;
      state.channels = state.channels.filter(ch => ch.id !== channelId);
      if (state.currentChannelId === channelId && state.channels.length > 0) {
        state.currentChannelId = state.channels[0].id;
      }
    },
    renameChannelWS: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find(ch => ch.id === id);
      if (channel) {
        channel.name = name;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
state.loading = state.channels.length === 0;

        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
const channels = action.payload ?? [];
        state.channels = channels;
        if (!state.currentChannelId || !channels.some((ch) => ch.id === state.currentChannelId)) {
          state.currentChannelId = channels[0]?.id ?? null;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        const channelExists = state.channels.some((ch) => ch.id === action.payload.id);
        if (!channelExists) {
          state.channels.push(action.payload);
        }
        state.currentChannelId = action.payload.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(renameChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.loading = false;
        const { id, name } = action.payload;
        const channel = state.channels.find(ch => ch.id === id);
        if (channel) {
          channel.name = name;
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading = false;
        const channelId = action.payload;
        state.channels = state.channels.filter(ch => ch.id !== channelId);
        if (state.currentChannelId === channelId && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id;
        }
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentChannel, clearError, addChannel, removeChannel, renameChannelWS } = channelsSlice.actions;
export default channelsSlice.reducer;
