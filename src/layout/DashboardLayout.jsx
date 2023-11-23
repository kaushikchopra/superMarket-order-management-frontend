import { useState } from "react";
import Topbar from "../scenes/global/Topbar";
import SideBar from "../scenes/global/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="app">
      <SideBar
        handleToggleSidebar={handleToggleSidebar}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main
        className="content"
        style={{
          marginLeft: isCollapsed ? "25px" : undefined,
          transition: "width 0.2s ease",
        }}
      >
        <Topbar handleToggleSidebar={handleToggleSidebar} />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
