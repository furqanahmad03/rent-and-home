"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Home, 
  Heart, 
  Edit, 
  Save, 
  X,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalHouses: number;
  totalFavorites: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalHouses: 0, totalFavorites: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch user profile and stats
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserProfile();
      fetchUserStats();
    }
  }, [status, session]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // For now, we'll use session data since we don't have a user profile API
      if (session?.user) {
        setProfile({
          id: session.user.id,
          name: session.user.name || "User",
          email: session.user.email || "",
          createdAt: new Date().toISOString(), // Placeholder
          updatedAt: new Date().toISOString() // Placeholder
        });
        setEditForm({
          name: session.user.name || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Fetch user's houses count
      const housesResponse = await fetch('/api/user/houses');
      const housesData = await housesResponse.json();
      
      // Fetch user's favorites count
      const favoritesResponse = await fetch('/api/favorites');
      const favoritesData = await favoritesResponse.json();
      
      setStats({
        totalHouses: housesData.data?.length || 0,
        totalFavorites: favoritesData.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      name: profile?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // Real-time password validation
    if (name === 'newPassword' || name === 'confirmPassword') {
      validatePassword();
    }
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = editForm;
    
    // Clear previous toasts
    toast.dismiss();
    
    if (newPassword) {
      // Check minimum length
      if (newPassword.length < 8) {
        toast.error('Password must be at least 8 characters long', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // Check for uppercase letter
      if (!/[A-Z]/.test(newPassword)) {
        toast.error('Password must contain at least one uppercase letter', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // Check for lowercase letter
      if (!/[a-z]/.test(newPassword)) {
        toast.error('Password must contain at least one lowercase letter', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // Check for number
      if (!/\d/.test(newPassword)) {
        toast.error('Password must contain at least one number', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // Check for special character
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        toast.error('Password must contain at least one special character', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // Check if passwords match
      if (confirmPassword && newPassword !== confirmPassword) {
        toast.error('Passwords do not match', {
          icon: '⚠️',
          duration: 3000,
        });
        return false;
      }
      
      // All validations passed
      if (confirmPassword && newPassword === confirmPassword) {
        toast.success('Password meets all requirements!', {
          icon: '✅',
          duration: 2000,
        });
        return true;
      }
    }
    
    return true;
  };

  const handleSave = async () => {
    try {
      // Validate password change if new password is provided
      if (editForm.newPassword) {
        if (!editForm.currentPassword) {
          toast.error('Current password is required to change password', {
            icon: '⚠️',
            duration: 4000,
          });
          return;
        }
        
        // Run password validation
        if (!validatePassword()) {
          return;
        }
        
        if (editForm.newPassword !== editForm.confirmPassword) {
          toast.error('New passwords do not match', {
            icon: '⚠️',
            duration: 4000,
          });
          return;
        }
      }

      // TODO: Implement profile update API
      // For now, just update local state
      if (profile) {
        setProfile({
          ...profile,
          name: editForm.name,
          updatedAt: new Date().toISOString()
        });
      }
      setEditing(false);
      
      // Clear password fields
      setEditForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast.success('Profile updated successfully!', {
        icon: '✅',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        icon: '❌',
        duration: 4000,
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and view your activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              {!editing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="your.email@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  {/* Password Change Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Change Password (Optional)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <Input
                          name="currentPassword"
                          type="password"
                          value={editForm.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input
                          name="newPassword"
                          type="password"
                          value={editForm.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile?.name}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile?.email}</p>
                      <p className="text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Member since</p>
                      <p className="font-medium">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalHouses}</p>
                    <p className="text-sm text-gray-600">Properties Listed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.totalFavorites}</p>
                    <p className="text-sm text-gray-600">Favorited Properties</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col !gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  My Listings
                </Button>
              </Link>
              <Link href="/favorites">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  My Favorites
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Add New Property
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge variant="outline">Standard</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">
                    {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 