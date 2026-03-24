"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, LogOut, Mail, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const metadata = user.user_metadata;
  const name = metadata?.full_name || user.email?.split("@")[0] || "User";
  const initial = name.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-soft">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-brand mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {initial}
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-brand">
                {name}
              </h2>
              <p className="text-gray-500 text-sm">Member since {new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={18} className="text-brand" />
              <span className="text-sm">{user.email}</span>
            </div>
            {metadata?.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-brand" />
                <span className="text-sm">{metadata.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border p-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-gold" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-jakarta)] font-bold text-brand">My Orders</h3>
              <p className="text-sm text-gray-500">View order history</p>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border p-6 hover:-translate-y-0.5 transition-transform text-left"
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOut size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-jakarta)] font-bold text-brand">Sign Out</h3>
              <p className="text-sm text-gray-500">Log out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
