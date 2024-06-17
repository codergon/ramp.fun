import { useEffect, useRef } from "react";
import "./preloader.scss";
import gsap from "gsap";

const Preloader = () => {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  iconRefs.current = [];

  useEffect(() => {
    const delay = 0.4;
    const duration = 0.2;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: delay - duration });

    iconRefs.current.forEach((icon, index) => {
      tl.to(
        icon,
        {
          duration,
          opacity: 0,
          ease: "power1.inOut",
        },
        (iconRefs.current.length - index) * delay
      );
    });

    // console.log(tl.totalDuration());
  }, []);

  const addToRefs = (el: any) => {
    if (el && !iconRefs.current.includes(el)) {
      iconRefs.current.push(el);
    }
  };

  return (
    <div className="preloader">
      <div className="icons">
        <div className="icon">✨</div>

        {["☘️", "🦅", "🚀", "🔥", "😈"].map((icon, index) => {
          return (
            <div key={index} ref={addToRefs} className="icon">
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Preloader;
