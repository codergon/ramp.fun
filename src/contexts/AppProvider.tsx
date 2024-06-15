import { isIOS } from "react-device-detect";
import {
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  createContext,
} from "react";

export type Modals = "create-token";

const AppProvider = ({ children }: AppProviderProps) => {
  // DISABLE ZOOM ON MOBILE
  useEffect(() => {
    // ADD SAFE AREA FOR IOS PWA
    if (window.matchMedia("(display-mode: standalone)").matches && isIOS) {
      document.body.style.paddingBottom = "20px";
    }

    window.addEventListener(
      "touchmove",
      function (event) {
        // @ts-ignore
        if (event.touches.length > 1 && event.scale !== 1) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { passive: false }
    );

    return () => {
      window.removeEventListener("touchmove", function (event) {
        // @ts-ignore
        if (event.touches.length > 1 && event.scale !== 1) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
    };
  }, []);

  // MODAL STATE
  const [modalStatus, setModalStatus] = useState(false);
  const [activeModal, setActiveModal] = useState<Modals>("create-token");

  return (
    <AppContext.Provider
      value={{
        //

        // MODAL STATE
        modalStatus,
        activeModal,
        setModalStatus,
        setActiveModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

interface AppProviderProps {
  children: ReactElement[] | ReactElement | ReactNode;
}

interface AppContextType {
  // MODAL STATE
  modalStatus: boolean;
  activeModal: Modals;
  setActiveModal: (modal: Modals) => void;
  setModalStatus: (status: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
