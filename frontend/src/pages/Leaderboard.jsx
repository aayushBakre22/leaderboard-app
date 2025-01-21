import axios from "../axios-instance.js";
import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { io } from "socket.io-client";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  const getTopUsers = async () => {
    const response = await axios.get("/topUsers");
    //console.log(response.data.data);
    setUsers(response.data.data);
  };

  const updateUserPoints = (newUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === newUser._id ? { ...user, points: newUser.points } : user
      )
    );
  };

  useEffect(() => {
    getTopUsers();
  }, []);

  useEffect(() => {
    document.title = 'Leaderboard';
    const socket = io("http://localhost:3000"); 

    socket.on("pointsUpdated", (updatedUser) => {
      //console.log("Points updated: ", updatedUser);
      updateUserPoints(updatedUser); 
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="leaderboard-container">
        {users &&
          users.map((user, index) => (
            <div className="leaderboard-item" key={user._id}>
              <div className="rank">{index + 1}.</div>
              <div className="user-info">
                <div className="avatar">
                  <img src={user.avatar} alt="" />
                </div>
                <div className="name">{user.name}</div>
              </div>

              <div className="points">
                {user.points} {user.points === 1 ? "point" : "points"}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;
