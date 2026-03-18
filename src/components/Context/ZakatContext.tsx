import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// 1. Interface Definisi
interface ZakatResults {
  pendapatan: number;
  kripto: number;
  harta: number;
  logam: number;
}

interface UserData {
  name: string;
  location: string;
  occupation: string;
  email?: string;
  birthYear?: string;
  monthlyIncome?: number;
  zakat_pendapatan?: number;
  zakat_logam?: number;
  zakat_harta?: number;
  zakat_kripto?: number;
}

interface ZakatContextType {
  userName: string;
  userEmail: string;
  location: string;
  occupation: string;
  birthYear: string;
  monthlyIncome: number;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  zakatResults: ZakatResults;
  isPrivacyMode: boolean;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setLocation: (loc: string) => void;
  setOccupation: (occ: string) => void;
  setBirthYear: (year: string) => void;
  setMonthlyIncome: (income: number) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  setZakatResults: (results: ZakatResults) => void;
  openPaymentModal: (results: ZakatResults) => void;
  togglePrivacyMode: () => void;
  login: (userData: UserData) => void;
  logout: () => void;
  resetZakatResults: () => void;
}

const ZakatContext = createContext<ZakatContextType | undefined>(undefined);

export const ZakatProvider = ({ children }: { children: ReactNode }) => {
  const getInitialUser = () => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("maliyyah_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  };

  const initialUser = getInitialUser();

  const [userName, setUserName] = useState<string>(
    initialUser?.name || "Pengguna",
  );
  const [userEmail, setUserEmail] = useState<string>(initialUser?.email || "");
  const [location, setLocation] = useState<string>(initialUser?.location || "");
  const [occupation, setOccupation] = useState<string>(
    initialUser?.occupation || "",
  );
  const [birthYear, setBirthYear] = useState<string>(
    initialUser?.birthYear || "1990",
  );
  const [monthlyIncome, setMonthlyIncome] = useState<number>(
    initialUser?.monthlyIncome || 0,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof window !== "undefined"
      ? !!localStorage.getItem("maliyyah_token")
      : false,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  const [zakatResults, setZakatResults] = useState<ZakatResults>({
    pendapatan: initialUser?.zakat_pendapatan || 0,
    kripto: initialUser?.zakat_kripto || 0,
    harta: initialUser?.zakat_harta || 0,
    logam: initialUser?.zakat_logam || 0,
  });

  useEffect(() => {
    const user = getInitialUser();
    if (user) {
      setUserName(user.name || "Pengguna");
      setUserEmail(user.email || "");
      setLocation(user.location || "");
      setOccupation(user.occupation || "");
      setBirthYear(user.birthYear || "1990");
      setMonthlyIncome(user.monthlyIncome || 0);
      setZakatResults({
        pendapatan: user.zakat_pendapatan || 0,
        kripto: user.zakat_kripto || 0,
        harta: user.zakat_harta || 0,
        logam: user.zakat_logam || 0,
      });
    }
  }, []);

  // --- FUNGSI RESET YANG BETUL ---
  const resetZakatResults = () => {
    // 1. Reset UI (Banner & Kad jadi 0)
    setZakatResults({ pendapatan: 0, kripto: 0, harta: 0, logam: 0 });

    // 2. Reset LocalStorage
    const saved = localStorage.getItem("maliyyah_user");
    if (saved) {
      const user = JSON.parse(saved);
      const updatedUser = {
        ...user,
        zakat_pendapatan: 0,
        zakat_kripto: 0,
        zakat_harta: 0,
        zakat_logam: 0,
      };
      localStorage.setItem("maliyyah_user", JSON.stringify(updatedUser));
    }
  };

  const openPaymentModal = (results: ZakatResults) => {
    setZakatResults(results);
    setIsModalOpen(true);
  };

  const togglePrivacyMode = () => setIsPrivacyMode((prev) => !prev);

  const login = (userData: UserData) => {
    setUserName(userData.name || "");
    setUserEmail(userData.email || "");
    setLocation(userData.location || "");
    setOccupation(userData.occupation || "");
    setBirthYear(userData.birthYear || "1990");
    setMonthlyIncome(userData.monthlyIncome || 0);
    localStorage.setItem("maliyyah_user", JSON.stringify(userData));
    setZakatResults({
      pendapatan: userData.zakat_pendapatan || 0,
      kripto: userData.zakat_kripto || 0,
      harta: userData.zakat_harta || 0,
      logam: userData.zakat_logam || 0,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName("");
    setUserEmail("");
    setLocation("");
    setOccupation("");
    setMonthlyIncome(0);
    setZakatResults({ pendapatan: 0, kripto: 0, harta: 0, logam: 0 });
    setIsAuthenticated(false);
    localStorage.removeItem("maliyyah_token");
    localStorage.removeItem("maliyyah_user");
  };

  return (
    <ZakatContext.Provider
      value={{
        userName,
        userEmail,
        location,
        occupation,
        birthYear,
        monthlyIncome,
        isAuthenticated,
        isModalOpen,
        zakatResults,
        isPrivacyMode,
        setUserName,
        setUserEmail,
        setLocation,
        setOccupation,
        setBirthYear,
        setMonthlyIncome,
        setIsAuthenticated,
        setIsModalOpen,
        setZakatResults,
        openPaymentModal,
        togglePrivacyMode,
        login,
        logout,
        resetZakatResults,
      }}
    >
      {children}
    </ZakatContext.Provider>
  );
};

export const useZakat = () => {
  const context = useContext(ZakatContext);
  if (!context)
    throw new Error("useZakat mesti digunakan di dalam ZakatProvider");
  return context;
};
