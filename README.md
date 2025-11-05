# Organ Donation Management System (ODMS)

![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Express](https://img.shields.io/badge/Backend-Express.js-lightgrey)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Runtime-Node.js-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack **MERN** application designed to connect patients in need of organs with compatible donors, managed and verified by an admin. The system ensures secure authentication, medical record handling, donor availability tracking, and an intelligent blood-type compatibility matching engine.

---

## 🚀 Features

### 🔐 Role-Based Authentication (JWT)
- Login and registration for **Admin**, **Patient**, and **Donor**.
- Protected backend routes ensure role-specific access.

### 🧑‍⚕️ Patient Portal
- Complete profile setup including medical and organ requirement details.
- Submit **Organ Requests** and upload medical documentation.
- Track request status: `pending`, `approved`, or `rejected`.

### 🫀 Donor Portal
- Submit donor profile with organ and blood group details.
- Real-time availability tracking.
- View and track donation assignment history.

### 🛂 Admin Dashboard
- View all patients, donors, and organ requests.
- Approve / Reject organ requests.
- **Matching Engine:** Finds donors based on organ type + blood compatibility.
- Assign donor to a patient request.

---

## 🏗 Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | React, React Router, TailwindCSS, shadcn/ui, Zod, React Hook Form |
| Backend   | Node.js, Express.js |
| Database  | MongoDB + Mongoose |
| Auth      | JWT, bcryptjs |
| Validation | express-validator |
| State     | React Hooks |

---

## 🗄 Database Models

### **User**
```js
name, email, passwordHash, role(admin|donor|patient)
```

### **Donor**
```js
userId, fullName, dateOfBirth, bloodGroup, organType, phone, address, city, state, zipCode, emergencyContactName, emergencyContactPhone, medicalHistory
```

### **Patient**
```js
userId, name, email, age, phone, bloodGroup, requiredOrgan, medicalCondition, state, city
```

### **OrganRequest**
```js
patientUserId, patientName, organ, bloodGroup, status(pending|approved|rejected), urgency, medicalRecords[], assignedDonor
```

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/donors` | POST | Register donor profile |
| `/api/donors/me` | GET/PUT | Get or update donor profile |
| `/api/donors/me/history` | GET | Donation assignment history |
| `/api/patients` | POST | Register patient profile |
| `/api/patients/me` | GET/PUT | Get or update patient profile |
| `/api/requests` | POST | Submit organ request |
| `/api/requests/my-requests` | GET | Patient request history |
| `/api/admin/requests` | GET | View all requests |
| `/api/admin/requests/:id/status` | PATCH | Approve/Reject request |
| `/api/admin/requests/:id/find-matches` | GET | Find donor matches |
| `/api/admin/requests/:id/assign` | PATCH | Assign donor to request |

---

## 🧪 How to Run

### Backend
```bash
cd backend
npm install
# Create .env with:
# MONGO_URI=your_mongo_uri
# JWT_SECRET=your_secret_key
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📌 License
This project is licensed under the **MIT License**.

---

### 💡 Future Enhancements
- Email notifications for request updates
- Multi-organ donor management
- AI-powered donor suitability scoring

---

Made with ❤️ to support life-saving organ donations.
