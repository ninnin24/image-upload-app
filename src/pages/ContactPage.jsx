import React, { useState } from "react";
import "../styles/ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    topic: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ส่งข้อมูลสำเร็จ! ขอบคุณที่ติดต่อเรา ❤️");
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">ติดต่อเรา</h1>
      <p className="contact-subtitle">
        หากคุณต้องการสอบถามข้อมูลเพิ่มเติม โปรดกรอกแบบฟอร์มด้านล่าง หรือ{" "}
        <a href="mailto:support@fileflowz.com" className="contact-link">
          ส่งอีเมลถึงทีมสนับสนุน
        </a>
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="ชื่อ *"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">ประเทศ *</option>
            <option value="ไทย">ไทย</option>
            <option value="ลาว">ลาว</option>
            <option value="เวียดนาม">เวียดนาม</option>
            <option value="สิงคโปร์">สิงคโปร์</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="text"
            name="lastName"
            placeholder="นามสกุล *"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          >
            <option value="">หัวข้อที่ต้องการติดต่อ *</option>
            <option value="ฝ่ายขาย">ฝ่ายขาย</option>
            <option value="ฝ่ายเทคนิค">ฝ่ายเทคนิค</option>
            <option value="ฝ่ายบัญชี">ฝ่ายบัญชี</option>
          </select>
        </div>

        <input
          type="text"
          name="company"
          placeholder="ชื่อบริษัท *"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <input
            type="email"
            name="email"
            placeholder="อีเมลธุรกิจ *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="ข้อความที่ต้องการติดต่อ *"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="เบอร์โทรศัพท์"
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          ส่งข้อความ
        </button>
      </form>

      <p className="policy-note">
        เว็บไซต์นี้ได้รับการคุ้มครองโดยนโยบายความเป็นส่วนตัวและเงื่อนไขการใช้บริการของเรา
      </p>
    </div>
  );
};

export default ContactPage;
