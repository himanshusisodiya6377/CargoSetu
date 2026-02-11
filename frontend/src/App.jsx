import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home,Layout} from "./routes";

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
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
