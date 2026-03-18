import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useZakat } from "@/components/Context/ZakatContext";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";

function SignUp() {
  const {
    setUserName,
    setUserEmail,
    setLocation,
    setOccupation: setCtxOccupation,
    setIsAuthenticated,
  } = useZakat();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // States
  const [formName, setFormName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formName.trim()) newErrors.userName = "Nama pengguna diperlukan";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email tidak sah";
    if (password.length < 8) newErrors.password = "Minimum 8 aksara";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Kata laluan tidak padan";
    if (!userLocation) newErrors.location = "Sila pilih daerah";
    if (!occupation.trim()) newErrors.occupation = "Sila masukkan pekerjaan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formName.trim().toLowerCase(),
          password: password,
          location: userLocation,
          occupation: occupation.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- LOGIK PENTING: KEMASKINI STATE & STORAGE ---

        // 1. Simpan ke Context supaya UI berubah serta-merta
        setUserName(formName);
        setUserEmail(email);
        if (setLocation) setLocation(userLocation);
        if (setCtxOccupation) setCtxOccupation(occupation);
        setIsAuthenticated(true);

        // 2. Simpan ke LocalStorage supaya data tidak hilang jika refresh/pindah page
        localStorage.setItem(
          "maliyyah_user",
          JSON.stringify({
            username: formName,
            email: email,
            location: userLocation,
            occupation: occupation,
          }),
        );

        toast.success(`Akaun Berjaya Dicipta!`, {
          description: `Selamat datang ke Maliyyah, ${formName}.`,
        });

        // Beralih terus ke Dashboard
        navigate("/");
      } else {
        toast.error(data.detail || "Pendaftaran gagal. Sila cuba lagi.");
      }
    } catch (error) {
      toast.error("Ralat sambungan ke server. Sila pastikan FastAPI aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  const sabahDistricts = [
    "Kota Kinabalu",
    "Penampang",
    "Putatan",
    "Lahad Datu",
    "Sandakan",
    "Tawau",
    "Tuaran",
    "Papar",
    "Keningau",
    "Beaufort",
    "Sipitang",
    "Kudat",
    "Ranau",
    "Beluran",
    "Nabawan",
    "Semporna",
    "Kunak",
    "Kota Belud",
    "Tongod",
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-2xl ring-1 ring-slate-200">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-4xl font-black italic text-emerald-600 tracking-tighter">
            MALIYYAH<span className="text-slate-900">.</span>
          </CardTitle>
          <CardDescription className="font-semibold text-slate-500">
            Daftar akaun untuk ekosistem kewangan anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="userName">Nama Pengguna</Label>
              <Input
                id="userName"
                className={`rounded-xl h-11 ${errors.userName ? "border-red-500" : ""}`}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="cth: sheikin"
              />
              {errors.userName && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.userName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className={`rounded-xl h-11 ${errors.email ? "border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sheikin@example.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`rounded-xl h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm">Sahkan Kata Laluan</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  className={`rounded-xl h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="occupation" className="flex items-center gap-2">
                <Briefcase size={14} /> Pekerjaan
              </Label>
              <Input
                id="occupation"
                className={`rounded-xl h-11 ${errors.occupation ? "border-red-500" : ""}`}
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="cth: Pengurus"
              />
              {errors.occupation && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.occupation}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <MapPin size={14} /> Daerah di Sabah
              </Label>
              <Select onValueChange={setUserLocation}>
                <SelectTrigger
                  className={`rounded-xl h-11 ${errors.location ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Pilih Daerah" />
                </SelectTrigger>
                <SelectContent>
                  {sabahDistricts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg font-bold rounded-xl mt-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={20} /> CIPTA AKAUN
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Dah ada akaun?{" "}
              <Link
                to="/login"
                className="text-emerald-600 font-bold hover:underline"
              >
                Log Masuk
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
