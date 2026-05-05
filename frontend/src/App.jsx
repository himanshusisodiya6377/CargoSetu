import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home,Layout,PrivateRoute,DashboardLayout,UserProfile, Income,LoadList} from "./routes/index";
import {Dashboard} from "./pages/Dashboard/Dashboard"
import LiveAuctions from "./pages/LiveAuction";
import { Login,Register} from "./routes";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLogInStatus} from "./redux/features/authSlice";
import { LoginAsSender } from "./pages/auth/LoginAsSender";
import UserList from "./admin/UserList";
import AddLoad from "./pages/product/AddLoad";
import { LoadEdit } from "./pages/product/LoadEdit";
import {LoadDetailsPage} from "../src/pages/product/LoadDetailsPage"
import WinningBidList from "./pages/product/WinningBidList";
import ActiveLoads from "./pages/ActiveLoads";
import MyBids from "./pages/product/MyBids";
import CompletedLoads from "./pages/CompletedLoads";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import AdminLoadManagement from "./admin/product/AdminLoadManagement";

function App() {
 
   const dispatch = useDispatch();

   useEffect(() => {
    dispatch(getLogInStatus());   
  }, []);

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
          <Route path="/about" element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route path="/services" element={
              <Layout>
                <Services />
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
           <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
            <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sender/login"
            element={
              <Layout>
                <LoginAsSender />
              </Layout>
            }
          />
          <Route
            path="/admin/income"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <Income/>
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
           <Route
            path="/userlist"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <UserList/>
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <AddLoad />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/load"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <LoadList />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
           <Route
            path="/product/update/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <LoadEdit/>
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/load/:id"
            element={
              <Layout>
                <LoadDetailsPage/>
              </Layout>
            }
          />
          <Route
             path="/winning-products"
             element={
               <PrivateRoute>
                 <Layout>
                   <DashboardLayout>
                     <WinningBidList />
                   </DashboardLayout>
                 </Layout>
               </PrivateRoute>
            }
           />
           <Route
             path="/active-loads"
             element={
               <PrivateRoute>
                 <Layout>
                   <DashboardLayout>
                     <ActiveLoads />
                   </DashboardLayout>
                 </Layout>
               </PrivateRoute>
             }
           />
           <Route
             path="/completed-loads"
             element={
               <PrivateRoute>
                 <Layout>
                   <DashboardLayout>
                     <CompletedLoads />
                   </DashboardLayout>
                 </Layout>
               </PrivateRoute>
             }
           />
           <Route
             path="/my-bids"
             element={
               <PrivateRoute>
                 <Layout>
                   <DashboardLayout>
                     <MyBids />
                   </DashboardLayout>
                 </Layout>
               </PrivateRoute>
             }
           />
           <Route
             path="/product/admin"
             element={
               <PrivateRoute>
                 <Layout>
                   <DashboardLayout>
                     <AdminLoadManagement />
                   </DashboardLayout>
                 </Layout>
               </PrivateRoute>
             }
           />
      </Routes>  
    </BrowserRouter>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
