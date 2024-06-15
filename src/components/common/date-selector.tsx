import dayjs from "dayjs";
import { useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { ControlledMenu } from "@szhsin/react-menu";
import { CalendarDots } from "@phosphor-icons/react";

interface DateSelectorProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DateSelector = ({
  date: selected,
  setDate: setSelected,
}: DateSelectorProps) => {
  const menuRef = useRef(null);

  const [showDateMenu, setShowDateMenu] = useState(false);

  return (
    <>
      <div
        ref={menuRef}
        className="date-display"
        onClick={() => setShowDateMenu(!showDateMenu)}
      >
        <div className="date-display__text">
          <p>{dayjs(selected).format("dddd MMM D, YYYY")}</p>
        </div>

        <div className="date-display__icon">
          <CalendarDots size={20} weight="regular" />
        </div>
      </div>

      <ControlledMenu
        gap={6}
        transition
        align="end"
        overflow="auto"
        position="auto"
        direction="top"
        viewScroll="close"
        anchorRef={menuRef}
        menuClassName="app-menu date-menu"
        onClose={() => setShowDateMenu(false)}
        state={showDateMenu ? "open" : "closed"}
        menuStyle={{ minWidth: "300px", zIndex: 88888 }}
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          // DISABLE DATES BEFORE TODAY
          disabled={{ before: dayjs().add(1, "day").toDate() }}
        />
      </ControlledMenu>
    </>
  );
};

export default DateSelector;
