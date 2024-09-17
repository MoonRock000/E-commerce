# E-Commerce Application

## Overview

This is a full-stack e-commerce web application built using the MERN stack. It allows users to browse products, add items to their cart, place orders, and cancel them if needed. Additionally, there is an admin dashboard for managing products and orders.

## Features

### User Features

- **Browse Products**: Users can view all available products.
- **Cart Management**: Users can add products to the cart and view the contents.
- **Order Placement**: Users can place an order by providing delivery details and checkout.
- **Cancel Orders**: Users can cancel their orders.

### Admin Features

- **Manage Products**: Admin can add, edit, and delete products.
- **Order Management**: Admin can view, edit, and delete any order.

## Tech Stack

- **Frontend**: React.js with Material UI for styling components.
- **Backend**: Node.js and Express.js for building the REST API.
- **Database**: MongoDB with Mongos as the ORM.
- **Storage**: AWS S3 bucket for storing product images.

## Installation

### Prerequisites

- Node.js
- MongoDB
- AWS Account (for S3 bucket setup)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ecommerce-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ecommerce-app
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
5. Create a `.env` file in the `backend` folder and add the following environment variables:
   ```
   MONGODB_URI=your-mongodb-uri
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   S3_BUCKET_NAME=your-s3-bucket-name
   ```
6. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
7. Start the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

## UsageHosting

- **User**: Navigate through the homepage to browse products, add items to the cart, checkout, and cancel orders.
- **Admin**: Access the admin dashboard to manage products and view or edit orders.

## API Endpoints

- **User Endpoints**:

  - `GET /products`: Fetch all products.
  - `POST /cart`: Add item to the cart.
  - `POST /checkout`: Complete the checkout.
  - `DELETE /order/:id`: Cancel an order.

- **Admin Endpoints**:
  - `POST /admin/product`: Add a new product.
  - `PUT /admin/product/:id`: Edit a product.
  - `DELETE /admin/product/:id`: Delete a product.
  - `GET /admin/orders`: View all orders.
  - `PUT /admin/order/:id`: Edit an order.
  - `DELETE /admin/order/:id`: Delete an order.
