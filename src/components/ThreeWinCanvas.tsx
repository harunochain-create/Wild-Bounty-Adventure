import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

interface ThreeWinCanvasProps {
  active: boolean;
  tier: 'WIN' | 'BIG_WIN' | 'MEGA_WIN' | 'LEVEL_UP';
  amount?: number;
  onComplete?: () => void;
}

export const ThreeWinCanvas: React.FC<ThreeWinCanvasProps> = ({
  active,
  tier,
  amount,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

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

    // Trigger confetti bursts
    if (tier === 'MEGA_WIN' || tier === 'LEVEL_UP') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFDF00', '#FFA500', '#FF4500', '#DAA520', '#FFFFFF'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ['#F59E0B', '#EAB308', '#EF4444'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ['#F59E0B', '#EAB308', '#EF4444'],
        });
      }, 300);
    } else {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFDF00', '#FFA500', '#FFFFFF'],
      });
    }

    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // Three.js 3D Coin Shower
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff4d6, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffdf70, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb87b12, 1.5);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    // 3D Coin Meshes
    const coinGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      metalness: 0.88,
      roughness: 0.22,
    });

    const coinCount = tier === 'MEGA_WIN' ? 45 : tier === 'LEVEL_UP' ? 35 : 20;
    const coins: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      fallSpeed: number;
    }[] = [];

    for (let i = 0; i < coinCount; i++) {
      const mesh = new THREE.Mesh(coinGeometry, coinMaterial);
      mesh.position.x = (Math.random() - 0.5) * 30;
      mesh.position.y = 15 + Math.random() * 20;
      mesh.position.z = (Math.random() - 0.5) * 15;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = 0.6 + Math.random() * 0.7;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
      coins.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.15,
        rotSpeedY: (Math.random() - 0.5) * 0.15,
        fallSpeed: 0.18 + Math.random() * 0.22,
      });
    }

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      coins.forEach((item) => {
        item.mesh.position.y -= item.fallSpeed;
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;

        // Reset coin to top if fallen past bottom
        if (item.mesh.position.y < -16) {
          item.mesh.position.y = 18 + Math.random() * 5;
          item.mesh.position.x = (Math.random() - 0.5) * 30;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);

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

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center">
      {/* 3D Coin WebGL canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Hero win overlay card */}
      <div className="relative z-10 text-center px-8 py-6 rounded-2xl bg-stone-950/85 border-2 border-amber-500/80 backdrop-blur-md shadow-2xl shadow-amber-500/30 max-w-sm sm:max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          {tier === 'LEVEL_UP' ? '⭐ Outlaw Elevation ⭐' : '★ Bounty Reward ★'}
        </div>
        <h2 className="text-3xl sm:text-4xl font-western text-gold-gradient tracking-wide mb-2">
          {tier === 'MEGA_WIN'
            ? 'MEGA BOUNTY WIN!'
            : tier === 'BIG_WIN'
            ? 'BIG BOUNTY WIN!'
            : tier === 'LEVEL_UP'
            ? 'STAGE UNLOCKED!'
            : 'NICE SHOT!'}
        </h2>
        {amount !== undefined && (
          <div className="text-3xl sm:text-5xl font-extrabold text-amber-300 font-mono tabular-nums tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(245,197,66,0.6)]">
            +${amount.toLocaleString()}
          </div>
        )}
        <div className="text-xs text-stone-300">
          {tier === 'LEVEL_UP'
            ? 'Scatter Bounty target met! Your multiplier & perks escalated.'
            : 'Gold credited instantly to your Wild Bounty vault.'}
        </div>
      </div>
    </div>
  );
};
