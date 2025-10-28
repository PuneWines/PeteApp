"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
export interface AppUser {
  id: string;
  name: string;
  password?: string;
  role: "user" | "admin";
  pages: string[];
}

// --- SVG ICONS ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

// --- CONSTANTS ---
const PUBLIC_SHEET_ID_LOGIN = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";
const LOGIN_SHEET_NAME = "Login";

// --- LoginPage Component ---
const LoginPage: React.FC<{ onLogin: (user: AppUser) => void }> = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID_LOGIN}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(LOGIN_SHEET_NAME)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status} - ${response.statusText}`);
        }
        let text = await response.text();
        text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
        const jsonData = JSON.parse(text);
        if (!jsonData.table || !jsonData.table.rows) {
          throw new Error("User data is not in the expected format (no table/rows).");
        }
        const allPossiblePages = ['dashboard', 'form', 'receiving', 'reports', 'settings', 'admin_panel'];
        const pageNameMapping: { [key: string]: string } = {
          'dashboard': 'dashboard',
          'add entry': 'form',
          'form': 'form',
          'receive entry': 'receiving',
          'receiving': 'receiving',
          'reports': 'reports'
        };
        
        const fetchedUsers: AppUser[] = jsonData.table.rows.slice(1).map((row: any) => {
          // Corrected column indices based on your sheet structure:
          // Column 0: Name
          // Column 1: User Id
          // Column 2: Password
          // Column 3: Role
          // Column 4: Pages
          const name = row.c[0]?.v; // Name from column 0
          const id = row.c[1]?.v;   // User Id from column 1
          const pass = row.c[2]?.v; // Password from column 2
          const role = row.c[3]?.v; // Role from column 3
          const pagesString = row.c[4]?.v; // Pages from column 4
          
          let pages: string[] = [];
          if (pagesString && pagesString.toLowerCase().trim() === "all") {
            pages = allPossiblePages;
          } else if (pagesString) {
            pages = pagesString.split(",").map((p: string) => pageNameMapping[p.trim().toLowerCase()]).filter(Boolean).filter((v: string, i: number, s: string[]) => s.indexOf(v) === i);
          }
          
          return {
            id: id ? String(id).trim() : '',
            name: name ? String(name).trim() : '', // Store the actual name from column 0
            password: pass ? String(pass).trim() : '',
            role: role || "user",
            pages: pages,
          };
        }).filter((user: AppUser) => user.id && user.name); // Filter out users without id or name

        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedUserId = userId.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUserId || !trimmedPassword) {
      setError("Please enter both Username and Password");
      return;
    }
    const foundUser = users.find(
      (user) => user.id === trimmedUserId && user.password === trimmedPassword
    );
    if (foundUser) {
      // Store ALL user data in localStorage (without password for security)
      const userToStore = {
        id: foundUser.id,
        name: foundUser.name, // This will now be the actual name from column 0
        role: foundUser.role,
        pages: foundUser.pages
      };
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      // Call the onLogin callback
      onLogin(foundUser);
    } else {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card className="bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-2xl shadow-purple-300/50 rounded-2xl">
          <CardHeader className="text-center pt-12 pb-10">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Pete App
            </CardTitle>
          </CardHeader>
          <CardContent className="px-12 pb-12 pt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-slate-600 font-medium flex items-center gap-2 text-sm">
                    <UserIcon className="text-purple-500" />
                    Username (User ID)
                  </Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="bg-slate-50/50 border-slate-300 h-12 text-base focus:border-purple-400 focus:ring-purple-400/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-600 font-medium flex items-center gap-2 text-sm">
                    <LockIcon className="text-purple-500" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50/50 border-slate-300 h-12 text-base focus:border-purple-400 focus:ring-purple-400/50"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center pt-1">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity duration-300 text-white font-bold py-3 text-lg h-14 rounded-lg shadow-lg shadow-purple-500/40"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="fixed bottom-0 w-full py-3 text-center text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600">
        Powered by <a href="https://www.botivate.in/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">Botivate</a>
      </footer>
    </div>
  );
};

export default LoginPage;