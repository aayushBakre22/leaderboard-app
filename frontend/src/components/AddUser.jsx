/* eslint-disable react/prop-types */
import axios from "../axios-instance.js";
import { useState } from "react";
import "./AddUser.css";

function AddUser({ toggleForm }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({
    success: false,
    data: "",
  });
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setMessage({
      success: false,
      data: "",
    });
    e.preventDefault();
    try {
      let newUser = { name, username };
      if (avatar) {
        newUser = { ...newUser, avatar };
      }

      const response = await axios.post("/createUser", newUser, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({ success: true, data: response.data.message });
      setLoading(false);
    } catch (error) {
      setMessage({ success: false, data: error.response.data.error });
      setLoading(false);
    }
  };

  const handleBackgroundClick = () => {
    toggleForm();
  };

  return (
    <div className="background" onClick={handleBackgroundClick}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="btn-form-close" onClick={toggleForm}>
          X
        </button>
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Avatar</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
            />
            {avatarPreview && (
              <>
                <div className="avatar-preview">
                  <img src={avatarPreview} alt="Avatar Preview" />
                </div>
                <button className="btn-remove-image" onClick={handleRemoveFile}>
                  Remove File
                </button>
              </>
            )}
          </div>
          {message.data && (
            <p className={`${!message.success ? "error" : ""} form-message`}>
              {message.data}
            </p>
          )}
          <button type="submit" className="btn-form-submit" disabled={loading}>
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
