import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPage, IPagination, IUser } from "../../types/interfaces";
import apiClient from "../../hooks/apiCaller";

interface CurrentUserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

interface IFollow extends IPagination<IUser> {
  users: IUser[];
}

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  followers: IFollow;
  followersLoading: boolean;
  followersError: string | null;
  followings: IFollow;
  followingsLoading: boolean;
  followingsError: string | null;
}

const initFollowState: IFollow = {
  currentPage: 0,
  limit: 0,
  totalItems: 0,
  totalPages: 0,
  users: [],
};

const initialStateCurrentUser: CurrentUserState = {
  user: null,
  loading: false,
  error: null,
};
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  followers: initFollowState,
  followersLoading: false,
  followersError: null,
  followings: initFollowState,
  followingsLoading: false,
  followingsError: null,
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
    return data?.user as IUser;
  }
);

export const fetchFollowers = createAsyncThunk<
  IFollow,
  {
    userId: string;
    iPage: IPage;
  }
>(
  "user/followers",
  async ({ userId, iPage }: { userId: string; iPage: IPage }) => {
    const { data } = await apiClient.get(
      `follow/${userId}/followers?page=${iPage.page}&limit=${iPage.limit}`
    );
    return data;
  }
);

export const fetchFollowings = createAsyncThunk<
  IFollow,
  {
    userId: string;
    iPage: IPage;
  }
>(
  "user/followings",
  async ({ userId, iPage }: { userId: string; iPage: IPage }) => {
    const { data } = await apiClient.get(
      `follow/${userId}/followings?page=${iPage.page}&limit=${iPage.limit}`
    );
    return data;
  }
);

const currentUserSlicer = createSlice({
  name: "currentUser",
  initialState: initialStateCurrentUser,
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

const userSlicer = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearFollowers(state) {
      state.followers = initFollowState;
    },
    clearFollowings(state) {
      state.followings = initFollowState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchFollowers.pending, (state) => {
        state.followersLoading = true;
        state.followersError = null;
      })
      .addCase(
        fetchFollowers.fulfilled,
        (state, action: PayloadAction<IFollow>) => {
          // state.followers = action.payload;
          const { users }: IFollow = action.payload;
          state.followersLoading = false;
          state.followers = {
            ...action.payload,
            users: [...state.followers.users, ...users],
          };
        }
      )
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.followersLoading = false;
        state.followersError = action.error.message || "Something went wrong";
      })
      .addCase(fetchFollowings.pending, (state) => {
        state.followingsLoading = true;
        state.followingsError = null;
      })
      .addCase(
        fetchFollowings.fulfilled,
        (state, action: PayloadAction<IFollow>) => {
          const { users } = action.payload;
          // state.followings = action.payload;
          state.followingsLoading = false;
          state.followings = {
            ...action.payload,
            users: [...state.followings.users, ...users],
          };
        }
      )
      .addCase(fetchFollowings.rejected, (state, action) => {
        state.followingsLoading = false;
        state.followingsError = action.error.message || "Something went wrong";
      });
  },
});
export const { clearFollowers, clearFollowings } = userSlicer.actions;
export default currentUserSlicer.reducer;
export const userReducer = userSlicer.reducer;
