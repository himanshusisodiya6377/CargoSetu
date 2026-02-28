import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home,Layout} from "./routes";
import LiveAuctions from "./pages/LiveAuction";

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
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
