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

const ICON_SIZE = 22;
const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 64;

function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะออกจากระบบ?")) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const sidebarItems = [
    { name: "summary", label: "แดชบอร์ด", icon: <LayoutDashboard size={ICON_SIZE} /> },
    { name: "companies", label: "จัดการบริษัท", icon: <Folders size={ICON_SIZE} /> },
    { name: "users", label: "จัดการผู้ใช้", icon: <Users size={ICON_SIZE} /> },
    { name: "reports", label: "รายงานและตรวจสอบ", icon: <FileText size={ICON_SIZE} /> },
  ];

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, height: "100%", bgcolor: "primary.dark", color: "white", pt: 2 }}>
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                setActiveTab(item.name);
                setMobileOpen(false);
              }}
              sx={{
                py: 1.5,
                bgcolor: activeTab === item.name ? "primary.main" : "transparent",
                "&:hover": { bgcolor: "secondary.dark" },
                borderLeft: activeTab === item.name ? `5px solid ${theme.palette.secondary.main}` : "none",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "summary": return <DashboardSummary />;
      case "companies": return <CompanyManagement />;
      case "users": return <UserManagement />;
      case "reports": return <ReportsAudit />;
      default: return <DashboardSummary />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* HEADER */}
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
          zIndex: theme.zIndex.appBar,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: "none", md: "block" } }}>
          FileFlowz Admin
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>A</Avatar>
          <Typography sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}>
            admin_user
          </Typography>
          <Button
            variant="contained"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ bgcolor: "#ff5722", "&:hover": { bgcolor: "#e64a19" }, fontWeight: 600 }}
          >
            ออกจากระบบ
          </Button>
        </Box>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
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

      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            position: "sticky",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* MAIN CONTENT – กล่องกลางจอ + หัวข้ออยู่กึ่งกลาง */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* หัวข้ออยู่กึ่งกลางจอพอดี */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 4,
            textAlign: "center",
            width: "100%",
            maxWidth: "1400px",
            color: "primary.dark",
          }}
        >
          {sidebarItems.find((i) => i.name === activeTab)?.label}
        </Typography>

        {/* เนื้อหาเลื่อนได้ – ตารางกว้างเต็ม 100% */}
        <Box sx={{ flex: 1, overflowY: "auto", width: "100%", pb: 2 }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;