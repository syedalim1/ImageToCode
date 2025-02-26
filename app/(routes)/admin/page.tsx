import UserList from "@/app/_components/UserList";

// Add dynamic export to prevent prerendering
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UserList />
    </div>
  );
}
