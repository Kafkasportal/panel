import { getSupabaseClient } from "@/lib/supabase/client";
import type { User, Permission, UserRole } from "@/types";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _isInitialized: boolean; // Internal flag to prevent multiple initializations
  _unsubscribe: (() => void) | null; // Store unsubscribe function
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Helper function to get permissions based on role
function getPermissionsForRole(role: UserRole): Permission[] {
  const allPermissions: Permission[] = [
    "donations.view",
    "donations.create",
    "donations.edit",
    "donations.delete",
    "members.view",
    "members.create",
    "members.edit",
    "social-aid.view",
    "social-aid.approve",
    "reports.export",
    "settings.manage",
  ];

  switch (role) {
    case "admin":
      return allPermissions; // Admin has all permissions
    case "muhasebe":
      return [
        "donations.view",
        "donations.create",
        "donations.edit",
        "members.view",
        "reports.export",
      ];
    case "gorevli":
      return [
        "donations.view",
        "donations.create",
        "members.view",
        "members.create",
        "social-aid.view",
      ];
    case "uye":
      return ["donations.view", "members.view"];
    default:
      return [];
  }
}

// Helper function to fetch user data from public.users table
async function fetchUserFromDatabase(userId: string): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching user from database:", error);
    return null;
  }

  const role = (data.role || "user") as UserRole;
  const permissions = getPermissionsForRole(role);

  return {
    id: data.id,
    name: data.name || data.email || "Kullanıcı",
    email: data.email,
    phone: undefined,
    role: role,
    avatar: data.avatar_url || undefined,
    isActive: true,
    lastLogin: new Date(),
    permissions: permissions,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _isInitialized: false,
  _unsubscribe: null,

  initializeAuth: () => {
    // Prevent multiple initializations
    set((state) => {
      if (state._isInitialized) {
        return state;
      }
      return { _isInitialized: true };
    });

    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    // Initial session check - only run once
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }: { data: { session: Session | null } }) => {
        if (session?.user) {
          // Fetch user data from public.users table
          const userData = await fetchUserFromDatabase(session.user.id);
          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
            });
          } else {
            // Fallback to basic user data if database fetch fails
            set({
              user: {
                id: session.user.id,
                name: session.user.email || "Kullanıcı",
                email: session.user.email || "",
                role: "user",
                isActive: true,
                permissions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              isAuthenticated: true,
            });
          }
        }
      });

    // Listen for auth changes - only attach once
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          // Fetch user data from public.users table
          const userData = await fetchUserFromDatabase(session.user.id);
          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
            });
          } else {
            // Fallback to basic user data if database fetch fails
            set({
              user: {
                id: session.user.id,
                name: session.user.email || "Kullanıcı",
                email: session.user.email || "",
                role: "user",
                isActive: true,
                permissions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              isAuthenticated: true,
            });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
    );

    // Store unsubscribe function
    set({ _unsubscribe: authListener.subscription.unsubscribe });
  },

  login: async (email: string, password: string) => {
    // Prevent multiple concurrent login attempts
    const state = useUserStore.getState();
    if (state.isLoading) {
      console.log("⏳ Login already in progress, skipping...");
      return false;
    }

    console.log("🔥 Login function called", {
      email,
      passwordLength: password.length,
    });
    set({ isLoading: true, error: null });

    const supabase = getSupabaseClient();

    if (!supabase) {
      set({
        error: "Supabase client is not available",
        isLoading: false,
      });
      return false;
    }

    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("❌ Login error:", authError);
        set({
          error: authError.message || "Giriş yapılamadı",
          isLoading: false,
        });
        return false;
      }

      if (!authData.user) {
        set({
          error: "Kullanıcı bilgisi alınamadı",
          isLoading: false,
        });
        return false;
      }

      // Fetch user data from public.users table
      const userData = await fetchUserFromDatabase(authData.user.id);

      if (!userData) {
        console.warn("⚠️ User data not found in database, using basic user info");
        // Fallback to basic user data
        const role = (authData.user.user_metadata?.role || "user") as UserRole;
        set({
          user: {
            id: authData.user.id,
            name: authData.user.email || "Kullanıcı",
            email: authData.user.email || "",
            role: role,
            isActive: true,
            permissions: getPermissionsForRole(role),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
        console.log("🎉 Login successful (fallback)");
        return true;
      }

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log("🎉 Login successful", { user: userData });
      return true;
    } catch (error) {
      console.error("❌ Login exception:", error);
      set({
        error: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null, isAuthenticated: false, error: null });

    // Cleanup auth listener
    set((state) => {
      if (state._unsubscribe) {
        state._unsubscribe();
        return { _unsubscribe: null };
      }
      return state;
    });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
