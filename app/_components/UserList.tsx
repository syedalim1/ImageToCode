import axios from "axios";
import React from "react";



const  fetchUsers = async()=>{
  const response= await axios.get("/api/users");
  
  console.log(response.data,"response");
  
  return response.data;
}

export default async function UserList() {
  const users = await fetchUsers();

  return (
    <div>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.credits}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
