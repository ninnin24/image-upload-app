import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Button, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Switch, 
    FormControlLabel, 
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// ⭐️ นำเข้า createTheme และ ThemeProvider จาก Material UI
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ⭐️ กำหนดสีตามสไตล์ของ FileFlowz (นำมาจาก HeaderMUI)
const fileFlowColors = {
    primary: { dark: '#005377', main: '#00AEEF', light: '#87CEEB' },
    secondary: { dark: '#2CA3A3', main: '#40E0D0', light: '#AEEEEE' },
    accent: { main: '#FF7F50', light: '#FFB092' },
    text: { primary: '#003F5C' },
};

// ⭐️ สร้าง Theme สำหรับหน้านี้ (ใช้ Sarabun และ Palette เดียวกับ Header)
const theme = createTheme({
    typography: { 
        fontFamily: ['Sarabun', 'sans-serif'].join(','),
        h1: { fontWeight: 700, fontSize: '3.5rem' }, // ปรับขนาด h1
        h2: { fontWeight: 700, fontSize: '2.5rem' }, // ปรับขนาด h2
        h3: { fontWeight: 800, fontSize: '3rem' }, // ราคา
        h5: { fontWeight: 400, fontSize: '1.25rem' },
    },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary, secondary: '#555' },
        success: { main: '#4CAF50' }, // เพิ่มสีเขียวสำหรับส่วนลด
        background: { default: '#f7f9fc' }, // ใช้สีพื้นหลังเดียวกับ Box หลัก
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // ขอบโค้งมนสวยงาม
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)', // เงาที่ดูพรีเมียม
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-8px)', // ยกขึ้นเล็กน้อยเมื่อโฮเวอร์
                        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // ปุ่มโค้งมน
                    textTransform: 'none', // ไม่ต้องเป็นตัวพิมพ์ใหญ่ทั้งหมด
                    padding: '10px 20px',
                },
                containedPrimary: {
                    background: `linear-gradient(45deg, ${fileFlowColors.primary.dark} 30%, ${fileFlowColors.primary.main} 90%)`,
                    color: 'white',
                    '&:hover': {
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    },
                },
                outlinedPrimary: {
                    borderColor: fileFlowColors.primary.main,
                    color: fileFlowColors.primary.main,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 174, 239, 0.05)',
                    },
                },
                containedSecondary: {
                    background: `linear-gradient(45deg, ${fileFlowColors.secondary.dark} 30%, ${fileFlowColors.secondary.main} 90%)`,
                    color: fileFlowColors.text.primary,
                    '&:hover': {
                        boxShadow: '0 3px 5px 2px rgba(64, 224, 208, .3)',
                    },
                },
            }
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: fileFlowColors.primary.light,
                },
                colorPrimary: {
                    '&.Mui-checked': {
                        color: fileFlowColors.primary.main,
                    },
                },
                track: {
                    backgroundColor: fileFlowColors.primary.light,
                    '.Mui-checked.Mui-checked + &': {
                        opacity: 0.9,
                        backgroundColor: fileFlowColors.primary.dark,
                    },
                },
            },
        },
    }
});


// ข้อมูลแผนราคา (เหมือนเดิม)
const pricingPlans = [
    {
        name: 'Free',
        tag: null,
        description: 'เริ่มต้นใช้งานการจัดการไฟล์และวิดีโอฟรีได้ทันที',
        priceMonthly: 0, 
        priceYearly: 0,
        unitMonthly: '/ ตลอดชีพ', 
        unitYearly: '/ ตลอดชีพ', 
        credits: '25 เครดิต/เดือน',
        users: '3 ผู้ใช้ / 1 บัญชี',
        features: [
            'อัปโหลดไฟล์, API และ UI', 
            'ไม่มีบัตรเครดิตที่ต้องใช้',
            'การจัดการภาพพื้นฐาน',
        ],
        buttonText: 'ลงทะเบียนฟรี',
        buttonVariant: 'outlined',
        buttonColor: 'inherit',
    },
    {
        name: 'Plus',
        tag: 'เป็นที่นิยมที่สุด',
        description: 'ขยายขีดความสามารถในการจัดการไฟล์สำหรับเว็บไซต์และแอปพลิเคชัน',
        priceMonthly: 3299, 
        priceYearly: 33650, 
        unitMonthly: '/ เดือน',
        unitYearly: '/ ปี',
        credits: '225 เครดิต/เดือน',
        users: '3 ผู้ใช้ / 2 บัญชี',
        features: [
            'รวมทุกฟีเจอร์ของ Free',
            'สำรองข้อมูลไปยัง S3 bucket ของคุณ',
            'การปรับเปลี่ยนภาพและวิดีโอขั้นสูง',
            'สนับสนุนทางอีเมล',
        ],
        buttonText: 'เริ่มใช้งาน',
        buttonVariant: 'contained',
        buttonColor: 'primary',
    },
    {
        name: 'Advanced',
        tag: null,
        description: 'เพิ่มประสบการณ์การจัดการไฟล์ด้วยฟีเจอร์ระดับสูงสำหรับทีมที่กำลังเติบโต',
        priceMonthly: 7999, 
        priceYearly: 81590, 
        unitMonthly: '/ เดือน',
        unitYearly: '/ ปี',
        credits: '600 เครดิต/เดือน',
        users: '5 ผู้ใช้ / 3 บัญชี',
        features: [
            'รวมทุกฟีเจอร์ของ Plus', 
            'ชื่อโดเมนที่กำหนดเอง (CNAME)', 
            'การตั้งค่าสิทธิ์ผู้ใช้ขั้นสูง',
            'การจัดการทีมและการควบคุมเวอร์ชัน',
        ],
        buttonText: 'เริ่มใช้งาน',
        buttonVariant: 'outlined',
        buttonColor: 'primary',
    },
    {
        name: 'Enterprise',
        tag: null,
        description: 'สำหรับองค์กรขนาดใหญ่ที่ต้องการโซลูชันด้านสื่อดิจิทัลในระดับองค์กรและความปลอดภัยสูงสุด',
        priceMonthly: 'ติดต่อ',
        priceYearly: 'ติดต่อ',
        unitMonthly: '',
        unitYearly: '',
        credits: 'ไม่จำกัด',
        users: 'กำหนดเอง',
        features: [
            'รวมฟีเจอร์ขั้นสูงทั้งหมด', 
            'ความปลอดภัยและการปฏิบัติตามข้อกำหนด (SOC 2, ISO)', 
            'การสนับสนุนและบริการเฉพาะ (24/7)',
            'SLA ที่กำหนดเอง',
        ],
        buttonText: 'ติดต่อเรา',
        buttonVariant: 'outlined',
        buttonColor: 'secondary',
    },
];

const currencySymbol = '฿'; 

// คอมโพเนนต์ Card สำหรับแสดงแผนราคา
const PricingCard = ({ plan, isAnnual, isPopular }) => {
    const rawPrice = isAnnual ? plan.priceYearly : plan.priceMonthly;
    const unit = isAnnual ? plan.unitYearly : plan.unitMonthly;

    const formattedPrice = 
        typeof rawPrice === 'number' ? new Intl.NumberFormat('th-TH').format(rawPrice) : rawPrice;
    
    const showDiscount = isAnnual && typeof rawPrice === 'number' && rawPrice > 0;
    const annualDiscountText = showDiscount ? 'ประหยัด 15%' : null;

    return (
        <Card 
            elevation={isPopular ? 10 : 3}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                // ⭐️ ใช้ border สี primary สำหรับ Card ที่เป็นที่นิยม
                border: isPopular ? `3px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                '&:hover': {
                    transform: 'translateY(-8px)', // ยกขึ้นเมื่อโฮเวอร์
                    boxShadow: '0 12px 28px rgba(0,0,0,0.12)', // เงาเข้มขึ้น
                }
            }}
        >
            {/* Tag ยอดนิยม */}
            {isPopular && (
                <Box 
                    sx={{ 
                        backgroundColor: theme.palette.primary.main, 
                        color: 'white', 
                        textAlign: 'center', 
                        py: 1, 
                        borderTopLeftRadius: theme.shape.borderRadius,
                        borderTopRightRadius: theme.shape.borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                    }}
                >
                    <StarIcon fontSize="small" sx={{ mr: 0.5 }} /> {plan.tag}
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                    {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2 }}>
                    {plan.description}
                </Typography>
                
                {/* ส่วนราคา */}
                <Box sx={{ my: 3 }}>
                    <Typography variant="h3" component="p" sx={{ fontWeight: 'extra-bold', color: theme.palette.primary.dark }}>
                        {formattedPrice !== 'ติดต่อ' ? currencySymbol : ''}
                        {formattedPrice}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {unit}
                    </Typography>
                    {annualDiscountText && (
                        <Typography variant="caption" color="success.main" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                            {annualDiscountText}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* รายละเอียดหลัก (ผู้ใช้และเครดิต) */}
                <Box sx={{ mb: 2, textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.secondary.main }} /> ขีดจำกัด
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 3, color: theme.palette.text.secondary }}>
                        ผู้ใช้: {plan.users}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 3, color: theme.palette.text.secondary }}>
                        เครดิต/เดือน: {plan.credits}
                    </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />

                {/* รายการฟีเจอร์ */}
                <List dense sx={{ textAlign: 'left', px: 1 }}>
                    {plan.features.map((feature, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{feature}</Typography>
                            } />
                        </ListItem>
                    ))}
                </List>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                <Button 
                    variant={plan.buttonVariant} 
                    // ⭐️ กำหนด color ตรงๆ หรือใช้ conditional logic ที่ซับซ้อนขึ้น
                    color={plan.buttonColor === 'inherit' ? 'default' : plan.buttonColor} 
                    size="large"
                    fullWidth
                    sx={{ fontWeight: 'bold' }}
                >
                    {plan.buttonText}
                </Button>
            </CardActions>
        </Card>
    );
};


// คอมโพเนนต์หลัก MyPricingPage
function MyPricingPage() {
    const [isAnnual, setIsAnnual] = useState(false); 
    
    const handleToggle = () => {
        setIsAnnual(prev => !prev);
    };

    return (
        <ThemeProvider theme={theme}> {/* ⭐️ ห่อหุ้มด้วย ThemeProvider */}
            <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', py: 8 }}>
                <Container maxWidth="lg">
                    
                    {/* ส่วนหัวของหน้า */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                            FileFlowz Storage <span style={{ color: theme.palette.primary.main }}>Pricing</span>
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                            แพลตฟอร์มการจัดการรูปภาพและวิดีโอที่ขับเคลื่อนด้วย AI เพื่อจัดการ เปลี่ยนแปลง และส่งมอบเนื้อหาได้อย่างเหมาะสม
                        </Typography>
                    </Box>

                    {/* ส่วนสลับแผนรายเดือน/รายปี */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isAnnual ? theme.palette.text.secondary : theme.palette.primary.main }}>
                            รายเดือน
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAnnual}
                                    onChange={handleToggle}
                                    name="pricingToggle"
                                    color="primary"
                                    size="medium" // ปรับขนาด Switch
                                />
                            }
                            label={
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isAnnual ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                    รายปี
                                </Typography>
                            }
                            labelPlacement="start"
                            sx={{ mx: 2 }}
                        />
                        {isAnnual && (
                            <Box sx={{ 
                                bgcolor: theme.palette.warning.main, // ⭐️ ใช้สี accent ของเรา
                                color: 'white', 
                                px: 1.5, 
                                py: 0.5, 
                                borderRadius: 1.5, 
                                fontWeight: 'bold', 
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 2px 5px rgba(255,127,80,0.3)',
                            }}>
                                <MonetizationOnIcon sx={{ fontSize: 16, mr: 0.5 }} /> ลด 15%
                            </Box>
                        )}
                    </Box>

                    {/* ตารางราคา (Grid) */}
                    <Grid container spacing={4} alignItems="stretch">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <PricingCard 
                                    plan={plan} 
                                    isAnnual={isAnnual} 
                                    isPopular={plan.name === 'Plus'}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    
                    {/* ส่วนท้าย (Footer Note) */}
                    <Box sx={{ mt: 6, p: 3, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            <MonetizationOnIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} /> 
                             ราคานี้อาจมีการเปลี่ยนแปลงและยังไม่รวมภาษีมูลค่าเพิ่ม สำหรับรายละเอียดเพิ่มเติมกรุณาติดต่อทีมงาน
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default MyPricingPage;