import Modal from "react-modal";
import { ReactNode, ReactElement, createContext } from "react";

import { useApp } from "contexts";
import { Modals } from "./AppProvider";
import CreateTokenModal from "components/modals/create-token";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const { modalStatus, setModalStatus, activeModal, setActiveModal } = useApp();

  const openModal = (modal: Modals = "create-token") => {
    setActiveModal(modal);
    setModalStatus(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setModalStatus(false);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,

        openModal,
        closeModal,
      }}
    >
      <>
        <Modal
          style={customStyles}
          isOpen={modalStatus}
          onRequestClose={closeModal}
          bodyOpenClassName={"modal-open"}
        >
          {activeModal === "create-token" ? (
            <CreateTokenModal />
          ) : //
          null}
        </Modal>

        {children}
      </>
    </ModalContext.Provider>
  );
};

export default ModalProvider;

interface ModalProviderProps {
  children: ReactElement[] | ReactElement | ReactNode;
}

interface ModalContextType {
  activeModal: string;

  closeModal: () => void;
  openModal: (modal?: Modals) => void;
}

export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
);
