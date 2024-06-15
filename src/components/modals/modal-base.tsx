import React from "react";

interface ModalBaseProps {
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ children }) => {
  return <div className="base-modal">{children}</div>;
};

export default ModalBase;
