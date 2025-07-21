"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Heart, LogOut, Key, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createSupabaseClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { User as SupabaseUser } from '@supabase/supabase-js';

type Favorite = {
  id: string;
  products: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    price: number;
  } | null;
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const fetchUserData = useCallback(async (currentUser: SupabaseUser) => {
    setName(currentUser.user_metadata?.name || "");
    const { data: favoritesData, error } = await supabase
      .from("favorites")
      .select(`id, products(*)`)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      setMessage({ text: 'Could not load your favorites.', type: 'error' });
    } else if (favoritesData) {
      const typedFavorites = favoritesData.map((fav: any) => ({
        id: fav.id,
        products: Array.isArray(fav.products) ? fav.products[0] : fav.products,
      }));
      setFavorites(typedFavorites as Favorite[]);
    }
  }, [supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      await fetchUserData(user);
      setIsLoading(false);
    };

    checkUser();
  }, [supabase, router, fetchUserData]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    if (error) {
      setMessage({ text: "Failed to update profile: " + error.message, type: 'error' });
    } else {
      setMessage({ text: "Profile updated successfully!", type: 'success' });
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (updatedUser) setUser(updatedUser);
    }
    setIsUpdating(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long", type: 'error' });
      return;
    }
    setIsUpdating(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: "Password updated successfully", type: 'success' });
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsUpdating(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      setIsDeleting(true);
      setMessage(null);
      const { error } = await supabase.rpc('delete_user');
      if (error) {
        setMessage({ text: `Failed to delete account: ${error.message}`, type: 'error' });
        setIsDeleting(false);
      } else {
        await supabase.auth.signOut();
        router.push('/?message=Account+deleted+successfully');
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading your account...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">You are not logged in.</p>
          <Button onClick={() => router.push('/auth/login')} className="mt-4">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img src={user.user_metadata?.avatar_url || "/placeholder-user.png"} alt="User Avatar" className="w-full h-full rounded-full object-cover border-4 border-background shadow-md" />
              </div>
              <CardTitle>{name || user.email}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('profile')} className="justify-start"><User className="mr-2 h-4 w-4" /> Profile</Button>
                <Button variant={activeTab === 'password' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('password')} className="justify-start"><Key className="mr-2 h-4 w-4" /> Password</Button>
                <Button variant={activeTab === 'favorites' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('favorites')} className="justify-start"><Heart className="mr-2 h-4 w-4" /> Favorites</Button>
                <Button variant={activeTab === 'danger' ? 'ghost' : 'ghost'} onClick={() => setActiveTab('danger')} className="justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"><Trash2 className="mr-2 h-4 w-4" /> Danger Zone</Button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleSignOut} className="w-full"><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
            </CardFooter>
          </Card>
        </aside>

        <main className="md:col-span-3">
          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-6">
              <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <Input id="email" value={user.email} disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Choose a new password for your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword} disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update Password'}</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'favorites' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Heart className="mr-2 h-5 w-5" /> Your Favorites</CardTitle>
                <CardDescription>Games you've saved for later.</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No Favorites Yet</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Start exploring and add some games to your favorites!</p>
                    <Button onClick={() => router.push('/products')}>Browse Games</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      favorite.products && (
                        <Link href={`/products/${favorite.products.id}`} key={favorite.id} className="group">
                          <Card className="overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg">
                            <div className="aspect-video bg-muted overflow-hidden">
                              <img src={favorite.products.image_url} alt={favorite.products.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{favorite.products.name}</h4>
                              <p className="text-xs text-muted-foreground">{favorite.products.category}</p>
                              <p className="font-bold text-sm mt-1">{formatPrice(favorite.products.price)}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'danger' && (
            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription className="text-destructive/80">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete My Account'}</Button>
              </CardFooter>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
