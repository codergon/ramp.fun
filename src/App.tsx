import { gsap } from "gsap";

import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Topbar from "components/app/topbar";
import Preloader from "components/app/preloader";
import BaseToast from "components/app/base-toast";

import Home from "pages/home/home";
import TokenPage from "pages/token/token";
import CreateToken from "pages/create-token/create-token";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    gsap.set(mainRef.current, { opacity: 0 });

    const handleLoading = setTimeout(() => {
      setLoading(false);

      const duration = 0.5;
      const tl = gsap.timeline();

      gsap.fromTo(
        mainRef.current,
        {
          y: -60,
          opacity: 0,
        },
        {
          y: 0,
          duration,
          opacity: 1,
          clearProps: "all",
        }
      );

      gsap.to(mainRef.current, {
        duration,
        opacity: 1,
      });
    }, 1.5 * 1000);

    return () => clearTimeout(handleLoading);
  }, [location]);

  return (
    <>
      {loading && <Preloader />}

      <main ref={mainRef}>
        <div className="page-container">
          <div className="page-container__content">
            <Topbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-token" element={<CreateToken />} />
              <Route path="/:token" element={<TokenPage />} />
            </Routes>
          </div>
        </div>
      </main>

      <BaseToast />
    </>
  );
}

export default App;
