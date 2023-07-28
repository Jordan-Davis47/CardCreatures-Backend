# Card Creatures Backend


## Description

Card Creatures Backend is the server-side component of the Card Creatures project, responsible for handling data storage, user authentication, and API endpoints. It is built with Node.js, Express.js, MongoDB, and Mongoose, ensuring a robust and secure backend architecture. Utilizing bcrypt, user passwords are securely encrypted, and JSON Web Token (JWT) is employed for authentication. The backend provides RESTful API endpoints for seamless communication with the frontend and implements efficient error handling to ensure a smooth gaming experience.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt (for password protection and encryption)
- JSON Web Token (JWT) (for authentication)

## API Endpoints

The backend provides the following RESTful API endpoints:

- `POST /api/auth/signup`: User registration. Requires a valid email and password.
- `POST /api/auth/login`: User login. Requires a valid email and password.
- `GET /api/users/me`: Get user details. Requires a valid JWT token for authentication.
- `PUT /api/users/me`: Update user details. Requires a valid JWT token for authentication.
- `POST /api/decks`: Create a new custom deck. Requires a valid JWT token for authentication.
- `GET /api/decks/:id`: Get details of a specific custom deck. Requires a valid JWT token for authentication.
- `PUT /api/decks/:id`: Update details of a specific custom deck. Requires a valid JWT token for authentication.
- `DELETE /api/decks/:id`: Delete a specific custom deck. Requires a valid JWT token for authentication.
- `POST /api/cards`: Create a new custom card. Requires a valid JWT token for authentication.
- `GET /api/cards/:id`: Get details of a specific custom card. Requires a valid JWT token for authentication.
- `PUT /api/cards/:id`: Update details of a specific custom card. Requires a valid JWT token for authentication.
- `DELETE /api/cards/:id`: Delete a specific custom card. Requires a valid JWT token for authentication.

## Error Handling

The backend is equipped with robust error handling mechanisms, providing meaningful error messages for various scenarios to ensure a smooth gaming experience for users.

