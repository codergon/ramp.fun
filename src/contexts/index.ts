import { useContext } from "react";
import { AppContext } from "./AppProvider";
import { ModalContext } from "./ModalProvider";

const useApp = () => {
  const value = useContext(AppContext);
  if (import.meta.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useApp must be wrapped in a <AppProvider />");
    }
  }
  return value;
};

const useModal = () => {
  const value = useContext(ModalContext);
  if (import.meta.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useModal must be wrapped in a <ModalProvider />");
    }
  }
  return value;
};

export { useApp, useModal };
