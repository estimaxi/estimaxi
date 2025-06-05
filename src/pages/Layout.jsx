

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { 
  LayoutDashboard, 
  HardHat, 
  FileText, 
  Clock, 
  MessageSquare, 
  User as UserIcon,
  LogOut,
  ChevronDown,
  Settings,
  Home,
  DollarSign // Added for pricing icon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Simple pages that don't need navigation
  const simplePaths = ['/', '/index', '/RoleSelection', '/Welcome', '/Home'];
  
  if (simplePaths.includes(location.pathname)) {
    return <div>{children}</div>;
  }

  // Determine navigation items based on user role
  const getNavItems = () => {
    // Start with a base array that can be added to
    let navItems = [
      { 
        label: 'Dashboard', 
        icon: <LayoutDashboard className="w-5 h-5" />,
        // Default to ProjectOwnerDashboard if role_type is not contractor
        // This ensures a dashboard link is always present if user is logged in
        href: user?.role_type === 'contractor' 
          ? createPageUrl('ContractorDashboard')
          : createPageUrl('ProjectOwnerDashboard') 
      }
    ];

    // Add Pricing Management if user is admin, regardless of their role_type
    if (user?.role === 'admin') {
        navItems.push({
            label: 'Pricing Management',
            icon: <DollarSign className="w-5 h-5" />,
            href: createPageUrl('PricingManagementPage')
        });
    }

    // Add items specific to project_owner
    if (user?.role_type === 'project_owner') {
      navItems.push(
        { 
          label: 'New Estimate', 
          icon: <FileText className="w-5 h-5" />,
          // Make sure 'QuestionnaireFlow' is the correct page for new estimates
          href: createPageUrl('QuestionnaireFlow') 
        },
        { 
          label: 'Contractors', 
          icon: <HardHat className="w-5 h-5" />,
          href: '#' // Placeholder, update as needed
        }
      );
    } 
    // Add items specific to contractor (admin check for pricing is now global)
    else if (user?.role_type === 'contractor') {
      navItems.push(
        { 
          label: 'Projects', 
          icon: <FileText className="w-5 h-5" />,
          href: createPageUrl('ContractorProjects')
        },
        { 
          label: 'Profile', 
          icon: <UserIcon className="w-5 h-5" />,
          href: createPageUrl('ContractorProfile')
        },
        { 
          label: 'Schedule', 
          icon: <Clock className="w-5 h-5" />,
          href: '#' // Placeholder, update as needed
        }
      );
    }
    // If user is admin but has no specific role_type, they will already have Dashboard and Pricing links.
    // No need for the specific `user.role === 'admin' && !user.role_type` block as its covered.

    return navItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to={createPageUrl('index')} className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Estimax</span>
              </Link>
            </div>
            
            {!loading && user && (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        {user.full_name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                      </div>
                      <span className="hidden md:block mr-1">{user.full_name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {!loading && user && (
          <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:pt-16 bg-white border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 ${
                      location.pathname === item.href 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className={`flex-1 ${!loading && user ? 'md:ml-64' : ''} pt-16`}>
          {children}
        </main>
      </div>
    </div>
  );
}

