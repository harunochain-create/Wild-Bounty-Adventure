import React, { useState } from 'react';
import { Smartphone, Code, Layers, Copy, Check, X } from 'lucide-react';

interface NativeEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NativeEngineModal: React.FC<NativeEngineModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'KOTLIN' | 'CPP' | 'UNITY'>('KOTLIN');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const kotlinCode = `// WildBountySlot.kt - Android SDK + Jetpack Compose 3-4-5-5-4-3 Shield Grid
package com.wildbounty.slot

import androidx.compose.animation.core.*
import androidx.compose.runtime.*
import java.security.SecureRandom

class ShieldPayAnywhereEngine {
    // 6 Columns: 3, 4, 5, 5, 4, 3 (24 Tiles Total)
    companion object {
        val REEL_ROWS = intArrayOf(3, 4, 5, 5, 4, 3)
    }

    // Evaluates 6+ scatter-pays across all 24 tiles
    fun evaluatePayAnywhere(grid: List<List<String>>, totalBet: Double): List<WinResult> {
        val counts = mutableMapOf<String, Int>()
        var wildCount = 0

        for (col in 0 until 6) {
            val rowCount = REEL_ROWS[col]
            for (row in 0 until rowCount) {
                val sym = grid[col][row]
                if (sym == "WILD") wildCount++
                else if (sym != "SCATTER") {
                    counts[sym] = (counts[sym] ?: 0) + 1
                }
            }
        }

        // Add WILDs to regular symbol with highest natural count
        val topSymbol = counts.maxByOrNull { it.value }?.key
        if (topSymbol != null) {
            counts[topSymbol] = (counts[topSymbol] ?: 0) + wildCount
        }

        val wins = mutableListOf<WinResult>()
        counts.forEach { (sym, count) ->
            if (count >= 6) {
                // Payout tiers: 6-7, 8-9, 10+
                wins.add(WinResult(sym, count, computePayout(sym, count, totalBet)))
            }
        }
        return wins
    }
}`;

  const cppCode = `// WildBountyRenderer.cpp - C++20 with OpenGL ES 3.0 / Vulkan (3-4-5-5-4-3 Shield Grid)
#include <GLES3/gl3.h>
#include <SDL2/SDL.h>
#include <vector>

class ShieldGridRenderer {
private:
    const int REEL_ROWS[6] = {3, 4, 5, 5, 4, 3}; // 24 tiles total
    GLuint vao, vbo;

public:
    void initShieldGeometry() {
        // Construct 24 square tiles arranged with vertical centering:
        // Col 0 & 5: 3 tiles (offset +1.0)
        // Col 1 & 4: 4 tiles (offset +0.5)
        // Col 2 & 3: 5 tiles (offset 0.0)
    }

    void startSequentialDrop(bool isTurbo) {
        // Normal mode: 0.1s delay per column (left to right)
        // Turbo mode: all columns drop simultaneously
        for (int col = 0; col < 6; col++) {
            float delay = isTurbo ? 0.0f : col * 0.1f;
            triggerColumnDrop(col, delay);
        }
    }
};`;

  const unityCode = `// WildBountyMachine.cs - Unity C# Engine Controller (Shield 3-4-5-5-4-3 Grid)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WildBountyMachine : MonoBehaviour {
    public static readonly int[] REEL_ROWS = { 3, 4, 5, 5, 4, 3 };
    public List<Transform>[] columns = new List<Transform>[6];
    
    // Left-to-right sequential drop in normal mode, simultaneous in Turbo
    public IEnumerator ExecuteDrop(bool isTurbo) {
        float dropDuration = isTurbo ? 0.2f : 0.38f;
        
        for (int c = 0; c < 6; c++) {
            StartCoroutine(DropSingleColumn(c, dropDuration));
            if (!isTurbo) {
                yield return new WaitForSeconds(0.1f); // 0.1s delay per column
            }
        }
        
        float totalWait = isTurbo ? dropDuration : (5 * 0.1f + dropDuration);
        yield return new WaitForSeconds(totalWait);
    }
}`;

  const currentCode = platform === 'KOTLIN' ? kotlinCode : platform === 'CPP' ? cppCode : unityCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Code className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Native Engine & Cross-Platform Specs</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  SHIELD 3-4-5-5-4-3
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Android SDK (Kotlin/Compose), C++ (OpenGL ES/SDL2), Unity (C#)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform switcher */}
        <div className="flex border-b border-stone-800 bg-stone-900/60">
          <button
            onClick={() => setPlatform('KOTLIN')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              platform === 'KOTLIN'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Kotlin / Compose)</span>
          </button>
          <button
            onClick={() => setPlatform('CPP')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              platform === 'CPP'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>C++ (OpenGL ES 3.0)</span>
          </button>
          <button
            onClick={() => setPlatform('UNITY')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              platform === 'UNITY'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Unity (C# Game Engine)</span>
          </button>
        </div>

        {/* Code View */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-950 font-mono text-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-stone-400 text-[11px]">
              Production Native Spec · 3-4-5-5-4-3 Shield Grid · 6+ Pay Anywhere
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors text-xs font-sans cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-purple-200 overflow-x-auto leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
