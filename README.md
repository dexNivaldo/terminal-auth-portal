# Terminal Auth Portal

This project is designed to generate authentication tokens that can be used to access the TAS portal and is built with Vite and React.

## Requirements

Before you begin, ensure that you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (package manager)

## Installation

Follow these steps to set up the project on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/dexNivaldo/terminal-auth-portal.git
   ```
2. Clone the repository:

   ```bash
   cd terminal-auth-portal
   ```
3. Install the project dependencies:

   ```bash
   npm install
   ```

## Usage
To generate an authentication token and use the functionality of this project, follow these steps:

##### 1. Start the development server:

If you're using npm:

```bash
npm run dev
```
Or if you're using yarn:

```bash
yarn dev
```

This will start the server at http://localhost:5173 by default.

 ##### 2. Generate a token:

From the web interface, you can generate an authentication token. The app interacts with the Terminal Portal API to retrieve a unique token.

##### 3. Use the token in the terminal:

Once the token is generated, you can use it in the terminal to authenticate with the portal.