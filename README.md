# 🛒 Online Store Project

🌐 **Live Demo:** https://online-store-project.shop  
📦 **GitHub Repository:** https://github.com/Abuka13/Online-Store

---

## 📌 Project Overview

**Online Store Project** is a full-stack web application that represents a modern e-commerce platform.  
The system allows users to register and log in securely using JWT authentication, browse products, manage a shopping cart, and place orders.

Administrators have extended access rights, including managing products, categories, and viewing all orders.  
The backend is built with **Node.js**, **Express**, and **MongoDB Atlas**, following a modular and scalable architecture.

---

## 👨‍💻 Team Members

This project was developed by:

- **Rauan Ali**
- **Uzbekbay Abilkaiyr**
- **Tassimov Arsen**
- **Yerkebulan Zhan**

All team members contributed to backend development, database design, API implementation, testing, and deployment.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

### Frontend
- React
- HTML
- CSS
- JavaScript  
- Responsive design (desktop & mobile)

### Tools
- Postman (API testing)
- MongoDB Atlas (Cloud database)
- Render / Cloud hosting

---

## 📁 Project Structure

Online-Store/
│
├── app/

│ ├── config/ # Database & auth configuration

│ ├── controllers/ # Business logic

│ ├── middlewares/ # Auth, RBAC, error handling

│ ├── models/ # Mongoose schemas

│ ├── routes/ # API routes

│

├── server.js # Application entry point

├── package.json

├── .env # Environment variables

└── README.md


---

## ⚙️ Setup Instructions (Local)

### 1️⃣ Clone repository
```bash
git clone https://github.com/Abuka13/Online-Store.git


cd Online-Store


npm install

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

npm run dev


🔐 Authentication & Security

Passwords are encrypted using bcrypt

Authentication is handled via JWT

Private routes are protected with middleware

Role-Based Access Control (RBAC):

user

admin

📚 API Documentation
🔓 Authentication (Public)

Method	Endpoint	Description

POST	/api/auth/register	Register new user

POST	/api/auth/login	Login and receive JWT

👤 User (Private)

Method	Endpoint	Description

GET	/api/users/profile	Get user profile

PUT	/api/users/profile	Update user profile

🗂 Categories

Method	Endpoint	Access	Description

GET	/api/categories	Public	Get all categories

GET	/api/categories/:id	Public	Get category by ID

POST	/api/categories	Admin	Create category

PUT	/api/categories/:id	Admin	Update category

DELETE	/api/categories/:id	Admin	Delete category

📦 Products

Method	Endpoint	Access	Description

GET	/api/products	Public	Get all products

GET	/api/products/:id	Public	Get product by ID

POST	/api/products	Admin	Create product

PUT	/api/products/:id	Admin	Update product

DELETE	/api/products/:id	Admin	Delete product

🛒 Cart (Private)

Method	Endpoint	Description

GET	/api/cart	Get user cart

POST	/api/cart/add	Add product to cart

PUT	/api/cart/update	Update cart item

DELETE	/api/cart/remove/:productId	Remove item

DELETE	/api/cart/clear	Clear cart

📦 Orders (Private)

Method	Endpoint	Access	Description

POST	/api/orders	User	Create order

GET	/api/orders	User	Get user orders

GET	/api/orders/:id	User/Admin	Get order by ID

PUT	/api/orders/:id/status	Admin	Update order status

PUT	/api/orders/:id/pay	Admin	Update payment status

DELETE	/api/orders/:id/cancel	User/Admin	Cancel order

GET	/api/orders/all	Admin	Get all orders

🖼 Screenshots

Screenshots of the application features are included in the repository and demonstrate:

Home page with product listing

User authentication (login & registration)

Product details

Shopping cart

Order creation and order history

Admin product and category management

🚀 Deployment

The project is deployed online using cloud hosting.

🔗 Live URL:
https://online-store-project.shop

All sensitive data (database URI, JWT secret) is stored securely in environment variables.



