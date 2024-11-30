import {createBrowserRouter} from "react-router-dom";
import Root from "../views/root/Root";
import SignIn from "../views/root/signIn/SignIn";
import {NotAuthenticatedRoute, ProtectedRoute} from "../hooks/auth";
import Home from "../views/home/Home";
import Profile from "../views/profile/Profile";
import Follow from "../views/follow/Follow";
import SignUp from "../views/root/signup/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NotAuthenticatedRoute>
        <Root/>
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        path: "sign-up",
        element: (
          <NotAuthenticatedRoute>
            <SignUp/>
          </NotAuthenticatedRoute>
        ),
      },
      {
        path: "sign-in",
        element: (
          <NotAuthenticatedRoute>
            <SignIn/>
          </NotAuthenticatedRoute>
        ),
      },
    ],
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/:username",
    element: (
      <ProtectedRoute>
        <Profile/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/:username/followers",
    element: (
      <ProtectedRoute>
        <Follow/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/:username/followings",
    element: (
      <ProtectedRoute>
        <Follow/>
      </ProtectedRoute>
    ),
  },
]);

export default router;
