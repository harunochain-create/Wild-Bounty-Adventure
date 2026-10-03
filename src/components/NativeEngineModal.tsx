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

  const kotlinCode = `// WildBountySlot.kt - Android SDK + Jetpack Compose / Canvas Engine
package com.wildbounty.slot

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import java.security.SecureRandom
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class ProvablyFairRNG {
    private val secureRandom = SecureRandom()

    fun generateServerSeed(): ByteArray {
        val seed = ByteArray(32)
        secureRandom.nextBytes(seed)
        return seed
    }

    fun computeReelStop(serverSeed: ByteArray, clientSeed: String, nonce: Int): Float {
        val hmac = Mac.getInstance("HmacSHA256")
        val keySpec = SecretKeySpec(serverSeed, "HmacSHA256")
        hmac.init(keySpec)
        val data = "$clientSeed:$nonce".toByteArray()
        val hash = hmac.doFinal(data)
        // Convert first 4 bytes to float 0.0 .. 1.0
        val value = ((hash[0].toInt() and 0xFF) shl 24) or
                    ((hash[1].toInt() and 0xFF) shl 16) or
                    ((hash[2].toInt() and 0xFF) shl 8) or
                    (hash[3].toInt() and 0xFF)
        return (value.toLong() and 0xFFFFFFFFL) / 4294967295.0f
    }
}

// Level Progression Rule:
// Level 1: 1 Scatter -> Level 2
// Level 2: 2 Scatters -> Level 3
// Level 3: 3 Scatters -> Level 4
class BountyProgression(var currentLevel: Int = 1) {
    fun evaluateLevelUp(scattersHit: Int): Boolean {
        val needed = currentLevel // 1 for lvl 1, 2 for lvl 2, etc.
        if (scattersHit >= needed && currentLevel < 5) {
            currentLevel++
            return true
        }
        return false
    }
}`;

  const cppCode = `// WildBountyRenderer.cpp - C++20 with OpenGL ES 3.0 / Vulkan & SDL2
#include <GLES3/gl3.h>
#include <SDL2/SDL.h>
#include <vector>
#include <string>
#include <openssl/sha.h>
#include <openssl/hmac.h>

class SlotReelCylinder {
private:
    GLuint vao, vbo;
    float currentAngle = 0.0f;
    float angularVelocity = 0.0f;
    bool isSpinning = false;

public:
    void initCylinderMesh() {
        // Construct 3D cylinder vertices for curved slot reel face
        // 5 reels with 3 visible symbols per reel
    }

    void startSpin() {
        angularVelocity = 45.0f; // rad/s
        isSpinning = true;
    }

    void update(float deltaTime, float targetStopAngle) {
        if (isSpinning) {
            currentAngle += angularVelocity * deltaTime;
            if (angularVelocity > 2.0f) {
                angularVelocity -= 12.0f * deltaTime; // Brake deceleration
            } else {
                currentAngle = targetStopAngle;
                isSpinning = false;
            }
        }
    }

    void render(GLuint shaderProgram) {
        // Render 3D reel cylinder with metallic Wild Bounty textures
        glBindVertexArray(vao);
        glDrawArrays(GL_TRIANGLES, 0, 36);
    }
};`;

  const unityCode = `// WildBountyMachine.cs - Unity C# Engine Controller
using System;
using System.Collections;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

public class WildBountyMachine : MonoBehaviour {
    [Header("Reel Cylinders")]
    public Transform[] reelCylinders; // 5 3D Cylinder GameObjects
    public float spinSpeed = 1200f;
    
    [Header("Bounty Progression")]
    public int currentLevel = 1;
    public int currentScattersCollected = 0;
    
    public void Spin(string serverSeedHex, string clientSeed, int nonce) {
        StartCoroutine(Execute3DSpin(serverSeedHex, clientSeed, nonce));
    }

    private IEnumerator Execute3DSpin(string serverSeed, string clientSeed, int nonce) {
        // 1. Play mechanical audio
        AudioManager.Instance.PlaySpinStart();
        
        // 2. Rotate 3D cylinders with bounce curve
        float timer = 0f;
        while (timer < 2.5f) {
            timer += Time.deltaTime;
            for (int i = 0; i < reelCylinders.Length; i++) {
                reelCylinders[i].Rotate(Vector3.right * spinSpeed * Time.deltaTime);
            }
            yield return null;
        }
        
        // 3. Check Scatter Rule:
        // Level 1 needs 1 scatter, Level 2 needs 2 scatters, etc.
        // Trigger safe bonus or level up celebration!
    }
}`;

  const currentCode = platform === 'KOTLIN' ? kotlinCode : platform === 'CPP' ? cppCode : unityCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Native Game Architecture & Export SDK</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                  CROSS-PLATFORM
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Kotlin (Android), C++/OpenGL ES, & Unity (C#) native specs
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

        {/* Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950">
          <button
            onClick={() => setPlatform('KOTLIN')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              platform === 'KOTLIN'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android Kotlin
          </button>
          <button
            onClick={() => setPlatform('CPP')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              platform === 'CPP'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            C++ / OpenGL ES
          </button>
          <button
            onClick={() => setPlatform('UNITY')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              platform === 'UNITY'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code className="w-4 h-4" />
            Unity C#
          </button>
        </div>

        {/* Code display */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">
              {platform === 'KOTLIN'
                ? 'WildBountySlot.kt (Android Jetpack + SurfaceView)'
                : platform === 'CPP'
                ? 'WildBountyRenderer.cpp (SDL2 + GLES3)'
                : 'WildBountyMachine.cs (Unity 3D Engine)'}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Source'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto leading-relaxed">
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
