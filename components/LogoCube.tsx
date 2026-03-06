"use client";

import { Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type CubeFace = "front" | "back" | "left" | "right" | "top" | "bottom";

const FACE_VECTORS: Record<CubeFace, [number, number, number]> = {
  front: [0, 0, 1],
  back: [0, 0, -1],
  left: [-1, 0, 0],
  right: [1, 0, 0],
  top: [0, 1, 0],
  bottom: [0, -1, 0]
};

const FACE_UV: Record<CubeFace, ["x" | "y" | "z", "x" | "y" | "z", number, number]> = {
  front: ["x", "y", 1, 1],
  back: ["x", "y", -1, 1],
  left: ["z", "y", 1, 1],
  right: ["z", "y", -1, 1],
  top: ["x", "z", 1, -1],
  bottom: ["x", "z", 1, 1]
};

const FACES: CubeFace[] = ["front", "back", "left", "right", "top", "bottom"];
const EDGE = 0.94;
const GAP = 1.04;
const STICKER_SIZE = 0.94;

function faceRotation(face: CubeFace): [number, number, number] {
  if (face === "front") return [0, 0, 0];
  if (face === "back") return [0, Math.PI, 0];
  if (face === "left") return [0, -Math.PI / 2, 0];
  if (face === "right") return [0, Math.PI / 2, 0];
  if (face === "top") return [-Math.PI / 2, 0, 0];
  return [Math.PI / 2, 0, 0];
}

function letterAt(row: number, col: number) {
  if (row !== 1) return null;
  if (col === 0) return "T";
  if (col === 1) return "L";
  if (col === 2) return "L";
  return null;
}

function CubeLogoMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const cubies = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          points.push([x, y, z]);
        }
      }
    }
    return points;
  }, []);

  const stickers = useMemo(() => {
    const data: Array<{
      face: CubeFace;
      row: number;
      col: number;
      position: [number, number, number];
      rotation: [number, number, number];
      letter: string | null;
      isOuterFace: boolean;
    }> = [];

    for (const [x, y, z] of cubies) {
      const outerFaces: CubeFace[] = [];
      if (x === 1) outerFaces.push("right");
      if (x === -1) outerFaces.push("left");
      if (y === 1) outerFaces.push("top");
      if (y === -1) outerFaces.push("bottom");
      if (z === 1) outerFaces.push("front");
      if (z === -1) outerFaces.push("back");

      for (const face of FACES) {
        const [nx, ny, nz] = FACE_VECTORS[face];
        const [uAxis, vAxis, uSign, vSign] = FACE_UV[face];
        const uRaw = uAxis === "x" ? x : uAxis === "y" ? y : z;
        const vRaw = vAxis === "x" ? x : vAxis === "y" ? y : z;
        const col = Math.round((uRaw * uSign + 1) as number);
        const row = Math.round((1 - vRaw * vSign) as number);

        data.push({
          face,
          row,
          col,
          position: [
            x * GAP + nx * (EDGE / 2 + 0.01),
            y * GAP + ny * (EDGE / 2 + 0.01),
            z * GAP + nz * (EDGE / 2 + 0.01)
          ],
          rotation: faceRotation(face),
          letter: outerFaces.includes(face) ? letterAt(row, col) : null,
          isOuterFace: outerFaces.includes(face)
        });
      }
    }

    return data;
  }, [cubies]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.65;
    groupRef.current.rotation.x += delta * 0.08;
  });

  return (
    <group ref={groupRef} scale={0.68} position={[0, 0.02, 0]}>
      {cubies.map(([x, y, z]) => (
        <mesh key={`cubie-${x}-${y}-${z}`} position={[x * GAP, y * GAP, z * GAP]} castShadow receiveShadow raycast={() => null}>
          <boxGeometry args={[EDGE, EDGE, EDGE]} />
          <meshStandardMaterial color="#b7c9e6" metalness={0.18} roughness={0.2} emissive="#93c5fd" emissiveIntensity={0.08} />
        </mesh>
      ))}

      {stickers.map((sticker) => (
        <group key={`${sticker.face}-${sticker.row}-${sticker.col}`} position={sticker.position} rotation={sticker.rotation}>
          <mesh>
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
            <meshStandardMaterial
              color={sticker.isOuterFace ? (sticker.letter ? "#22d3ee" : "#0f172a") : "#0f172a"}
              metalness={0.2}
              roughness={0.35}
              emissive={
                sticker.isOuterFace
                  ? new THREE.Color(sticker.letter ? "#22d3ee" : "#0f172a").multiplyScalar(sticker.letter ? 0.26 : 0.16)
                  : new THREE.Color("#0f172a").multiplyScalar(0.16)
              }
              emissiveIntensity={1.08}
            />
          </mesh>

          {sticker.letter ? (
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.42}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#082f49"
            >
              {sticker.letter}
            </Text>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export default function LogoCube() {
  return (
    <div className="relative h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
      <span className="pointer-events-none absolute inset-[12%] rounded-full bg-cyan-300/12 blur-xl" />
      <span className="pointer-events-none absolute inset-[20%] rounded-full bg-sky-400/10 blur-2xl" />
      <Canvas camera={{ fov: 36, position: [5.45, 5.15, 5.75] }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.92} />
        <directionalLight position={[4, 7, 6]} intensity={1.65} color="#ecfeff" />
        <directionalLight position={[-5, -3, -4]} intensity={0.62} color="#bae6fd" />
        <pointLight position={[5.45, 5.15, 5.75]} intensity={1.2} color="#ffffff" distance={0} decay={2} />
        <CubeLogoMesh />
      </Canvas>
    </div>
  );
}
