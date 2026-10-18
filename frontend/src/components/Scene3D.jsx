import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const MACRO_COLORS = {
  protein: '#FF4D6D',  // Coral Neon
  carbs: '#00FF87',    // Electric Lime
  fats: '#FF6B00',     // Tangerine
  sugar: '#9D4EDD',    // Cyber Violet
};

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Orbiting nutrient sphere with organic pulse */
function NutrientOrb({ color, size, radius, speed, phase, lift, busy, label }) {
  const holder = useRef();
  const mesh = useRef();
  const angle = useRef(phase);

  useFrame((_, dt) => {
    const mult = reduced ? 0.1 : busy ? 3.5 : 0.8;
    angle.current += dt * speed * mult;
    const a = angle.current;
    
    if (holder.current) {
      holder.current.position.set(
        Math.cos(a) * radius,
        Math.sin(a * 1.5) * 0.4 + lift,
        Math.sin(a) * radius
      );
    }

    if (mesh.current) {
      const currentScale = mesh.current.scale.x;
      const targetScale = busy ? size * 1.25 : size;
      const s = currentScale + (targetScale - currentScale) * (1 - Math.exp(-dt * 4));
      mesh.current.scale.setScalar(s);
      mesh.current.rotation.y += dt * 0.5;
    }
  });

  return (
    <group ref={holder}>
      <mesh ref={mesh} scale={0.01}>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.25}
          distort={0.3}
          speed={reduced ? 0 : 2}
        />
      </mesh>
    </group>
  );
}

/** Stylized 3D Food Element: Avocado */
function StylizedAvocado({ position = [0, 0, 0], scale = 0.55 }) {
  const group = useRef();
  useFrame((_, dt) => {
    if (group.current && !reduced) {
      group.current.rotation.y += dt * 0.3;
      group.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Outer Skin */}
      <mesh scale={[1, 1.25, 0.75]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#1A3B18" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Creamy Flesh */}
      <mesh position={[0, 0, 0.15]} scale={[0.88, 1.15, 0.65]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#C8E662" roughness={0.4} />
      </mesh>
      {/* Pit / Seed */}
      <mesh position={[0, -0.15, 0.45]} scale={[0.42, 0.48, 0.42]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#5C3413" roughness={0.5} metalness={0.15} />
      </mesh>
    </group>
  );
}

/** Stylized 3D Food Element: Citrus Slice */
function StylizedCitrus({ position = [0, 0, 0], scale = 0.5 }) {
  const group = useRef();
  useFrame((_, dt) => {
    if (group.current && !reduced) {
      group.current.rotation.x += dt * 0.4;
      group.current.rotation.y += dt * 0.2;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Outer Rind */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.18, 32]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* White pith */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.19, 32]} />
        <meshStandardMaterial color="#FFF5EB" roughness={0.4} />
      </mesh>
      {/* Juicy Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial
          color="#FFA726"
          emissive="#FF8F00"
          emissiveIntensity={0.2}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Futuristic glowing meal stage with concentric rings */
function CyberPlate() {
  return (
    <group rotation={[0.4, 0, 0]} position={[0, -1.05, 0]}>
      {/* Main Base Pedestal */}
      <mesh>
        <cylinderGeometry args={[2.0, 1.6, 0.15, 64]} />
        <meshStandardMaterial
          color="#12111E"
          roughness={0.3}
          metalness={0.8}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Cyber Neon Rim (Electric Lime) */}
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.025, 16, 96]} />
        <meshBasicMaterial color="#00FF87" />
      </mesh>

      {/* Inner Violet Halo Ring */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.015, 16, 80]} />
        <meshBasicMaterial color="#8A2BE2" />
      </mesh>
    </group>
  );
}

/** Main 3D Interactive Stage */
function MainStage({ shares, busy }) {
  const group = useRef();

  useFrame((state, dt) => {
    if (!group.current) return;
    const { viewport, pointer } = state;
    const isWide = viewport.width > 8;
    const ease = 1 - Math.exp(-dt * 3.5);

    // Subtle parallax responsive to pointer
    const targetX = isWide ? viewport.width * 0.18 : 0;
    group.current.position.x += (targetX - group.current.position.x) * ease;
    
    // Scale on mobile
    const targetScale = isWide ? 1 : Math.min(0.9, viewport.width / 7.5);
    group.current.scale.setScalar(
      group.current.scale.x + (targetScale - group.current.scale.x) * ease
    );

    // Idle rotation
    group.current.rotation.y += dt * (reduced ? 0.02 : 0.14);
    group.current.rotation.x += ((-pointer.y * 0.18) - group.current.rotation.x) * ease;
  });

  const getOrbSize = (share) => 0.35 + (share || 0.3) * 1.6;

  return (
    <group ref={group}>
      {/* Glowing Cyber Plate */}
      <CyberPlate />

      {/* Floating 3D Food Elements */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <StylizedAvocado position={[-1.3, 0.4, 0.5]} scale={0.48} />
      </Float>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.8}>
        <StylizedCitrus position={[1.4, 0.6, -0.2]} scale={0.42} />
      </Float>

      {/* Concentric Orbit Paths */}
      <group rotation={[0.4, 0, 0.12]}>
        {[2.3, 2.8, 3.4].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.007, 8, 120]} />
            <meshBasicMaterial
              color={i === 0 ? '#FF4D6D' : i === 1 ? '#00FF87' : '#FF6B00'}
              transparent
              opacity={0.18}
            />
          </mesh>
        ))}
      </group>

      {/* Orbiting Macro Orbs */}
      <NutrientOrb
        color={MACRO_COLORS.protein}
        size={getOrbSize(shares.protein)}
        radius={2.3}
        speed={0.55}
        phase={0}
        lift={0.35}
        busy={busy}
        label="Protein"
      />
      <NutrientOrb
        color={MACRO_COLORS.carbs}
        size={getOrbSize(shares.carbs)}
        radius={2.8}
        speed={0.4}
        phase={2.2}
        lift={0.15}
        busy={busy}
        label="Carbs"
      />
      <NutrientOrb
        color={MACRO_COLORS.fats}
        size={getOrbSize(shares.fats)}
        radius={3.4}
        speed={0.3}
        phase={4.4}
        lift={0.5}
        busy={busy}
        label="Fats"
      />
    </group>
  );
}

export default function Scene3D({ macros, busy }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const shares = useMemo(() => {
    if (!macros) {
      return { protein: 0.3, carbs: 0.45, fats: 0.25 };
    }
    const p = (macros.protein_g || 0) * 4;
    const c = (macros.carbs_g || 0) * 4;
    const f = (macros.fats_g || 0) * 9;
    const total = p + c + f || 1;
    return {
      protein: p / total,
      carbs: c / total,
      fats: f / total,
    };
  }, [macros]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-40 sm:opacity-85 transition-opacity duration-1000"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.9, isMobile ? 9.2 : 8.5], fov: isMobile ? 48 : 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        {/* Cyber Neon Lights */}
        <pointLight position={[5, 6, 5]} intensity={70} color="#00FF87" />
        <pointLight position={[-6, -2, 4]} intensity={60} color="#8A2BE2" />
        <pointLight position={[0, 4, 3]} intensity={45} color="#FF6B00" />

        <MainStage shares={shares} busy={busy} />

        {/* Ambient Floating Cyber Sparkles */}
        <Sparkles
          count={reduced ? 0 : isMobile ? 24 : 65}
          scale={[15, 9, 9]}
          size={2.5}
          speed={0.3}
          color="#00FF87"
          opacity={0.65}
        />
        <Sparkles
          count={reduced ? 0 : isMobile ? 12 : 35}
          scale={[12, 7, 7]}
          size={3.0}
          speed={0.25}
          color="#9D4EDD"
          opacity={0.5}
        />
      </Canvas>
    </div>
  );
}
