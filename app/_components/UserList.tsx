import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  credits: number;
}

async function fetchUsers(): Promise<User[]> {
  // Use absolute URL with the NEXT_PUBLIC_SITE_URL environment variable or fallback to relative URL for client-side
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const response = await fetch(`${baseUrl}/api/admin/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
