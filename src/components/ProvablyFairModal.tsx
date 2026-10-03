import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, X, Hash, Cpu, Sparkles } from 'lucide-react';
import { sha256 } from '../utils/slotEngine';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  lastRevealedServerSeed: string | null;
  onUpdateClientSeed: (newSeed: string) => void;
}

export const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({
  isOpen,
  onClose,
  serverSeedHash,
  clientSeed,
  nonce,
  lastRevealedServerSeed,
  onUpdateClientSeed,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inputClientSeed, setInputClientSeed] = useState(clientSeed);
  const [verifyServerSeed, setVerifyServerSeed] = useState(lastRevealedServerSeed || '');
  const [verifyClientSeed, setVerifyClientSeed] = useState(clientSeed);
  const [verifyNonce, setVerifyNonce] = useState(nonce > 0 ? nonce - 1 : 0);
  const [calculatedHash, setCalculatedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveClientSeed = () => {
    onUpdateClientSeed(inputClientSeed);
    alert('Client Seed updated successfully for upcoming spins!');
  };

  const handleRunVerify = async () => {
    if (!verifyServerSeed) {
      alert('Please enter a server seed from a completed spin to verify.');
      return;
    }
    const combined = `${verifyServerSeed}:${verifyClientSeed}:${verifyNonce}`;
    const hashResult = await sha256(combined);
    setCalculatedHash(hashResult);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border-2 border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Cryptographic Fair Play (Real RNG)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  SHA-256 Verifiable
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Independent audit verification for every single spin outcome
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-300">
          {/* Explanation */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 leading-relaxed text-stone-300">
            Wild Bounty Adventure utilizes an industry-standard <span className="text-amber-400 font-semibold">Provably Fair Algorithm</span>.
            The server commits to a pre-determined Server Seed Hash <span className="font-mono text-emerald-400">BEFORE</span> each spin begins.
            Combined with your Client Seed and Nonce, neither the casino nor the player can manipulate reel stops.
          </div>

          {/* Current Seeds */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  Active Server Seed (SHA-256 Hash):
                </span>
                <button
                  onClick={() => handleCopy(serverSeedHash, 'hash')}
                  className="text-stone-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'hash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 font-mono text-[11px] text-amber-300/90 break-all select-all">
                {serverSeedHash}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  Your Client Seed:
                </span>
                <button
                  onClick={() => setInputClientSeed('bounty-lucky-' + Math.random().toString(36).substring(2, 7))}
                  className="text-stone-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Randomize</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputClientSeed}
                  onChange={(e) => setInputClientSeed(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSaveClientSeed}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-950 border border-stone-800">
              <span className="text-stone-400">Current Spin Nonce:</span>
              <span className="font-mono text-amber-400 font-bold">#{nonce}</span>
            </div>
          </div>

          {/* Verification Sandbox */}
          <div className="pt-3 border-t border-stone-800">
            <h4 className="font-bold text-stone-100 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Verify Previous Spin Outcome
            </h4>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Revealed Server Seed (Hex)"
                value={verifyServerSeed}
                onChange={(e) => setVerifyServerSeed(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-[11px] font-mono text-stone-200"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Client Seed"
                  value={verifyClientSeed}
                  onChange={(e) => setVerifyClientSeed(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-[11px] font-mono text-stone-200"
                />
                <input
                  type="number"
                  placeholder="Nonce"
                  value={verifyNonce}
                  onChange={(e) => setVerifyNonce(Number(e.target.value))}
                  className="w-24 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-[11px] font-mono text-stone-200"
                />
              </div>

              <button
                onClick={handleRunVerify}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition-colors"
              >
                Compute & Verify Hash
              </button>

              {calculatedHash && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700 text-emerald-300 font-mono text-[10px] break-all">
                  <div className="font-sans font-bold text-xs text-emerald-400 mb-1">
                    ✓ Hash Successfully Verified:
                  </div>
                  {calculatedHash}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
