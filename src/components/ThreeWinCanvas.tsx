import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type WinTier = 'BIG_WIN' | 'SUPER_BIG_WIN' | 'MEGA_WIN' | 'EPIC_WIN' | 'LEVEL_UP';

interface ThreeWinCanvasProps {
  active: boolean;
  tier: WinTier;
  amount?: number;
  currency?: 'USD' | 'IDR';
  onComplete?: () => void;
}

export const ThreeWinCanvas: React.FC<ThreeWinCanvasProps> = ({
  active,
  tier,
  amount = 0,
  currency = 'IDR',
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [displayedAmount, setDisplayedAmount] = useState<number>(0);

  // Count-up animation
  useEffect(() => {
    if (!active) {
      setDisplayedAmount(0);
      return;
    }

    let start = 0;
    const end = amount;
    const duration = 1200; // 1.2s count up
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedAmount(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setDisplayedAmount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [active, amount]);

  // Three.js 3D gold coins effect
  useEffect(() => {
    if (!active) {
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 360;
    const height = containerRef.current.clientHeight || 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff4d6, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdf70, 2.0);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const coinGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.18, 16);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      metalness: 0.8,
      roughness: 0.25,
    });

    // Max 12 (Big) / 18 (Super/Mega) coins
    const coinCount = tier === 'EPIC_WIN' || tier === 'MEGA_WIN' ? 18 : 10;
    const coins: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      fallSpeed: number;
    }[] = [];

    for (let i = 0; i < coinCount; i++) {
      const mesh = new THREE.Mesh(coinGeometry, coinMaterial);
      mesh.position.x = (Math.random() - 0.5) * 12;
      mesh.position.y = 4 + Math.random() * 8;
      mesh.position.z = (Math.random() - 0.5) * 6;

      const scale = 0.5 + Math.random() * 0.4;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
      coins.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.1,
        rotSpeedY: (Math.random() - 0.5) * 0.1,
        fallSpeed: 0.1 + Math.random() * 0.12,
      });
    }

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      coins.forEach((item) => {
        item.mesh.position.y -= item.fallSpeed;
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;

        if (item.mesh.position.y < -5) {
          item.mesh.position.y = 5 + Math.random() * 3;
          item.mesh.position.x = (Math.random() - 0.5) * 12;
        }
      });
      renderer.render(scene, camera);
    };

    animate();

    // Auto-dismiss in 2.5 seconds max
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [active, tier, onComplete]);

  if (!active) return null;

  const getTierTitle = () => {
    switch (tier) {
      case 'EPIC_WIN':
        return '👑 EPIC WIN 👑';
      case 'MEGA_WIN':
        return '★★★ MEGA WIN ★★★';
      case 'SUPER_BIG_WIN':
        return '★★ SUPER BIG WIN ★★';
      case 'BIG_WIN':
        return '★ BIG WIN ★';
      case 'LEVEL_UP':
        return '⭐ STAGE UNLOCKED ⭐';
      default:
        return '★ BIG WIN ★';
    }
  };

  const formattedAmount =
    currency === 'IDR'
      ? `Rp ${displayedAmount.toLocaleString('id-ID')}`
      : `$${displayedAmount.toLocaleString('en-US')}`;

  return (
    /* Floating top banner, max 20% screen height, grid & buttons stay visible, tap to skip */
    <div
      onClick={onComplete}
      className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[380px] pointer-events-auto cursor-pointer animate-in slide-in-from-top-4 duration-200 select-none"
      title="Ketuk untuk lewati"
    >
      <div className="relative rounded-2xl bg-gradient-to-b from-[#381a0b]/95 via-[#231006]/95 to-[#120703]/95 border-2 border-[#d4963e] shadow-[0_8px_25px_rgba(0,0,0,0.85),inset_0_1px_6px_rgba(245,197,66,0.4)] px-4 py-2.5 overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle Canvas Container */}
        <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-40" />

        {/* Banner Content */}
        <div className="relative z-10 text-center">
          <div className="text-[11px] font-western font-black text-amber-300 uppercase tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {getTierTitle()}
          </div>

          <div className="text-xl sm:text-2xl font-western font-black text-gold-gradient tracking-wider tabular-nums my-0.5 drop-shadow-[0_2px_8px_rgba(245,197,66,0.8)]">
            +{formattedAmount}
          </div>

          <div className="text-[9px] text-stone-400 font-medium">
            Ketuk di mana saja untuk melewati
          </div>
        </div>
      </div>
    </div>
  );
};
