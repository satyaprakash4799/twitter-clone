import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/interfaces";
import apiClient from "../../hooks/apiCaller";

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<IUser>(
  "currentUser/fetchUser",
  async () => {
    const { data } = await apiClient.get(`/user`);
    return data?.user as IUser;
  }
);
export const fetchUser = createAsyncThunk<IUser, string>(
  "user/fetchUser",
  async (userId: string) => {
    const { data } = await apiClient.get(`/user/${userId}`);
    console.log(data)
    return data?.user as IUser;
  }
);

const currentUser = createSlice({
  name: "currentUser",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        console.log(action)
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default currentUser.reducer;
const userReducer = user.reducer;
export { userReducer };
