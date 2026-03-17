import { X, ExternalLink, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmIntent: (provider: string) => void;
  totalAmount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirmIntent,
  totalAmount,
}: PaymentModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Biller Code ${text} disalin!`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-slate-900">
            Pilih Cara Bayaran
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Jumlah Zakat
            </span>
            <div className="text-3xl font-black text-emerald-600">
              RM{" "}
              {totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Opsi 1: MUIS */}
          <button
            onClick={() => onConfirmIntent("MUIS")}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="h-10 w-10 flex items-center justify-center bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <ExternalLink className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-4 text-left">
              <div className="font-bold text-slate-900 leading-tight">
                Portal Rasmi MUIS
              </div>
              <div className="text-xs text-slate-500">
                Bayar terus via FPX (Sabah)
              </div>
            </div>
          </button>

          {/* Opsi 2: JomPAY */}
          <div className="relative w-full flex flex-col p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="flex items-center w-full">
              <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4 text-left flex-1">
                <div className="font-bold text-slate-900 leading-tight">
                  JomPAY
                </div>
                <div className="text-xs text-slate-500">
                  Biller Code:{" "}
                  <span className="font-bold text-blue-700">55236</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard("55236")}
                className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md font-bold hover:bg-blue-700"
              >
                SALIN
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 italic">
              Ref-1: Masukkan Nombor IC anda
            </p>
          </div>

          {/* Opsi 3: SnapNPay */}
          <button
            onClick={() => onConfirmIntent("SnapNPay")}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="h-10 w-10 flex items-center justify-center bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
              <Smartphone className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-4 text-left">
              <div className="font-bold text-slate-900 leading-tight">
                SnapNPay
              </div>
              <div className="text-xs text-slate-500">
                Imbas QR & Bayar Segera
              </div>
            </div>
          </button>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Resit rasmi akan dihantar ke emel berdaftar anda selepas
              pengesahan transaksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
