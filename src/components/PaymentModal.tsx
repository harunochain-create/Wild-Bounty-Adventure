import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  X,
  AlertCircle,
} from 'lucide-react';
import { Transaction } from '../types/slot';
import { sound } from '../utils/soundEngine';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  currency: 'USD' | 'IDR';
  onDepositSuccess: (amount: number, transaction: Transaction) => void;
  onWithdrawSuccess: (amount: number, transaction: Transaction) => void;
  transactions: Transaction[];
  initialTab?: 'DEPOSIT' | 'WITHDRAW' | 'HISTORY';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  currency,
  onDepositSuccess,
  onWithdrawSuccess,
  transactions,
  initialTab = 'DEPOSIT',
}) => {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [depositMethod, setDepositMethod] = useState<'QRIS' | 'VA' | 'EWALLET' | 'CARD' | 'CRYPTO'>('QRIS');
  const [depositAmount, setDepositAmount] = useState<number>(currency === 'IDR' ? 100000 : 50);
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [selectedEwallet, setSelectedEwallet] = useState<string>('GoPay');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Withdraw fields
  const [withdrawAmount, setWithdrawAmount] = useState<number>(currency === 'IDR' ? 100000 : 50);
  const [withdrawBank, setWithdrawBank] = useState<string>('BCA');
  const [withdrawAccNumber, setWithdrawAccNumber] = useState<string>('8291039841');
  const [withdrawAccName, setWithdrawAccName] = useState<string>('ALEX BOUNTY HUNTER');

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDepositConfirm = () => {
    setIsProcessing(true);
    setSuccessNotice(null);

    setTimeout(() => {
      const tx: Transaction = {
        id: 'TX-DEP-' + Math.floor(100000 + Math.random() * 900000),
        type: 'DEPOSIT',
        method: `${depositMethod} (${depositMethod === 'VA' ? selectedBank : depositMethod === 'EWALLET' ? selectedEwallet : depositMethod})`,
        amount: depositAmount,
        currency,
        timestamp: Date.now(),
        status: 'COMPLETED',
        reference: 'GW-SECURE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      };

      onDepositSuccess(depositAmount, tx);
      sound.playLevelUp();
      setIsProcessing(false);
      setSuccessNotice(`Deposit of ${currency === 'IDR' ? 'Rp ' + depositAmount.toLocaleString() : '$' + depositAmount} verified and added!`);
      setTimeout(() => setSuccessNotice(null), 3500);
    }, 1200);
  };

  const handleWithdrawConfirm = () => {
    if (withdrawAmount > currentBalance) {
      alert('Withdrawal amount exceeds your current balance!');
      return;
    }
    if (withdrawAmount <= 0) return;

    setIsProcessing(true);
    setSuccessNotice(null);

    setTimeout(() => {
      const tx: Transaction = {
        id: 'TX-WIT-' + Math.floor(100000 + Math.random() * 900000),
        type: 'WITHDRAW',
        method: `${withdrawBank} - ${withdrawAccNumber}`,
        amount: withdrawAmount,
        currency,
        timestamp: Date.now(),
        status: 'COMPLETED',
        reference: 'OUT-SETTLE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      };

      onWithdrawSuccess(withdrawAmount, tx);
      sound.playCoin();
      setIsProcessing(false);
      setSuccessNotice(`Withdrawal of ${currency === 'IDR' ? 'Rp ' + withdrawAmount.toLocaleString() : '$' + withdrawAmount} approved & sent to ${withdrawBank}!`);
      setTimeout(() => setSuccessNotice(null), 3500);
    }, 1400);
  };

  const presetAmounts =
    currency === 'IDR'
      ? [50000, 100000, 250000, 500000, 1000000, 2500000]
      : [20, 50, 100, 250, 500, 1000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Wild Bounty Secure Gateway</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  256-bit SSL
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Safe & Instant Real-Money Gaming Transactions
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Ribbon */}
        <div className="px-6 py-3 bg-stone-950/60 border-b border-stone-800/80 flex items-center justify-between">
          <span className="text-xs text-stone-400">Available Vault Balance:</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {currency === 'IDR' ? `Rp ${currentBalance.toLocaleString()}` : `$${currentBalance.toLocaleString()}`}
          </span>
        </div>

        {/* Notification banner */}
        {successNotice && (
          <div className="px-6 py-2.5 bg-emerald-950/90 border-b border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-800 bg-stone-900/90">
          <button
            onClick={() => setActiveTab('DEPOSIT')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'DEPOSIT'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit Funds
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'WITHDRAW'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw Payout
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'HISTORY'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            History ({transactions.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'DEPOSIT' && (
            <div className="space-y-5">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-2">
                  Select Deposit Method
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'QRIS', label: 'QRIS', icon: QrCode, sub: 'Instant QR' },
                    { id: 'VA', label: 'Virtual Acc', icon: Building2, sub: 'BCA / Mandiri' },
                    { id: 'EWALLET', label: 'E-Wallet', icon: Wallet, sub: 'GoPay / OVO' },
                    { id: 'CARD', label: 'Visa / MC', icon: CreditCard, sub: 'Debit / Credit' },
                    { id: 'CRYPTO', label: 'Crypto', icon: Coins, sub: 'USDT / BTC' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = depositMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setDepositMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                            : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold">{m.label}</span>
                        <span className="text-[9px] text-stone-500 line-clamp-1">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-2">
                  Deposit Amount ({currency})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 px-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                        depositAmount === amt
                          ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {currency === 'IDR' ? `${(amt / 1000).toFixed(0)}k` : `$${amt}`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  placeholder="Enter custom deposit amount..."
                />
              </div>

              {/* Method Specific details */}
              {depositMethod === 'QRIS' && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center gap-4">
                  {/* Mock high-res QRIS SVG */}
                  <div className="p-3 bg-white rounded-lg shrink-0 flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 text-black" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" fill="black" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="black" />
                      <rect x="70" y="0" width="30" height="30" fill="black" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="black" />
                      <rect x="0" y="70" width="30" height="30" fill="black" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="black" />
                      {/* Data dots */}
                      <rect x="40" y="10" width="8" height="8" fill="black" />
                      <rect x="52" y="15" width="8" height="8" fill="black" />
                      <rect x="40" y="40" width="20" height="20" fill="black" />
                      <rect x="45" y="45" width="10" height="10" fill="white" />
                      <rect x="70" y="40" width="8" height="16" fill="black" />
                      <rect x="85" y="55" width="8" height="8" fill="black" />
                      <rect x="40" y="70" width="15" height="10" fill="black" />
                      <rect x="65" y="75" width="25" height="15" fill="black" />
                    </svg>
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="text-xs font-bold text-amber-400">NMID: ID102948291048201</div>
                    <div className="text-xs text-stone-300">
                      Scan with GoPay, OVO, BCA Mobile, ShopeePay, or any QRIS mobile banking app.
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Auto-detects payment in 3-5 seconds. No transfer fee.
                    </div>
                  </div>
                </div>
              )}

              {depositMethod === 'VA' && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex gap-2">
                    {['BCA', 'Mandiri', 'BRI', 'BNI'].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                          selectedBank === bank
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-stone-900 border border-stone-800">
                    <div>
                      <div className="text-[10px] text-stone-500 uppercase">Virtual Account Number</div>
                      <div className="text-sm font-mono font-bold text-amber-300 tracking-wider">
                        8921 0092 3819 4021
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy('8921009238194021')}
                      className="p-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                      title="Copy VA"
                    >
                      {copiedText === '8921009238194021' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Deposit Button */}
              <button
                disabled={isProcessing}
                onClick={handleDepositConfirm}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Secure Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      Deposit {currency === 'IDR' ? `Rp ${depositAmount.toLocaleString()}` : `$${depositAmount}`} Now
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'WITHDRAW' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Withdrawals are processed instantly via automated interbank clearing. Minimum payout: $20 / Rp 50,000.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">Destination Bank / E-Wallet</label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                  <option value="BNI">Bank Negara Indonesia (BNI)</option>
                  <option value="GoPay">GoPay Indonesia</option>
                  <option value="DANA">DANA E-Wallet</option>
                  <option value="OVO">OVO Payment</option>
                  <option value="Crypto USDT">USDT (TRC-20)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">Account Number / Phone / Wallet</label>
                <input
                  type="text"
                  value={withdrawAccNumber}
                  onChange={(e) => setWithdrawAccNumber(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={withdrawAccName}
                  onChange={(e) => setWithdrawAccName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  Withdrawal Amount ({currency})
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  max={currentBalance}
                  onChange={(e) => setWithdrawAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                disabled={isProcessing || currentBalance < withdrawAmount || withdrawAmount <= 0}
                onClick={handleWithdrawConfirm}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>
                      Confirm Payout of {currency === 'IDR' ? `Rp ${withdrawAmount.toLocaleString()}` : `$${withdrawAmount}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No transactions yet. Deposit funds to start playing real money spins!
                </div>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          t.type === 'DEPOSIT'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {t.type === 'DEPOSIT' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-200">
                          {t.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} · {t.method}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Ref: {t.reference} · {new Date(t.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs font-mono font-bold ${
                          t.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {t.type === 'DEPOSIT' ? '+' : '-'}
                        {t.currency === 'IDR' ? `Rp ${t.amount.toLocaleString()}` : `$${t.amount.toLocaleString()}`}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-medium">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
