import { Route, Routes } from "react-router-dom";

import Topbar from "components/app/topbar";
import BaseToast from "components/app/base-toast";

import Home from "pages/home/home";

function App() {
  return (
    <>
      <main>
        <div className="page-container">
          <div className="page-container__content">
            <Topbar />

            <Routes>
              <Route path="/auth" element={<Home />} />
            </Routes>
          </div>
        </div>
      </main>

      <BaseToast />
    </>
  );
}

export default App;
