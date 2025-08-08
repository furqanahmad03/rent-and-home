"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('profile');
  const { locale } = useParams();
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
    // Reset form to original values
    setEditForm({
      name: profile?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (editForm.newPassword && !editForm.currentPassword) {
      toast.error('Current password is required to change password', {
        icon: '⚠️',
        duration: 4000,
      });
      return false;
    }
    
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long', {
        icon: '⚠️',
        duration: 4000,
      });
      return false;
    }
    
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      toast.error('New passwords do not match', {
        icon: '⚠️',
        duration: 4000,
      });
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just simulate the update
      
      // Update local state
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
      
      toast.success(t('profileUpdated'), {
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
        <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <ArrowLeft className="w-4 h-4" />
          {t('backToDashboard')}
        </Link>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('manageAccount')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('personalInfo')}
              </CardTitle>
              {!editing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('edit')}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('name')}</label>
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder={t('enterName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('email')}</label>
                    <Input
                      name="email"
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder={t('enterEmail')}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('emailCannotBeChanged')}</p>
                  </div>
                  
                  {/* Password Change Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">{t('changePassword')}</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('currentPassword')}</label>
                        <Input
                          name="currentPassword"
                          type="password"
                          value={editForm.currentPassword}
                          onChange={handleInputChange}
                          placeholder={t('enterCurrentPassword')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('newPassword')}</label>
                        <Input
                          name="newPassword"
                          type="password"
                          value={editForm.newPassword}
                          onChange={handleInputChange}
                          placeholder={t('enterNewPassword')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('confirmPassword')}</label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={handleInputChange}
                          placeholder={t('confirmNewPassword')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {t('saveChanges')}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {t('cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile?.name}</p>
                      <p className="text-sm text-gray-600">{t('fullName')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile?.email}</p>
                      <p className="text-sm text-gray-600">{t('emailAddress')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t('memberSince')}</p>
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
                {t('accountStats')}
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
                    <p className="text-sm text-gray-600">{t('propertiesListed')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.totalFavorites}</p>
                    <p className="text-sm text-gray-600">{t('favoritedProperties')}</p>
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
              <CardTitle>{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col !gap-3">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  {t('myListings')}
                </Button>
              </Link>
              <Link href={`/${locale}/favorites`}>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  {t('myFavorites')}
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  {t('addNewProperty')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('accountStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('emailVerified')}</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {t('verified')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('accountType')}</span>
                  <Badge variant="outline">{t('standard')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('lastUpdated')}</span>
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