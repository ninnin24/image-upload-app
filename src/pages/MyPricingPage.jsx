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

// ข้อมูลแผนราคา
const pricingPlans = [
  {
    name: 'Free',
    tag: null,
    description: 'เริ่มต้นใช้งานการจัดการไฟล์และวิดีโอฟรีได้ทันที',
    // ใช้ 0 สำหรับ Free
    priceMonthly: 0, 
    priceYearly: 0,
    unit: '/ ตลอดชีพ',
    credits: '25 เครดิต/เดือน',
    users: '3 ผู้ใช้ / 1 บัญชี',
    features: [
      'อัปโหลดไฟล์, API และ UI', 
      'ไม่มีบัตรเครดิตที่ต้องใช้'
    ],
    buttonText: 'ลงทะเบียนฟรี',
    buttonVariant: 'outlined',
    buttonColor: 'inherit',
  },
  {
    name: 'Plus',
    tag: 'เป็นที่นิยมที่สุด',
    description: 'ขยายขีดความสามารถในการจัดการไฟล์สำหรับเว็บไซต์และแอปพลิเคชัน',
    // ⭐️ ใช้ราคาบาทจริงตามที่คุณสมมติ (3,299/เดือน, 33,650/ปี)
    priceMonthly: 3299, 
    priceYearly: 33650, 
    unit: '/ เดือน',
    credits: '225 เครดิต/เดือน',
    users: '3 ผู้ใช้ / 2 บัญชี',
    features: [
      'รวมทุกฟีเจอร์ของ Free',
      'สำรองข้อมูลไปยัง S3 bucket ของคุณ',
      'การปรับเปลี่ยนภาพและวิดีโอขั้นสูง',
    ],
    buttonText: 'เริ่มใช้งาน',
    buttonVariant: 'contained',
    buttonColor: 'primary',
  },
  {
    name: 'Advanced',
    tag: null,
    description: 'เพิ่มประสบการณ์การจัดการไฟล์ด้วยฟีเจอร์ระดับสูง',
    // ⭐️ ใช้ราคาบาทจริงตามที่คุณสมมติ (7,999/เดือน, 81,590/ปี)
    priceMonthly: 7999, 
    priceYearly: 81590, 
    unit: '/ เดือน',
    credits: '600 เครดิต/เดือน',
    users: '5 ผู้ใช้ / 3 บัญชี',
    features: [
      'รวมทุกฟีเจอร์ของ Plus', 
      'ชื่อโดเมนที่กำหนดเอง (CNAME)', 
      'การตั้งค่าสิทธิ์ผู้ใช้ขั้นสูง',
    ],
    buttonText: 'เริ่มใช้งาน',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    name: 'Enterprise',
    tag: null,
    description: 'สำหรับองค์กรที่ต้องการโซลูชันด้านสื่อดิจิทัลในระดับองค์กร',
    priceMonthly: 'ติดต่อ',
    priceYearly: 'ติดต่อ',
    unit: '',
    credits: 'ไม่จำกัด',
    users: 'กำหนดเอง',
    features: [
      'รวมฟีเจอร์ขั้นสูงทั้งหมด', 
      'ความปลอดภัยและการปฏิบัติตามข้อกำหนด', 
      'การสนับสนุนและบริการเฉพาะ',
      'SLA ที่กำหนดเอง',
    ],
    buttonText: 'ติดต่อเรา',
    buttonVariant: 'outlined',
    buttonColor: 'secondary',
  },
];

const currencySymbol = '฿'; // สกุลเงินบาทไทย

// คอมโพเนนต์ Card สำหรับแสดงแผนราคา
const PricingCard = ({ plan, isAnnual, isPopular }) => {
    // ⭐️ ใช้ราคาโดยตรงจาก Plan Data
    const rawPrice = isAnnual ? plan.priceYearly : plan.priceMonthly;
    
    // จัดรูปแบบราคาเป็นหลักพันหรือ 'ติดต่อ'
    const formattedPrice = 
      typeof rawPrice === 'number' ? new Intl.NumberFormat('th-TH').format(rawPrice) : rawPrice;
    
    // คำนวณส่วนลดสำหรับรายปี
    const annualDiscount = isAnnual && plan.name !== 'Free' && plan.name !== 'Enterprise' ? 'ประหยัด 15%' : null;

    return (
        <Card 
            elevation={isPopular ? 10 : 3}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                border: isPopular ? '3px solid #2196f3' : '1px solid #e0e0e0',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: isPopular ? 15 : 8,
                }
            }}
        >
            {isPopular && (
                <Box 
                    sx={{ 
                        backgroundColor: 'primary.main', 
                        color: 'white', 
                        textAlign: 'center', 
                        py: 1, 
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    <StarIcon fontSize="small" sx={{ mr: 0.5 }} /> {plan.tag}
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2 }}>
                    {plan.description}
                </Typography>
                
                <Box sx={{ my: 3 }}>
                    <Typography variant="h3" component="p" sx={{ fontWeight: 'extra-bold', color: 'primary.dark' }}>
                        {/* ⭐️ แสดงสัญลักษณ์ ฿ ถ้าไม่ใช่ 'ติดต่อ' */}
                        {formattedPrice !== 'ติดต่อ' ? currencySymbol : ''}
                        {formattedPrice}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {plan.unit}
                    </Typography>
                    {annualDiscount && (
                        <Typography variant="caption" color="success.main" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                            {annualDiscount}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* รายละเอียดหลัก */}
                <Box sx={{ mb: 2, textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> ผู้ใช้และเครดิต
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 3 }}>
                        {plan.users} / {plan.credits}
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
                                <Typography variant="body2">{feature}</Typography>
                            } />
                        </ListItem>
                    ))}
                </List>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                <Button 
                    variant={plan.buttonVariant} 
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
    const [isAnnual, setIsAnnual] = useState(false); // false = รายเดือน, true = รายปี
    
    const handleToggle = () => {
        setIsAnnual(prev => !prev);
    };

    return (
        <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="lg">
                
                {/* ส่วนหัวของหน้า */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#1e3a5a' }}>
                        CloudFile Storage
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                        แพลตฟอร์มการจัดการรูปภาพและวิดีโอที่ขับเคลื่อนด้วย AI เพื่อจัดการ เปลี่ยนแปลง และส่งมอบเนื้อหาได้อย่างเหมาะสม
                    </Typography>
                </Box>

                {/* ส่วนสลับแผนรายเดือน/รายปี */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isAnnual ? 'text.secondary' : 'primary.main' }}>
                        รายเดือน
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isAnnual}
                                onChange={handleToggle}
                                name="pricingToggle"
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isAnnual ? 'primary.main' : 'text.secondary' }}>
                                รายปี
                            </Typography>
                        }
                        labelPlacement="start"
                        sx={{ mx: 2 }}
                    />
                    {isAnnual && (
                        <Box sx={{ bgcolor: 'error.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>
                            ลด 15%
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
                <Box sx={{ mt: 6, p: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        * ราคานี้อาจมีการเปลี่ยนแปลงและยังไม่รวมภาษีมูลค่าเพิ่ม สำหรับรายละเอียดเพิ่มเติมกรุณาติดต่อทีมงาน
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default MyPricingPage;