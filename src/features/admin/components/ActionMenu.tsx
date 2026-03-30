import React, { useState, useEffect, useRef } from "react";

interface Action {
  label: string;
  icon: string;
  onClick: () => void;
  className?: string;
}

interface ActionMenuProps {
  actions: Action[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <button
          onClick={handleToggle}
          className="w-8 h-8 rounded bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 hover:text-white transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">
            more_vert
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#2f2f2f] ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {actions.map((action, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 ${action.className}`}
                role="menuitem"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {action.icon}
                </span>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
