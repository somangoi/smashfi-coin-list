"use client";

interface TabNavigationProps {
  activeTab: "all" | "favorites";
  onTabChange: (tab: "all" | "favorites") => void;
}
const Button = ({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active: boolean }) => {
  return (
    <button onClick={onClick} className={`px-2 font-bold cursor-pointer ${active ? "text-black" : "text-gray-300 hover:text-gray-400 transition-colors duration-100 "}`}>
      {children}
    </button>
  );
};

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={() => onTabChange("all")} active={activeTab === "all"}>
        All
      </Button>
      <Button onClick={() => onTabChange("favorites")} active={activeTab === "favorites"}>
        My favorite
      </Button>
    </div>
  );
}
