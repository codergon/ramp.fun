import { Route, Routes } from "react-router-dom";

import Topbar from "components/app/topbar";
import BaseToast from "components/app/base-toast";

import Home from "pages/home/home";
import CreateToken from "pages/create-token/create-token";

function App() {
  return (
    <>
      <main>
        <div className="page-container">
          <div className="page-container__content">
            <Topbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-token" element={<CreateToken />} />
            </Routes>
          </div>
        </div>
      </main>

      <BaseToast />
    </>
  );
}

export default App;
