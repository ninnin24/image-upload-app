/* --- AdminDashboard (จัด layout ใหม่ทั้งหมดให้สวยกว่าเดิม) --- */

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { LayoutDashboard, Users, Folders, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardSummary from "./DashboardSummary.jsx";
import CompanyManagement from "./CompanyManagement.jsx";
import UserManagement from "./UserManagement.jsx";
import ReportsAudit from "./ReportsAudit.jsx";

const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 64;

function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const sidebarItems = [
    { name: "summary", label: "แดชบอร์ด", icon: <LayoutDashboard size={22} /> },
    { name: "companies", label: "จัดการบริษัท", icon: <Folders size={22} /> },
    { name: "users", label: "จัดการผู้ใช้", icon: <Users size={22} /> },
    { name: "reports", label: "รายงานและตรวจสอบ", icon: <FileText size={22} /> },
  ];

  /* ---- Drawer Content ---- */
  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        bgcolor: "primary.main",
        color: "white",
        pt: 2,
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                setActiveTab(item.name);
                setMobileOpen(false);
              }}
              sx={{
                py: 1.4,
                bgcolor:
                  activeTab === item.name ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft:
                  activeTab === item.name
                    ? `5px solid ${theme.palette.secondary.main}`
                    : "5px solid transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  /* ---- Render Content ---- */
  const renderPage = () => {
    switch (activeTab) {
      case "summary":
        return <DashboardSummary />;
      case "companies":
        return <CompanyManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <ReportsAudit />;
      default:
        return <DashboardSummary />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ---- HEADER ---- */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: HEADER_HEIGHT,
          bgcolor: "primary.dark",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton sx={{ color: "white" }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, display: { xs: "none", md: "block" } }}
        >
          FileFlowz Admin
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>A</Avatar>
          <Typography sx={{ fontWeight: 600 }}>admin_user</Typography>

          <Button
            variant="contained"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              bgcolor: "#ff5722",
              "&:hover": { bgcolor: "#e64a19" },
              fontWeight: 600,
            }}
          >
            ออกจากระบบ
          </Button>
        </Box>
      </Box>

      {/* ---- MOBILE DRAWER ---- */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ---- DESKTOP DRAWER ---- */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            position: "fixed",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ---- MAIN CONTENT ---- */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: 0,
          pt: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          bgcolor: "background.default",
          p: 3,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
            textAlign: "left",
            color: "primary.dark",
          }}
        >
          {sidebarItems.find((i) => i.name === activeTab)?.label}
        </Typography>

        {/* กล่องเนื้อหา ให้ scroll ภายในได้ */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {renderPage()}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
