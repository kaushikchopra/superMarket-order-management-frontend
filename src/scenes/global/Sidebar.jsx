import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const isActive = selected === title || location.pathname === to;

  useEffect(() => {
    // Delay setting the selected value after the component re-renders
    if (isActive) {
      setSelected(title);
    }
  }, [isActive, setSelected, title]);

  const handleClick = () => {
    if (isActive) {
      setSelected("");
    } else {
      setSelected(title);
    }
  };

  return (
    <MenuItem
      style={{
        color: isActive ? "#6870fa" : colors.grey[100],
      }}
      selected={isActive}
      onClick={handleClick}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SideBar = ({ handleToggleSidebar, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  // const handleToggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-menuitem-root": {
          background: "transparent !important",
        },
        "& .ps-menu-button": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .ps-menu-button:hover": {
          backgroundColor: "transparent !important",
          color: "#868dfb !important",
        },
        "& .ps-active": {
          color: "#6870fa !important",
        },
        "& .ps-submenu-content": {
          background: `${colors.primary[400]} !important`,
        },
        height: "100%",
        minHeight: "400px",
        display: "flex",
      }}
    >
      <Sidebar
        breakPoint="sm"
        onBackdropClick={handleToggleSidebar}
        collapsed={isCollapsed}
        toggled={isCollapsed}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={handleToggleSidebar}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" fontSize={17} color={colors.grey[100]}>
                  ORDER MANAGEMENT
                </Typography>
                <IconButton onClick={handleToggleSidebar}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* SIDEBAR NAV-LINKS */}
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* ORDERS */}
            <SubMenu label="Orders" icon={<ListAltOutlinedIcon />}>
              <Item
                title="Order List"
                to="/orders/list"
                icon={<ChecklistOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Order"
                to="/orders/add"
                icon={<PostAddOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Order Details"
                to="/orders/details"
                icon={<SummarizeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="Inventory"
              to="/inventory"
              icon={<InventoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Customers"
              to="/customers"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* REPORTS */}
            <SubMenu label="Reports" icon={<AssessmentOutlinedIcon />}>
              <Item
                title="Sales Trends"
                to="#"
                icon={<TrendingUpOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Product Analytics"
                to="#"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SideBar;
