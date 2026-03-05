import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home,Layout,PrivateRoute,Dashboard} from "./routes";
import LiveAuctions from "./pages/LiveAuction";
import { Login,Register} from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
         <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/auction" element={
              <Layout>
                <LiveAuctions />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
      </Routes>
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
    </>
  )
}

export default App
