import { Route } from "react-router-dom";
import ProtectedPage from "./protectedPage";
import UsersPage from "../pages/UserPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import LockPage from "../pages/LockPage";
import LockHistoryPage from "../pages/LockHistoryPage";

const routeDefinitions = [
  {
    key: "LoginPage",
    path: "/login",
    element: (
      <ProtectedPage guestOnly={true}>
        <LoginPage />
      </ProtectedPage>
    ),
  },
  {
    key: "RegisterPage",
    path: "/register",
    element: (
      <ProtectedPage guestOnly={true}>
        <RegisterPage />
      </ProtectedPage>
    ),
  },
  {
    key: "DashboardPage",
    path: "/",
    element: (
      <ProtectedPage needLogin={true}>
        <DashboardPage />
      </ProtectedPage>
    ),
  },
  {
    key: "UsersPage",
    path: "/user",
    element: (
      <ProtectedPage needLogin={true}>
        <UsersPage />
      </ProtectedPage>
    ),
  },
  {
    key: "LocksPage",
    path: "/lock",
    element: (
      <ProtectedPage needLogin={true}>
        <LockPage />
      </ProtectedPage>
    ),
  },
  {
    key: "HistoryLocksPage",
    path: "/lock/history/:lockId",
    element: (
      <ProtectedPage needLogin={true}>
        <LockHistoryPage />
      </ProtectedPage>
    ),
  },
];

const routes = routeDefinitions.map(({ key, path, element }) => (
  <Route key={key} path={path} element={element} />
));

export default routes;
