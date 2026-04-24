// src/context/authContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
} from "../lib/API";
import { initSocket, disconnectSocket } from "../lib/Socket";
import toast from "react-hot-toast";

// ============================================
// INTERFACES
// ============================================

interface User {
  id: string;
  email: string;
  name: string;
  role: "donor" | "beneficiary" | "admin";
  phone?: string;
  address?: string;
  donorProfile?: {
    organizationName: string;
    businessType: string;
    isVerified: boolean;
  };
  beneficiaryProfile?: {
    organizationType: string;
    isVerified: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// ============================================
// CRÉATION DU CONTEXTE
// ============================================

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ============================================
// PROVIDER
// ============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        initSocket(userData.id);

        // Vérifier que le token est toujours valide
        getProfile()
          .then((res) => {
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
          })
          .catch(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            disconnectSocket();
          });
      } catch (error) {
        console.error("Erreur parsing user:", error);
      }
    }
    setLoading(false);
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      const { token, user: userData } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      initSocket(userData.id);
      toast.success("Connexion réussie !");

      // Redirection selon le rôle
      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "donor":
          navigate("/donor");
          break;
        case "beneficiary":
          navigate("/ben");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);

      // Afficher l'erreur du backend
      if (error.data?.message) {
        toast.error(error.data.message);
      }

      // Afficher les erreurs de validation détaillées
      if (error.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      }
      // Erreur réseau
      if (error.message === "Failed to fetch") {
        toast.error(
          "Impossible de contacter le serveur. Vérifiez que le backend est démarré.",
        );
      }

      throw error;
    }
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (userData: any) => {
    try {
      await apiRegister(userData);
      toast.success(
        "Inscription réussie ! Vous pouvez maintenant vous connecter.",
      );
      navigate("/auth?mode=signin");
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);

      if (error.data?.message) {
        toast.error(error.data.message);
      }

      if (error.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      }

      throw error;
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    disconnectSocket();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  // ============================================
  // UPDATE USER
  // ============================================
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK PERSONNALISÉ
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
