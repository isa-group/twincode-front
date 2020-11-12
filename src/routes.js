import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Lobby from "./pages/Lobby";
import Playground from "./pages/Playground";
import Admin from "./pages/Admin";
import SessionDetails from "./pages/SessionDetails";
import ExerciseConfiguration from "./pages/ExerciseConfiguration";
import Reports from "./pages/Reports";
import IDE from "./pages/IDE";
import PageNotFound from "./pages/PageNotFound";

const routes = [
  {
    path: "/",
    component: Login,
    name: "Login",
    meta: { title: "Login - Twincode" },
  },
  {
    path: "/signup",
    component: Signup,
    name: "Signup",
    meta: { title: "Signup - Twincode" },
  },
  {
    path: "/lobby",
    component: Lobby,
    name: "Lobby",
    meta: { title: "Lobby - Twincode" },
  },
  {
    path: "/administration",
    component: Admin,
    name: "Administration",
    meta: { title: "Admin console - Twincode" },
  },
  {
    path: "/administration/sessions/:sessionName",
    component: SessionDetails,
    name: "Session details",
    meta: { title: "Admin console - Twincode" },
  },
  {
    path: "/administration/reports/:sessionName",
    component: Reports,
    name: "Reports of session",
    meta: { title: "Admin console - Twincode" },
  },
  {
    path: "/administration/exercises/:sessionName",
    component: ExerciseConfiguration,
    name: "Exercise configuration",
    meta: { title: "Admin console - Twincode" },
  },
  {
    path: "/rooms/:mode/:rid",
    component: Playground,
    name: "Playground",
    meta: { title: "Twincode" },
  },
  {
    path: "/playground",
    component: Playground,
    name: "Playground",
    meta: { title: "Playground - Twincode" },
  },
  {
    path: "/ide",
    component: IDE,
    name: "IDE",
    meta: { title: "IDE - Twincode" },
  },
  {
    path: "*",
    component: PageNotFound,
    name: "404",
    meta: { title: "Not found" },
  },
];

export default routes;
