import axios from "../axios-instance.js";
import AddUser from "../components/AddUser.jsx";
import "./styles/Users.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(false);

  const toggleForm = () => {
    setForm((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectUser = (user) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const handleClaim = async () => {
    if (selectedUser) {
      const response = await axios.post(
        "/claimPoints",
        { userId: selectedUser._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(response.data.data);
    } else {
      alert("Please select a user first.");
    }
  };

  const getUsers = async () => {
    const response = await axios.get("/allUsers");
    //console.log(response.data.data);
    setUsers(response.data.data);
  };

  const searchUsers = async () => {
    const response = await axios.get(`/search/${searchQuery}`);
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
    if (searchQuery === "") {
      getUsers();
    } else {
      searchUsers();
    }
  }, [searchQuery]);

  useEffect(() => {
    document.title = "Users";
    const socket = io("https://leaderboard-app-oqvs.onrender.com");
    socket.on("pointsUpdated", (updatedUser) => {
      //console.log("Points updated: ", updatedUser);
      updateUserPoints(updatedUser);
    });

    socket.on("userCreated", (newUser) => {
      //console.log("User created: ", newUser);
      setUsers((prev) => {
        return [newUser, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="users">
        <h1>Users</h1>
        <div className="user-list">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or username"
              className="search-bar"
            />
            <button className="add-user-button" onClick={toggleForm}>
              Add New User
            </button>
          </div>
          <div className="user-items">
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item
                ${selectedUser?._id === user._id ? "selected" : ""}
              `}
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-username">@{user.username}</div>
                  <div className="user-points">{user.points} points</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleClaim}
            className="claim-button"
            disabled={!selectedUser}
          >
            CLAIM POINTS
          </button>
        </div>
      </div>

      {form && <AddUser toggleForm={toggleForm} />}
    </>
  );
};

export default Users;
