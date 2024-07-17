
An e-commerce API made with Node.js, Express and MongoDB.

## Requirements

- Node.js
- npm 
- MongoDB

## Installation

1. Clone the repository: `git clone https://github.com/mathiasbelle/ECOMapp.git`
2. Go to project directory: `cd ECOMapp`
3. Install dependencies: `npm install`

## Configuration

### 1. Create a `.env` file

Create a `.env` file in the root directory of the project.

### 2. Add Environment Variables

Add the following environment variables to the `.env` file:

```plaintext
# Node environment
NODE_ENV=node_environment
# MongoDB Connection URI
MONGO_URI=mongodb://mongodb:27017/dev
# JWT Secret Key
JWT_SECRET=jwt_secret_key
# Refresh Token Secret Key
REFRESH_TOKEN_SECRET=refresh_token_secret_key
# JWT for forgetting The password
FORGET_PASSWORD_TOKEN_SECRET=forget_password_secret
# Mail configuration
MAIL_HOST=host
MAIL_PORT=port
MAIL_USER=user@email.com
MAIL_PASS=password
```
### 3. Database Configuration
Ensure that MongoDB is running on your local machine or configure the MONGO_URI variable to point to your MongoDB instance. If you are using a cloud-based MongoDB service like MongoDB Atlas, make sure to update the `MONGO_URI` with the appropriate connection string.

## Usage

To run locally, run the command 
```
npm run dev
```

To debug, run the command 
```
npm run debug
```