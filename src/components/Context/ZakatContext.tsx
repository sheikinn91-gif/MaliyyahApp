import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// 1. Interface untuk keputusan zakat
interface ZakatResults {
  pendapatan: number;
  kripto: number;
  harta: number;
  logam: number;
}

// 2. Interface untuk data pengguna (digunakan dalam login)
interface UserData {
  name: string;
  location: string;
  occupation: string;
  email?: string;
  birthYear?: string;
  monthlyIncome?: number;
  zakat_pendapatan?: number;
  zakat_logam?: number; // Ditambah untuk menyokong nilai emas/logam
  zakat_harta?: number; // Ditambah untuk menyokong nilai harta lain
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
  login: (userData: UserData) => void; // Menggunakan interface UserData
  logout: () => void;
}

const ZakatContext = createContext<ZakatContextType | undefined>(undefined);

export const ZakatProvider = ({ children }: { children: ReactNode }) => {
  // State Profil Pengguna
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("1990");
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  // State Status & UI
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  // State Keputusan Zakat (Ini yang akan dibaca oleh Dashboard)
  const [zakatResults, setZakatResults] = useState<ZakatResults>({
    pendapatan: 0,
    kripto: 0,
    harta: 0,
    logam: 0,
  });

  const openPaymentModal = (results: ZakatResults) => {
    setZakatResults(results);
    setIsModalOpen(true);
  };

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  const login = (userData: UserData) => {
    // Simpan data profil
    setUserName(userData.name || "");
    setLocation(userData.location || "");
    setOccupation(userData.occupation || "");
    setBirthYear(userData.birthYear || "1990");
    setMonthlyIncome(userData.monthlyIncome || 0);

    if (userData.email) setUserEmail(userData.email);

    // KEMASKINI: Simpan nilai logam dan harta ke dalam state zakatResults
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
    setBirthYear("1990");
    setMonthlyIncome(0);
    setIsAuthenticated(false);
    setIsPrivacyMode(false);
    setZakatResults({ pendapatan: 0, kripto: 0, harta: 0, logam: 0 });

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
      }}
    >
      {children}
    </ZakatContext.Provider>
  );
};

export const useZakat = () => {
  const context = useContext(ZakatContext);
  if (!context) {
    throw new Error("useZakat mesti digunakan di dalam ZakatProvider");
  }
  return context;
};
