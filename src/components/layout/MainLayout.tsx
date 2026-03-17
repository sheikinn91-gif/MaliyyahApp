import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

// IMPORT YANG BARU
import { useZakat } from "@/components/Context/ZakatContext";
import PaymentModal from "@/components/Context/PaymentModal";
import { toast } from "sonner";

export default function MainLayout() {
  // 1. Ambil state global dari Context
  const { isModalOpen, setIsModalOpen, zakatResults } = useZakat();

  // 2. Kira jumlah total berdasarkan keputusan zakat terkini dalam context
  const totalAmount =
    zakatResults.pendapatan +
    zakatResults.kripto +
    zakatResults.harta +
    zakatResults.logam;

  // 3. Fungsi untuk mengendalikan pilihan bayaran (MUIS, JomPAY, dll)
  const handleConfirmIntent = (method: string) => {
    if (method === "MUIS") {
      window.open(
        "https://zakat.muis.gov.my/online/",
        "_blank",
        "noopener,noreferrer",
      );
    } else if (method === "SnapNPay") {
      window.open("https://snapnpay.my/", "_blank", "noopener,noreferrer");
    }
    // Jika JomPAY, kita hanya salin (logik salin ada dalam PaymentModal)

    // Tutup modal selepas pilihan dibuat
    setIsModalOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <Separator />

        <div className="p-6">
          {/* Halaman Dashboard atau Zakat akan muncul di sini */}
          <Outlet />
        </div>

        {/* MODAL PEMBAYARAN GLOBAL 
          Ia diletakkan di sini supaya sentiasa "standby" 
          apabila isModalOpen menjadi true dari mana-mana outlet.
        */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmIntent={handleConfirmIntent}
          totalAmount={totalAmount}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
