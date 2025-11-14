import React, { useState } from "react";
import { Box, Typography, IconButton, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, useTheme
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { LayoutDashboard, Users, Folders, FileText } from "lucide-react";

import DashboardSummary from "./DashboardSummary.jsx";
import CompanyManagement from "./CompanyManagement.jsx";
import UserManagement from "./UserManagement.jsx";
import ReportsAudit from "./ReportsAudit.jsx";

const ICON_SIZE = 22;

function AdminDashboard() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState("summary");
    const [mobileOpen, setMobileOpen] = useState(false);

    const drawerWidth = 260;
    const HEADER_HEIGHT = { xs: "64px", md: "72px" };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const sidebarItems = [
        { name: "summary", label: "แดชบอร์ด", icon: <LayoutDashboard size={ICON_SIZE} /> },
        { name: "companies", label: "จัดการบริษัท", icon: <Folders size={ICON_SIZE} /> },
        { name: "users", label: "จัดการผู้ใช้", icon: <Users size={ICON_SIZE} /> },
        { name: "reports", label: "รายงานและตรวจสอบ", icon: <FileText size={ICON_SIZE} /> },
    ];

    const drawer = (
        <Box
            sx={{
                width: drawerWidth,
                height: "100%",
                backgroundColor: theme.palette.primary.dark,
                color: "white",
                pt: 2
            }}
        >
            <List>
                {sidebarItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setActiveTab(item.name);
                                setMobileOpen(false); // ปิด drawer หลังเลือก
                            }}
                            sx={{
                                py: 1.5,
                                backgroundColor:
                                    activeTab === item.name
                                        ? theme.palette.primary.main
                                        : "transparent",
                                "&:hover": { backgroundColor: theme.palette.secondary.dark },
                                borderLeft:
                                    activeTab === item.name
                                        ? `5px solid ${theme.palette.secondary.main}`
                                        : "none",
                            }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
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
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>

            {/* ----------- MOBILE HEADER BUTTON (สำหรับ HeaderMUI) ----------- */}
            {/* โค้ดนี้ถูกเพิ่มใน HeaderMUI เพื่อควบคุมการเปิด Drawer */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: HEADER_HEIGHT,
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    px: 2,
                    zIndex: 2000
                }}
            >
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ color: theme.palette.secondary.light }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ color: theme.palette.secondary.light, fontWeight: 700 }}>
                    {sidebarItems.find((i) => i.name === activeTab)?.label}
                </Typography>
            </Box>


            {/* ----------- DRAWER MOBILE ----------- */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            top: HEADER_HEIGHT.xs, 
                            width: drawerWidth,
                            boxSizing: 'border-box'
                        }
                    }}
                >
                    {drawer}
                </Drawer>

                {/* ----------- DRAWER DESKTOP (Permanent) ----------- */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            // ✅ แก้ไข: ใช้ position: sticky เพื่อให้ชิด Header หลัก
                            position: "sticky", 
                            top: HEADER_HEIGHT.md, // เริ่มใต้ Header
                            height: `calc(100vh - ${HEADER_HEIGHT.md})`,
                            boxSizing: 'border-box',
                            overflowX: 'hidden'
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* ----------- MAIN CONTENT ----------- */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3, 
                    // ✅ แก้ไข: เพิ่ม margin-top ให้ชดเชยพื้นที่ Header หลัก
                    mt: { xs: HEADER_HEIGHT.xs, md: HEADER_HEIGHT.md }, 
                    ml: { md: `${drawerWidth}px` }, // ดันเนื้อหาจาก Sidebar
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: theme.palette.background.default
                }}
            >
                {/* ❌ ลบ Header ย่อยที่สร้างปัญหาออก */}
                
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    {sidebarItems.find((i) => i.name === activeTab)?.label}
                </Typography>

                {renderContent()}
            </Box>
        </Box>
    );
}

export default AdminDashboard;