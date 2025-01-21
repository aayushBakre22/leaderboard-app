import axios from "../axios-instance.js";
import { useState, useEffect } from "react";
import "./Claims.css";
import { io } from "socket.io-client";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchClaims = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      //console.log(page);
      const response = await axios.get("/getClaims", {
        params: { page, limit: 10 },
        // headers: { "Content-Type": "application/json" },
      });
      const data = response.data.data;
      //console.log(data);

      setClaims((prevClaims) => [...prevClaims, ...data]);

      if (data.length < 10) {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [page]);

  useEffect(() => {
    document.title = "Claims History";
    const socket = io("https://leaderboard-app-oqvs.onrender.com");
    socket.on("claimAdded", (newClaim) => {
      //console.log("Claim added: ", newClaim);
      setClaims((prev) => {
        return [newClaim, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="claims-container" onScroll={handleScroll}>
      <h2>Claims List</h2>
      {claims.length === 0 ? (
        <p>No claims available.</p>
      ) : (
        <ul className="claims-list">
          {claims.map((claim, index) => (
            <li key={index} className="claim-item">
              <p>
                <span className="username">@{claim.user.username}</span> claimed{" "}
                {claim.pointsClaimed} points!
              </p>
              <span className="date">
                {new Date(claim.createdAt).toLocaleString("en-in")}
              </span>
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="loading">Loading...</p>}
      {!hasMore && <p className="no-more">No more claims available.</p>}
    </div>
  );
};

export default Claims;
