
# 7Chat

7Chat is a creative live chat application that randomly matches users and directs them through prompt-based communication. The app fosters quick interactions, where users answer a series of questions, providing an engaging and dynamic chatting experience.

## Features

- **Random Matching**: Users are matched randomly to initiate a conversation.
- **Prompt-Based Communication**: Once matched, users answer 7 questions, with each question allowing only 7 seconds for a response.
- **Simultaneous Response Display**: Answers are displayed only when both users have responded to each question.
- **Friendship Option**: At the end of the session, users can decide to share their emails to become friends.
- **Future Enhancements**: Plans to add in-app chat functionality and more sophisticated user management features.

## Technologies Used

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) - Designed a responsive frontend using a mobile-first approach.
- **Libraries**:
  - `axios`: ^1.7.2
  - `react`: ^18
  - `react-dom`: ^18
  - `socket.io-client`: ^4.7.5

### Backend
- **Framework**: [Express.js](https://expressjs.com/) - Implemented RESTful APIs.
- **Database**: [MongoDB](https://www.mongodb.com/) - Managed username information.
- **Libraries**:
  - `cors`: ^2.8.5
  - `dotenv`: ^16.4.5
  - `express`: ^4.19.2
  - `http`: ^0.0.1-security
  - `mongodb`: ^6.8.0
  - `nodemon`: ^3.1.4
  - `socket.io`: ^4.7.5

### WebSockets
- **Implementation**: Used [Socket.IO](https://socket.io/) for detailed WebSocket implementation, handling matching, communication, and connection error management.

## Getting Started

To run the application locally, follow these steps:

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ammarhaider16/7-chat.git
   ```
2. Navigate to the project directory:
   ```bash
   cd 7-chat
   ```

### Frontend Setup
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the frontend application:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the backend directory and add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=4000
   ```
3. Run the backend server:
   ```bash
   npm run dev
   ```

## Usage

Visit `http://localhost:3000` to view the frontend application. The backend server should be running on `http://localhost:4000`.

## Demo

Check out a video demonstration of 7Chat on [YouTube](https://www.youtube.com/watch?v=OEDIiK80tI8).

## Deployment

The application is deployed and can be accessed at [7Chat](http://7-chat-frontend-env.eba-tyhhxjsz.us-east-2.elasticbeanstalk.com/).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

Distributed under the MIT License. See [LICENSE] for more information.

## Contact

GitHub: [@ammarhaider16](https://github.com/ammarhaider16)  
Project Link: [7Chat Repository](https://github.com/ammarhaider16/7-chat)
