import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
