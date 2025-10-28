// components/login-page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { CreditCard as CreditCardIcon } from 'lucide-react';

// Define types for props and state
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

type InputProps = {
  id: string;
  type: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
};

type IconProps = {
  className?: string;
};

interface AppUser {
  id: string;
  name: string;
  password?: string;
  role: "user" | "admin";
  pages: string[];
}

// Reused UI Components
const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", className = "", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-lg bg-white ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 border-b rounded-t-lg ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({ id, type, placeholder, value, onChange, className = "", required = false, disabled = false }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className}`}
    required={required}
    disabled={disabled}
  />
);

const Label: React.FC<LabelProps> = ({ htmlFor, children, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
    {children}
  </label>
);

const UserIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Constants for Google Sheet (Login Data)
const PUBLIC_SHEET_ID_LOGIN = "1emeuGQFFzKjEIk51WBeM2r_hGwjXhUqcvoho2fmqmBM";
const LOGIN_SHEET_NAME = "Login";

// LoginPage Component
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
          const id = row.c[1]?.v;
          const pass = row.c[2]?.v;
          const role = row.c[3]?.v;
          const pagesString = row.c[4]?.v;

          let pages: string[] = [];
          if (pagesString && pagesString.toLowerCase().trim() === "all") {
            pages = allPossiblePages;
          } else if (pagesString) {
            pages = pagesString
              .split(",")
              .map((p: string) => {
                const pageId = pageNameMapping[p.trim().toLowerCase()];
                return pageId;
              })
              .filter(Boolean)
              .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
          }

          return {
            id: id ? String(id).trim() : '',
            name: id ? String(id).trim() : '',
            password: pass ? String(pass).trim() : '',
            role: role || "user",
            pages: pages,
          };
        }).filter((user: AppUser) => user.id);

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
      setError("Please enter both User ID and Password");
      return;
    }

    const foundUser = users.find(
      (user) => user.id === trimmedUserId && user.password === trimmedPassword
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError("Invalid User ID or Password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg rounded-xl">
        <CardHeader className="text-center bg-slate-600 text-white rounded-t-xl py-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            PeteApp Login
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && users.length === 0 ? (
            <div className="text-center text-slate-600">Loading user data...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-slate-700">
                  User ID
                </Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 p-2 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 p-2 rounded-md"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-slate-600 hover:bg-slate-700 transition-colors duration-200 py-2.5 rounded-md"
                disabled={isLoading}
              >
                <LockIcon className="h-4 w-4 mr-2" />
                Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;