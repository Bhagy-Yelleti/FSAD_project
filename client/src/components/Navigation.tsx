import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Briefcase, 
  LayoutDashboard, 
  FileText,
  Users
} from "lucide-react";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();

  if (!user) return null;

  return (
    <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="font-display text-2xl font-bold gradient-text">CampusPlace</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location === "/dashboard" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>

              {user.role === 'student' && (
                <Link href="/jobs" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location === "/jobs" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </Link>
              )}

              {(user.role === 'employer' || user.role === 'admin') && (
                <Link href="/jobs" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location === "/jobs" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Jobs
                </Link>
              )}

              {(user.role === 'admin' || user.role === 'officer') && (
                 <Link href="/users" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location === "/users" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`}>
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-indigo-50 hover:bg-indigo-100">
                    <span className="sr-only">Open user menu</span>
                    <span className="font-bold text-indigo-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 cursor-pointer rounded-lg">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
