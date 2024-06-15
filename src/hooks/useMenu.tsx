import { FC, ReactElement, useState } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";

interface IUseAppMenu {
  items: string[];
  menuClass?: string;
  uppercase?: boolean;
  direction?: "top" | "bottom";
  defaultOption?: string | null;
  align?: "start" | "center" | "end";
  toggleCallback?: (value: any) => any;
}

type UseAppMenu = (
  props: IUseAppMenu
) => [FC<{ children: ReactElement }>, string];

const useAppMenu: UseAppMenu = ({
  items,
  menuClass,
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
          {items?.map((slug, ind) => (
            <MenuItem
              key={ind}
              value={slug}
              className="menu-item"
              data-active={slug === activeOption}
            >
              <p
                style={{
                  textTransform: uppercase ? "uppercase" : "capitalize",
                }}
              >
                {slug.replace(/_/g, " ").replace("testnet", "")}
              </p>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return [AppMenu, activeOption];
};

export default useAppMenu;
