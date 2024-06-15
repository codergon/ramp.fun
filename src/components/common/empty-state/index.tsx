import "./empty-state.scss";
import {
  Tabs,
  XCircle,
  StackSimple,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { BarLoader } from "react-spinners";

interface EmptyStateProps {
  error?: any;
  isLoading?: boolean;
  icon?: React.ReactNode;
  data?: {
    message?: string;
    loadingText?: string;
    errorMessage?: string;
  };
}

const defaultIconSize = 60;
const StatusIcons = ({ type = "empty", iconSize = defaultIconSize }) => {
  return type === "empty" ? (
    <StackSimple size={iconSize} weight="regular" color="#bbb" />
  ) : type === "error" ? (
    <XCircle size={iconSize} weight="fill" color="#ff5c5c" />
  ) : type === "success" ? (
    <CheckCircle size={iconSize} weight="fill" color="#16f19d" />
  ) : type === "warning" ? (
    <WarningCircle size={iconSize} weight="fill" color="#eba267" />
  ) : null;
};

const EmptyState = ({ data, icon, error, isLoading }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div
          style={{
            minHeight: defaultIconSize + "px",
          }}
          className="empty-state__content--icons"
        >
          {isLoading ? (
            <>
              <BarLoader color={"#888"} aria-label="Loading Spinner" />
            </>
          ) : error ? (
            <StatusIcons type="error" />
          ) : !error && !isLoading ? (
            icon ?? <StatusIcons type="empty" />
          ) : null}
        </div>

        <p className="empty-state__text">
          {isLoading
            ? data?.loadingText || "Loading..."
            : error
              ? data?.errorMessage || error?.message || "An error occurred"
              : data?.message ?? "Nothing to see here"}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
