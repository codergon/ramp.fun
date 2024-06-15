import { FC, ReactElement, useState } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";

interface IUseAppMenu {
  items: {
    [key: string]: any;
  }[];
  objecKey?: string;
  defaultOption?: any;

  menuClass?: string;
  uppercase?: boolean;
  direction?: "top" | "bottom";
  align?: "start" | "center" | "end";
  toggleCallback?: (value: any) => any;
}

type UseAppMenu = (props: IUseAppMenu) => [FC<{ children: ReactElement }>, any];

const useAppObjMenu: UseAppMenu = ({
  items,
  menuClass,
  objecKey = "",
  toggleCallback,
  align = "start",
  uppercase = false,
  direction = "top",
  defaultOption = null,
}) => {
  const [activeOption, setActiveOption] = useState(defaultOption || items[0]);

  const AppMenu: FC<{ children: ReactElement }> = ({ children }) => {
    return (
      <div className="app-menu__container">
        <Menu
          transition
          align={align}
          direction={direction}
          menuButton={children}
          menuClassName={`app-menu ${menuClass ? menuClass : ""}`}
          onItemClick={(e) => {
            setActiveOption(e.value);
            toggleCallback && toggleCallback(e.value);
          }}
        >
          {items?.map((obj, ind) => (
            <MenuItem
              key={ind}
              value={obj}
              className="menu-item"
              data-active={obj[objecKey] === activeOption[objecKey]}
            >
              <p
                style={{
                  textTransform: uppercase ? "uppercase" : "capitalize",
                }}
              >
                {obj[objecKey].replace(/_/g, " ").replace("testnet", "")}
              </p>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return [AppMenu, activeOption];
};

export default useAppObjMenu;
