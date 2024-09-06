import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import "../css/profile.css";

function Profile() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pin: '',
  })
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Error parsing JWT", e);
      return null;
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
        const payload = parseJwt(token);
        if (!payload || !payload.userId) {
          console.error("Invalid token payload");
          return;
        }
        const userId = payload.userId;
        try {
          // const token = localStorage.getItem('authToken');
          const response = await axios.get(`/api/userProfile?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUserInfo(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchUserData();
  }, [])

  const saveChanges = async (userInfo) => {
    const token = localStorage.getItem("authToken");
    const userId = parseJwt(token).userId;
    try {
      // Save changes
      await axios.post(`/api/updateUserProfile`,
        { userId, ...userInfo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Fetch updated user info
      const response = await axios.get(`/api/userProfile?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update state with the new user info
      setUserInfo(response.data);
      setIsEditMode(false); // Optionally, exit edit mode
  
      // Show success message
      toast.success("Profile updated successfully");
    } catch (error) {
      // Show error message
      toast.error("Error saving profile changes");
      console.error("Error saving profile changes", error);
    }
  };
  


  const toggleEditMode = () => {
    if (isEditMode) {
      saveChanges(userInfo);
    } else {
      setIsEditMode(true);
    }
  }
  return (
    <>
      <div className="profile-container">
        <div className="navbar">
        </div>
        <div className="profile-header">
        <ToastContainer />
          <h1>Profile Settings</h1><hr />
        </div>
        <button onClick={toggleEditMode}>
          {isEditMode ? 'Save' : 'Edit'}
        </button>
        {isAuthenticated ? (
          <>
            <table>
              <tbody>
                <tr><td><b>UserName :</b></td>
                  <td>{isEditMode ? (
                    <input type="text" value={userInfo.username} onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} />
                  ) : (
                    userInfo.username
                  )}</td>
                </tr>
                <tr><td><b>Email :</b></td>
                  <td>{isEditMode ? (
                    <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
                  ) : (
                    userInfo.email
                  )}</td>
                </tr>
                <tr><td><b>Phone No :</b></td>
                  <td>{isEditMode ? (
                    <input type="text" value={userInfo.phone || ""} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} pattern="\d{10}" title="Phone number should be 10 digits" maxLength="10" placeholder="Enter 10-digit phone number" />
                  ) : (
                    userInfo.phone
                  )}</td>
                </tr>
                <tr><td><b>Address :</b></td>
                  <td>{isEditMode ? (
                    <input type="text" value={userInfo.address || ""} onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
                  ) : (
                    userInfo.address
                  )}</td>
                </tr>
                <tr><td><b> City :</b></td>
                  <td>{isEditMode ? (
                    <input type="text" value={userInfo.city || ""} onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })} />
                  ) : (
                    userInfo.city
                  )}</td>
                </tr>
                <tr><td><b> State :</b></td>
                  <td>{isEditMode ? (
                    <input type="text" value={userInfo.state || ""} onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })} />
                  ) : (
                    userInfo.state
                  )}</td>
                </tr>
                <tr><td><b> PIN Code :</b></td>
                  <td>{isEditMode ? (
                    <input type="Number" value={userInfo.pincode || ""} onChange={(e) => setUserInfo({ ...userInfo, pincode: e.target.value })} />
                  ) : (
                    userInfo.pincode
                  )}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div><h1>Please Login First</h1></div>
          </>
        )}
      </div>
    </>
  )
}

export default Profile;