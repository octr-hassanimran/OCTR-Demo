"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { PlantNodeId } from "@/data/g-valley-optimisation-strategies";

type Season = "summer" | "winter";

const accentCool = "#6cb2ff";
const accentWarm = "#e57373";
const accentPlant = "#65d4a1";
const accentDhw = "#f6c344";

function PlantBlock({
  position,
  scale,
  color,
  emissive,
  pulse,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive?: string;
  pulse?: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (!pulse || !ref.current) return;
    ref.current.rotation.y += d * 0.15;
  });
  return (
    <group ref={ref} position={position}>
      <RoundedBox args={scale} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={color}
          metalness={0.35}
          roughness={0.42}
          emissive={emissive ?? "#000000"}
          emissiveIntensity={emissive ? 0.22 : 0}
        />
        <Edges color={emissive ?? accentPlant} threshold={18} />
      </RoundedBox>
    </group>
  );
}

function Scene({ season, focus }: { season: Season; focus: PlantNodeId | null }) {
  const warm = season === "winter";
  const hi = (id: PlantNodeId) => focus === id;

  const chpEmissive = useMemo(
    () => (warm ? accentWarm : accentCool),
    [warm]
  );

  return (
    <>
      <color attach="background" args={["#070a0c"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 14, 10]} intensity={0.85} color="#cfe8dc" />
      <directionalLight position={[-6, 4, -4]} intensity={0.25} color={accentCool} />

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
        <group position={[0, -0.6, 0]} scale={0.92}>
          {/* Cooling towers */}
          <PlantBlock
            position={[-2.8, 1.1, -0.4]}
            scale={[0.85, 1.5, 0.75]}
            color="#1a2830"
            emissive={hi("ct1") || hi("ct2") ? accentCool : undefined}
            pulse={hi("ct1") || hi("ct2")}
          />
          <PlantBlock
            position={[-1.5, 1.05, 0.35]}
            scale={[0.85, 1.45, 0.75]}
            color="#1a2830"
            emissive={hi("ct1") || hi("ct2") ? accentCool : undefined}
          />

          {/* CHP */}
          <PlantBlock
            position={[-2.2, -0.15, 0]}
            scale={[1.1, 0.95, 0.85]}
            color="#1b3328"
            emissive={hi("chp1") ? chpEmissive : undefined}
            pulse={hi("chp1")}
          />
          <PlantBlock
            position={[-0.55, -0.2, 0.15]}
            scale={[1.1, 0.95, 0.85]}
            color="#1b3328"
            emissive={hi("chp2") ? chpEmissive : undefined}
            pulse={hi("chp2")}
          />

          {/* Header slab */}
          <PlantBlock
            position={[1.35, 0.05, 0]}
            scale={[1.6, 0.55, 1]}
            color="#151c24"
            emissive={hi("headers") ? accentCool : undefined}
            pulse={hi("headers")}
          />

          {/* Geo */}
          <PlantBlock
            position={[0.65, -0.85, 0.4]}
            scale={[0.65, 0.9, 0.65]}
            color="#121e2c"
            emissive={hi("geo") ? accentCool : undefined}
            pulse={hi("geo")}
          />

          {/* Secondary pump */}
          <PlantBlock
            position={[2.35, -0.75, -0.25]}
            scale={[0.45, 0.45, 0.45]}
            color="#142018"
            emissive={hi("secPump") ? accentPlant : undefined}
          />

          {/* DHW */}
          <PlantBlock
            position={[-2.9, -1.15, 0.9]}
            scale={[0.55, 0.4, 0.55]}
            color="#2a2212"
            emissive={hi("dhw") ? accentDhw : undefined}
          />

          {/* AHU strip */}
          <PlantBlock
            position={[1.2, 1.25, -0.5]}
            scale={[1.8, 0.35, 0.55]}
            color="#141a16"
            emissive={hi("ahuFleet") ? accentPlant : undefined}
          />
        </group>
      </Float>

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.35}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 3.2}
      />
    </>
  );
}

type Props = {
  season: Season;
  focus: PlantNodeId | null;
};

export function GValleyPlantHero3d({ season, focus }: Props) {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-t-lg border-b border-white/[0.08] bg-[#05080a] md:h-[260px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(101,212,161,0.12),transparent_55%)]" />
      <Canvas
        camera={{ position: [5.2, 3.8, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: false, antialias: true }}
        className="!h-full !w-full"
      >
        <Scene season={season} focus={focus} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
        Isometric overview · not to scale
      </div>
    </div>
  );
}
