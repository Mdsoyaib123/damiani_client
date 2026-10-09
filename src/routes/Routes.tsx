import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Services from "@/pages/Services";
// import ForgotPassword from "@/pages/ForgotPassword";
import Index from "@/pages/Index";
import Task from "@/pages/Task";
import BindAccount from "@/pages/BindAccount";
import OrderRecord from "@/pages/OrderRecord";
import Product from "@/pages/Product";
import CheckIn from "@/pages/CheckIn";
import ChangePassword from "@/pages/ChangePassword";
import CashOut from "@/pages/CashOut";
import History from "@/pages/History";
import Help from "@/pages/Help";
import Score from "@/pages/Score";
import WithdrawPassword from "@/pages/WithdrawPassword";
import Event from "@/pages/Event";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/event",
        element: <Event />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/score",
        element: <Score />,
      },
      {
        path: "/check-in",
        element: <CheckIn />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ChangePassword />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/index",
        element: <Index />,
      },
      {
        path: "/task",
        element: <Task />,
      },
      {
        path: "/bind-account",
        element: <BindAccount />,
      },
      {
        path: "/order-record",
        element: <OrderRecord />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/cash-out",
        element: <CashOut />,
      },
      {
        path: "/withdraw-password",
        element: <WithdrawPassword />,
      },

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
