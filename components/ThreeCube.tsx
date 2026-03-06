"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import * as THREE from "three";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";
import { CubeFace, tiles } from "@/lib/tiles";
import { useUIStore } from "@/lib/ui-store";

type Props = {
  onTileSelect: (tileId: string) => void;
  reducedMotion: boolean;
  lowPerfMode: boolean;
  onFaceChange?: (face: CubeFace) => void;
  onHoverLabelChange?: (label: string | null) => void;
  onAutoRotateComplete?: () => void;
};

type HoveredTile = {
  id: string;
  label: string;
};

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

const EDGE = 0.94;
const GAP = 1.04;
const STICKER_SIZE = 0.94;
const INTERACTIVE_TILE_COLOR = "#22d3ee";
const INTERACTIVE_CUBIE_COLOR = "#22d3ee";
const BASE_CUBIE_COLOR = "#b7c9e6";
const HOVER_POP_DISTANCE = 0.2;
const HIT_ZONE_SCALE = 1.35;
const TAP_MOVE_THRESHOLD_PX = 10;
const IDLE_DELAY_MS = 0;
const IDLE_ROTATE_SPEED = 0.3;
const HOVER_CLOSE_DELAY_MS = 500;
const AUTO_ROTATE_DURATION = 0.7;
const DEFAULT_CAMERA_POSITION: [number, number, number] = [5.45, 5.15, 5.75];
const ENABLE_IDLE_CUBE_ROTATION = true;
const ENABLE_IDLE_FACE_TURNS = true;

const FACE_DIRECTIONS: Array<{ face: CubeFace; normal: THREE.Vector3 }> = [
  { face: "front", normal: new THREE.Vector3(0, 0, 1) },
  { face: "back", normal: new THREE.Vector3(0, 0, -1) },
  { face: "left", normal: new THREE.Vector3(-1, 0, 0) },
  { face: "right", normal: new THREE.Vector3(1, 0, 0) },
  { face: "top", normal: new THREE.Vector3(0, 1, 0) },
  { face: "bottom", normal: new THREE.Vector3(0, -1, 0) }
];

const ALL_FACES: CubeFace[] = ["front", "back", "left", "right", "top", "bottom"];
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const easeInOutQuad = (value: number) =>
  value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;

type RotationAnimation = {
  from: THREE.Quaternion;
  to: THREE.Quaternion;
  elapsed: number;
  duration: number;
};

type FaceTurnAxis = "x" | "y" | "z";
type FaceTurnLayer = -1 | 1;

type FaceTurnSpec = {
  axis: FaceTurnAxis;
  layer: FaceTurnLayer;
  direction: -1 | 1;
};

type FaceTurnAnimation = {
  turns: FaceTurnSpec[];
  elapsed: number;
  duration: number;
  maxAngle: number;
};

type ActiveFaceTurnState = {
  axis: FaceTurnAxis;
  layer: FaceTurnLayer;
  angle: number;
  sin: number;
  cos: number;
  quaternion: THREE.Quaternion;
};

const FACE_TURN_AXES: FaceTurnAxis[] = ["x", "y", "z"];
const FACE_TURN_LAYERS: FaceTurnLayer[] = [-1, 1];
const FACE_TURN_AXIS_VECTORS: Record<FaceTurnAxis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1)
};
const RUBIK_IDLE_TURN_MIN_DELAY_MS = 850;
const RUBIK_IDLE_TURN_MAX_DELAY_MS = 1700;
const RUBIK_IDLE_TURN_DURATION = 1.8;
const RUBIK_IDLE_TURN_MAX_ANGLE = Math.PI;

const FACE_ROTATIONS: Record<CubeFace, [number, number, number]> = {
  front: [0, 0, 0],
  back: [0, Math.PI, 0],
  left: [0, -Math.PI / 2, 0],
  right: [0, Math.PI / 2, 0],
  top: [-Math.PI / 2, 0, 0],
  bottom: [Math.PI / 2, 0, 0]
};

const FACE_BASE_QUATERNIONS: Record<CubeFace, THREE.Quaternion> = {
  front: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
  back: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)),
  left: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)),
  right: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
  top: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
  bottom: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
};

function CubeScene({ onTileSelect, reducedMotion, lowPerfMode, onFaceChange, onHoverLabelChange, onAutoRotateComplete }: Props) {
  const { gl, camera } = useThree();
  const controlsRef = useRef<TrackballControlsImpl | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointerNdcRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const previousUserSelectRef = useRef<string | null>(null);
  const rotationAnimationRef = useRef<RotationAnimation | null>(null);
  const faceTurnAnimationRef = useRef<FaceTurnAnimation | null>(null);
  const activeFaceTurnsRef = useRef<ActiveFaceTurnState[]>([]);
  const nextFaceTurnAtRef = useRef<number>(Date.now() + RUBIK_IDLE_TURN_MIN_DELAY_MS);
  const lastIdleTurnAxisRef = useRef<FaceTurnAxis | null>(null);
  const frontLightRef = useRef<THREE.PointLight>(null);
  const hoverClearTimerRef = useRef<number | null>(null);
  const hoverResumeTimerRef = useRef<number | null>(null);
  const cubieMeshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const stickerGroupRefs = useRef<Map<string, THREE.Group>>(new Map());
  const cubiePopProgressRef = useRef<Map<string, number>>(new Map());
  const tileTapStateRef = useRef<{ pointerId: number; x: number; y: number; moved: boolean; tileId: string } | null>(null);
  const mobileTapPendingRef = useRef<{ tileId: string } | null>(null);
  const lastInteractionRef = useRef<number>(Date.now() - IDLE_DELAY_MS);
  const isUserInteractingRef = useRef(false);
  const activeFaceRef = useRef<CubeFace>("front");
  const [hovered, setHovered] = useState<HoveredTile | null>(null);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const cancelHoverClear = useCallback(() => {
    if (hoverClearTimerRef.current) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
    if (hoverResumeTimerRef.current) {
      window.clearTimeout(hoverResumeTimerRef.current);
      hoverResumeTimerRef.current = null;
    }
  }, []);

  const scheduleHoverClear = useCallback((tileId?: string) => {
    cancelHoverClear();
    hoverClearTimerRef.current = window.setTimeout(() => {
      setHovered((current) => {
        if (!current) return current;
        if (tileId && current.id !== tileId) return current;
        return null;
      });
      hoverClearTimerRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  }, [cancelHoverClear]);

  const targetOrientation = useUIStore((state) => state.targetOrientation);
  const setTargetOrientation = useUIStore((state) => state.setTargetOrientation);
  const openPanelId = useUIStore((state) => state.openPanelId);

  const tileIndex = useMemo(
    () => new Map(tiles.map((tile) => [`${tile.face}-${tile.row}-${tile.col}`, tile])),
    []
  );

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

  useEffect(() => {
    if (!groupRef.current || !targetOrientation) return;

    clearFaceTurnAnimation(true);

    camera.position.set(DEFAULT_CAMERA_POSITION[0], DEFAULT_CAMERA_POSITION[1], DEFAULT_CAMERA_POSITION[2]);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.target.set(0, 0, 0);
    controlsRef.current?.update();

    const targetEuler = new THREE.Euler(targetOrientation[0], targetOrientation[1], targetOrientation[2], "XYZ");
    const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

    rotationAnimationRef.current = {
      from: groupRef.current.quaternion.clone(),
      to: targetQuaternion,
      elapsed: 0,
      duration: reducedMotion ? 0.25 : AUTO_ROTATE_DURATION
    };

    isUserInteractingRef.current = false;
    setIsAutoRotating(true);
    gl.domElement.style.cursor = "default";
    setTargetOrientation(null);
  }, [targetOrientation, reducedMotion, setTargetOrientation, gl, camera]);

  useEffect(() => {
    const clearHover = () => scheduleHoverClear();
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerDown = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const group = groupRef.current;

      let isPointerOnCube = false;
      if (group) {
        pointerNdcRef.current.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        );
        raycasterRef.current.setFromCamera(pointerNdcRef.current, camera);
        isPointerOnCube = raycasterRef.current.intersectObject(group, true).length > 0;
      }

      setControlsEnabled(isPointerOnCube);
      if (!isPointerOnCube) {
        controlsRef.current && (controlsRef.current.enabled = false);
        gl.domElement.style.cursor = "default";
        event.stopImmediatePropagation();
      }

      if (previousUserSelectRef.current === null) {
        previousUserSelectRef.current = document.body.style.userSelect;
      }
      document.body.style.userSelect = "none";
      window.getSelection?.()?.removeAllRanges();
    };
    const onPointerRelease = () => {
      setControlsEnabled(true);
      if (controlsRef.current) {
        controlsRef.current.enabled = !openPanelId && !isAutoRotating;
      }
      gl.domElement.style.cursor = "default";
      if (previousUserSelectRef.current !== null) {
        document.body.style.userSelect = previousUserSelectRef.current;
        previousUserSelectRef.current = null;
      }
    };

    const onPointerMoveTrackTap = (event: PointerEvent) => {
      const tap = tileTapStateRef.current;
      if (!tap || tap.pointerId !== event.pointerId || tap.moved) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if (dx * dx + dy * dy > TAP_MOVE_THRESHOLD_PX * TAP_MOVE_THRESHOLD_PX) {
        tap.moved = true;
      }
    };

    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      const pending = mobileTapPendingRef.current;
      if (!pending) return;
      const targetNode = event.target as Node | null;
      if (targetNode && !gl.domElement.contains(targetNode)) {
        mobileTapPendingRef.current = null;
        cancelHoverClear();
        setHovered(null);
      }
    };

    if (supportsHover) {
      gl.domElement.addEventListener("pointerleave", clearHover);
    }
    gl.domElement.addEventListener("pointerdown", onPointerDown, { capture: true });
    document.addEventListener("pointerdown", onDocumentPointerDown);
    window.addEventListener("pointermove", onPointerMoveTrackTap);
    window.addEventListener("pointerup", onPointerRelease);
    window.addEventListener("pointercancel", onPointerRelease);
    window.addEventListener("blur", onPointerRelease);
    gl.domElement.style.cursor = "default";

    return () => {
      if (supportsHover) {
        gl.domElement.removeEventListener("pointerleave", clearHover);
      }
      gl.domElement.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      window.removeEventListener("pointermove", onPointerMoveTrackTap);
      window.removeEventListener("pointerup", onPointerRelease);
      window.removeEventListener("pointercancel", onPointerRelease);
      window.removeEventListener("blur", onPointerRelease);
      gl.domElement.style.cursor = "default";
      cancelHoverClear();
      if (previousUserSelectRef.current !== null) {
        document.body.style.userSelect = previousUserSelectRef.current;
        previousUserSelectRef.current = null;
      }
    };
  }, [gl, camera, scheduleHoverClear, cancelHoverClear, openPanelId, isAutoRotating]);

  useEffect(() => {
    if (!openPanelId) return;
    mobileTapPendingRef.current = null;
    cancelHoverClear();
    setHovered(null);
    clearFaceTurnAnimation(true);
  }, [openPanelId, cancelHoverClear]);

  useEffect(() => {
    onHoverLabelChange?.(hovered?.label ?? null);
  }, [hovered, onHoverLabelChange]);

  // Pause automatic idle rotation while hovering a highlighted tile.
  useEffect(() => {
    if (hovered) {
      if (hoverResumeTimerRef.current) {
        window.clearTimeout(hoverResumeTimerRef.current);
        hoverResumeTimerRef.current = null;
      }
      isUserInteractingRef.current = true;
      lastInteractionRef.current = Date.now();
    } else {
      // resume after 500ms
      hoverResumeTimerRef.current = window.setTimeout(() => {
        isUserInteractingRef.current = false;
        hoverResumeTimerRef.current = null;
        lastInteractionRef.current = Date.now() - IDLE_DELAY_MS;
      }, 500);
    }

    return () => {
      if (hoverResumeTimerRef.current) {
        window.clearTimeout(hoverResumeTimerRef.current);
        hoverResumeTimerRef.current = null;
      }
    };
  }, [hovered]);

  const registerInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  function scheduleNextFaceTurn(minDelay = RUBIK_IDLE_TURN_MIN_DELAY_MS, maxDelay = RUBIK_IDLE_TURN_MAX_DELAY_MS) {
    nextFaceTurnAtRef.current = Date.now() + THREE.MathUtils.randInt(minDelay, maxDelay);
  }

  function clearFaceTurnAnimation(resetSchedule = false) {
    faceTurnAnimationRef.current = null;
    activeFaceTurnsRef.current = [];
    if (resetSchedule) {
      scheduleNextFaceTurn();
    }
  }

  function startIdleFaceTurn() {
    const axisChoices = FACE_TURN_AXES.filter((candidate) => candidate !== lastIdleTurnAxisRef.current);
    const pool = axisChoices.length > 0 ? axisChoices : FACE_TURN_AXES;
    const axis = pool[Math.floor(Math.random() * pool.length)];
    const turns: FaceTurnSpec[] = FACE_TURN_LAYERS.map((layer) => ({
      axis,
      layer,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    faceTurnAnimationRef.current = {
      turns,
      elapsed: 0,
      duration: reducedMotion ? RUBIK_IDLE_TURN_DURATION * 0.8 : RUBIK_IDLE_TURN_DURATION,
      maxAngle: RUBIK_IDLE_TURN_MAX_ANGLE
    };
    activeFaceTurnsRef.current = [];
    lastIdleTurnAxisRef.current = axis;
    scheduleNextFaceTurn();
  }

  function isPieceInTurnLayer(x: number, y: number, z: number, axis: FaceTurnAxis, layer: FaceTurnLayer) {
    if (axis === "x") return x === layer;
    if (axis === "y") return y === layer;
    return z === layer;
  }

  function rotatePositionByTurn(
    x: number,
    y: number,
    z: number,
    turn: ActiveFaceTurnState
  ): [number, number, number] {
    const { axis, sin, cos } = turn;
    if (axis === "x") {
      return [x, y * cos - z * sin, y * sin + z * cos];
    }
    if (axis === "y") {
      return [x * cos + z * sin, y, -x * sin + z * cos];
    }
    return [x * cos - y * sin, x * sin + y * cos, z];
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const group = groupRef.current;

    if (frontLightRef.current) {
      frontLightRef.current.position.copy(camera.position);
    }

    const activeAnimation = rotationAnimationRef.current;
    if (activeAnimation) {
      activeAnimation.elapsed += delta;
      const progress = Math.min(1, activeAnimation.elapsed / activeAnimation.duration);
      const eased = easeInOutQuad(progress);
      group.quaternion.slerpQuaternions(activeAnimation.from, activeAnimation.to, eased);

      if (progress >= 1) {
        group.quaternion.copy(activeAnimation.to);
        rotationAnimationRef.current = null;
        setIsAutoRotating(false);
        onAutoRotateComplete?.();
      }
    }

    const now = Date.now();
    const canRunIdleFaceTurns =
      ENABLE_IDLE_FACE_TURNS &&
      !reducedMotion &&
      !openPanelId &&
      !hovered &&
      !isUserInteractingRef.current &&
      !rotationAnimationRef.current;

    const shouldAbortActiveFaceTurn =
      !ENABLE_IDLE_FACE_TURNS || reducedMotion || Boolean(openPanelId) || Boolean(rotationAnimationRef.current);

    if (shouldAbortActiveFaceTurn && faceTurnAnimationRef.current) {
      clearFaceTurnAnimation(true);
    }

    if (canRunIdleFaceTurns && !faceTurnAnimationRef.current && now >= nextFaceTurnAtRef.current) {
      startIdleFaceTurn();
    }

    const activeFaceTurnAnimation = faceTurnAnimationRef.current;
    if (activeFaceTurnAnimation) {
      activeFaceTurnAnimation.elapsed += delta;
      const turnProgress = Math.min(1, activeFaceTurnAnimation.elapsed / activeFaceTurnAnimation.duration);
      const easedTurn = easeInOutQuad(turnProgress);
      activeFaceTurnsRef.current = activeFaceTurnAnimation.turns.map((turn) => {
        const angle = turn.direction * activeFaceTurnAnimation.maxAngle * easedTurn;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        return {
          axis: turn.axis,
          layer: turn.layer,
          angle,
          sin,
          cos,
          quaternion: new THREE.Quaternion().setFromAxisAngle(FACE_TURN_AXIS_VECTORS[turn.axis], angle)
        };
      });

      if (turnProgress >= 1) {
        clearFaceTurnAnimation(true);
      }
    } else {
      activeFaceTurnsRef.current = [];
    }

    const idleFor = Date.now() - lastInteractionRef.current;
    if (
      ENABLE_IDLE_CUBE_ROTATION &&
      !reducedMotion &&
      !openPanelId &&
      !isUserInteractingRef.current &&
      !rotationAnimationRef.current &&
      idleFor >= IDLE_DELAY_MS
    ) {
        // Rotește cubul pe axa Y și X simultan pentru efect mai dinamic
        group.rotation.y += delta * IDLE_ROTATE_SPEED;
        group.rotation.x += delta * (IDLE_ROTATE_SPEED * 0.6); // X puțin mai lent decât Y
      }

    const viewerDirection = camera.position.clone().normalize();
    let bestFace: CubeFace = "front";
    let bestDot = -Infinity;

    for (const entry of FACE_DIRECTIONS) {
      const worldNormal = entry.normal.clone().applyQuaternion(group.quaternion).normalize();
      const dot = worldNormal.dot(viewerDirection);
      if (dot > bestDot) {
        bestDot = dot;
        bestFace = entry.face;
      }
    }

    if (bestFace !== activeFaceRef.current) {
      activeFaceRef.current = bestFace;
      onFaceChange?.(bestFace);
    }
  });

  const getStickerData = (face: CubeFace, x: number, y: number, z: number) => {
    const [uAxis, vAxis, uSign, vSign] = FACE_UV[face];
    const uRaw = uAxis === "x" ? x : uAxis === "y" ? y : z;
    const vRaw = vAxis === "x" ? x : vAxis === "y" ? y : z;
    const col = Math.round((uRaw * uSign + 1) as number);
    const row = Math.round((1 - vRaw * vSign) as number);
    const key = `${face}-${row}-${col}`;
    const tile = tileIndex.get(key);
    return { row, col, tile };
  };

  const getCubieKey = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const getStickerKey = (face: CubeFace, x: number, y: number, z: number) => `${face}:${x},${y},${z}`;

  const renderSticker = (
    face: CubeFace,
    x: number,
    y: number,
    z: number,
    isOuterFace: boolean,
    isInteractiveCubie: boolean
  ) => {
    const [nx, ny, nz] = FACE_VECTORS[face];
    const { tile } = getStickerData(face, x, y, z);
    const isInteractive = isOuterFace && Boolean(tile);
    const isHovered = hovered?.id === tile?.id;
    const center: [number, number, number] = [
      x * GAP + nx * (EDGE / 2 + 0.01),
      y * GAP + ny * (EDGE / 2 + 0.01),
      z * GAP + nz * (EDGE / 2 + 0.01)
    ];
    const rotation = FACE_ROTATIONS[face];

    const nonClickableColor = "#0f172a";
    const stickerColor = isInteractiveCubie
      ? INTERACTIVE_TILE_COLOR
      : isOuterFace
        ? (tile ? INTERACTIVE_TILE_COLOR : nonClickableColor)
        : nonClickableColor;

    const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (!tile) return;
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        return;
      }
      const localPoint = event.object.worldToLocal(event.point.clone());
      const stickerHalfSize = STICKER_SIZE / 2;
      const isOverExteriorSticker =
        Math.abs(localPoint.x) <= stickerHalfSize && Math.abs(localPoint.y) <= stickerHalfSize;
      if (!isOverExteriorSticker) {
        gl.domElement.style.cursor = "default";
        scheduleHoverClear(tile.id);
        return;
      }
      registerInteraction();
      gl.domElement.style.cursor = "default";
      cancelHoverClear();
      setHovered({ id: tile.id, label: tile.label });
    };

    const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (!tile) return;
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        return;
      }
      const localPoint = event.object.worldToLocal(event.point.clone());
      const stickerHalfSize = STICKER_SIZE / 2;
      const isOverExteriorSticker =
        Math.abs(localPoint.x) <= stickerHalfSize && Math.abs(localPoint.y) <= stickerHalfSize;
      if (!isOverExteriorSticker) {
        gl.domElement.style.cursor = "default";
        scheduleHoverClear(tile.id);
        return;
      }
      registerInteraction();
      gl.domElement.style.cursor = "default";
      cancelHoverClear();
      setHovered({ id: tile.id, label: tile.label });
    };

    const onPointerOut = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (!tile) return;
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        return;
      }
      registerInteraction();
      gl.domElement.style.cursor = "default";
      scheduleHoverClear(tile.id);
    };

    const onTilePointerDown = (event: ThreeEvent<PointerEvent>) => {
      if (!tile) return;
      event.stopPropagation();
      registerInteraction();
      tileTapStateRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        moved: false,
        tileId: tile.id
      };
    };


    const onTilePointerUp = (event: ThreeEvent<PointerEvent>) => {
      const tap = tileTapStateRef.current;
      if (!tap || tap.pointerId !== event.pointerId) return;
      event.stopPropagation();
      registerInteraction();
      if (!tap.moved && tap.tileId === tile?.id) {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          const pending = mobileTapPendingRef.current;

          if (pending && pending.tileId === tap.tileId) {
            mobileTapPendingRef.current = null;
            setHovered(null);
            onTileSelect(tap.tileId);
          } else {
            mobileTapPendingRef.current = { tileId: tap.tileId };
            cancelHoverClear();
            setHovered({ id: tap.tileId, label: tile.label });
          }
        } else {
          onTileSelect(tap.tileId);
        }
      }
      tileTapStateRef.current = null;
    };

    const onTilePointerCancel = (event: ThreeEvent<PointerEvent>) => {
      const tap = tileTapStateRef.current;
      if (!tap || tap.pointerId !== event.pointerId) return;
      tileTapStateRef.current = null;
    };

    return (
      <group
        key={`${face}-${x}-${y}-${z}`}
        ref={(node) => {
          const key = getStickerKey(face, x, y, z);
          if (node) {
            stickerGroupRefs.current.set(key, node);
          } else {
            stickerGroupRefs.current.delete(key);
          }
        }}
        position={center}
        rotation={rotation}
      >
        <mesh>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={stickerColor}
            metalness={0.2}
            roughness={0.35}
            emissiveIntensity={isHovered ? 1.38 : 1.08}
            emissive={
              isInteractive
                ? new THREE.Color(stickerColor).multiplyScalar(isHovered ? 0.5 : 0.26)
                : new THREE.Color(stickerColor).multiplyScalar(0.16)
            }
          />
        </mesh>

        {isInteractive && tile ? (
          <Text
            position={[0, 0, 0.012]}
            fontSize={0.125}
            maxWidth={STICKER_SIZE * 0.74}
            lineHeight={1.0}
            letterSpacing={0.02}
            textAlign="center"
            color="#0b1220"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor="#f8fafc"
            raycast={() => null}
          >
            {tile.label.toUpperCase()}
          </Text>
        ) : null}

        {isInteractive ? (
          <mesh
            position={[0, 0, 0.01]}
            onPointerOver={onPointerOver}
            onPointerMove={onPointerMove}
            onPointerOut={onPointerOut}
            onPointerDown={onTilePointerDown}
            onPointerUp={onTilePointerUp}
            onPointerCancel={onTilePointerCancel}
          >
            <planeGeometry args={[STICKER_SIZE * HIT_ZONE_SCALE, STICKER_SIZE * HIT_ZONE_SCALE]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        ) : null}
      </group>
    );
  };

  const getOuterFaces = (x: number, y: number, z: number): CubeFace[] => {
    const faces: CubeFace[] = [];
    if (x === 1) faces.push("right");
    if (x === -1) faces.push("left");
    if (y === 1) faces.push("top");
    if (y === -1) faces.push("bottom");
    if (z === 1) faces.push("front");
    if (z === -1) faces.push("back");
    return faces;
  };

  useFrame((_, delta) => {
    const activeFaceTurns = activeFaceTurnsRef.current;

    for (const [x, y, z] of cubies) {
      const cubieKey = getCubieKey(x, y, z);
      const outerFaces = getOuterFaces(x, y, z);
      const isHoveredCubie = hovered
        ? outerFaces.some((face) => getStickerData(face, x, y, z).tile?.id === hovered.id)
        : false;

      const target = isHoveredCubie ? 1 : 0;
      const current = cubiePopProgressRef.current.get(cubieKey) ?? 0;
      const next = THREE.MathUtils.damp(current, target, reducedMotion ? 16 : 8, delta);
      cubiePopProgressRef.current.set(cubieKey, next);

      const eased = easeOutCubic(next);
      const cubieLength = Math.hypot(x, y, z) || 1;
      const popX = (x / cubieLength) * HOVER_POP_DISTANCE * eased;
      const popY = (y / cubieLength) * HOVER_POP_DISTANCE * eased;
      const popZ = (z / cubieLength) * HOVER_POP_DISTANCE * eased;

      const matchingTurns = activeFaceTurns.filter((turn) =>
        isPieceInTurnLayer(x, y, z, turn.axis, turn.layer)
      );
      const cubieInTurningLayer = matchingTurns.length > 0;

      let cubiePosX = x * GAP + popX;
      let cubiePosY = y * GAP + popY;
      let cubiePosZ = z * GAP + popZ;

      if (cubieInTurningLayer) {
        for (const turn of matchingTurns) {
          [cubiePosX, cubiePosY, cubiePosZ] = rotatePositionByTurn(cubiePosX, cubiePosY, cubiePosZ, turn);
        }
      }

      const cubieMesh = cubieMeshRefs.current.get(cubieKey);
      if (cubieMesh) {
        cubieMesh.position.set(cubiePosX, cubiePosY, cubiePosZ);
        cubieMesh.quaternion.identity();
        if (cubieInTurningLayer) {
          for (const turn of matchingTurns) {
            cubieMesh.quaternion.premultiply(turn.quaternion);
          }
        }
      }

      for (const face of ALL_FACES) {
        const stickerGroup = stickerGroupRefs.current.get(getStickerKey(face, x, y, z));
        if (!stickerGroup) continue;
        const [nx, ny, nz] = FACE_VECTORS[face];
        let stickerX = x * GAP + popX + nx * (EDGE / 2 + 0.01);
        let stickerY = y * GAP + popY + ny * (EDGE / 2 + 0.01);
        let stickerZ = z * GAP + popZ + nz * (EDGE / 2 + 0.01);

        if (cubieInTurningLayer) {
          for (const turn of matchingTurns) {
            [stickerX, stickerY, stickerZ] = rotatePositionByTurn(stickerX, stickerY, stickerZ, turn);
          }
        }

        stickerGroup.position.set(stickerX, stickerY, stickerZ);
        stickerGroup.quaternion.copy(FACE_BASE_QUATERNIONS[face]);
        if (cubieInTurningLayer) {
          for (const turn of matchingTurns) {
            stickerGroup.quaternion.premultiply(turn.quaternion);
          }
        }
      }
    }
  });

  return (
    <>
      <TrackballControls
        ref={controlsRef}
        enabled={controlsEnabled && !openPanelId && !isAutoRotating}
        target={[0, 0, 0]}
        noPan
        noZoom
        rotateSpeed={2.8}
        dynamicDampingFactor={reducedMotion ? 0.2 : 0.1}
        staticMoving={reducedMotion}
        onStart={() => {
          isUserInteractingRef.current = true;
          registerInteraction();
          gl.domElement.style.cursor = "default";
        }}
        onChange={() => {
          registerInteraction();
        }}
        onEnd={() => {
          isUserInteractingRef.current = false;
          registerInteraction();
          gl.domElement.style.cursor = "default";
        }}
      />

      <ambientLight intensity={0.92} />
      <directionalLight castShadow={!lowPerfMode} position={[4, 7, 6]} intensity={1.65} color="#ecfeff" />
      <directionalLight position={[-5, -3, -4]} intensity={0.62} color="#bae6fd" />
      <pointLight ref={frontLightRef} intensity={1.35} color="#ffffff" distance={0} decay={2} />

      <group ref={groupRef} scale={1.08} position={[0, 0.12, 0]}>
        {cubies.map(([x, y, z]) => {
          const outerFaces = getOuterFaces(x, y, z);
          const isInteractiveCubie = outerFaces.some((face) => Boolean(getStickerData(face, x, y, z).tile));

          return (
            <mesh
              key={`cubie-${x}-${y}-${z}`}
              ref={(node) => {
                const key = getCubieKey(x, y, z);
                if (node) {
                  cubieMeshRefs.current.set(key, node);
                } else {
                  cubieMeshRefs.current.delete(key);
                }
              }}
              position={[x * GAP, y * GAP, z * GAP]}
              castShadow
              receiveShadow
              raycast={() => null}
            >
              <boxGeometry args={[EDGE, EDGE, EDGE]} />
              <meshStandardMaterial
                color={isInteractiveCubie ? INTERACTIVE_CUBIE_COLOR : BASE_CUBIE_COLOR}
                metalness={0.18}
                roughness={0.2}
                emissive={isInteractiveCubie ? "#0891b2" : "#93c5fd"}
                emissiveIntensity={isInteractiveCubie ? 0.12 : 0.08}
              />
            </mesh>
          );
        })}

        {cubies.flatMap(([x, y, z]) => {
          const outerFaces = getOuterFaces(x, y, z);
          const isInteractiveCubie = outerFaces.some((face) => Boolean(getStickerData(face, x, y, z).tile));
          return ALL_FACES.map((face) => renderSticker(face, x, y, z, outerFaces.includes(face), isInteractiveCubie));
        })}
      </group>

    </>
  );
}

export default function ThreeCube({ onTileSelect, reducedMotion, lowPerfMode, onFaceChange, onHoverLabelChange, onAutoRotateComplete }: Props) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const mobileOptimizedMode = lowPerfMode || coarsePointer;

  const handleHoverLabelChange = (label: string | null) => {
    setHoveredLabel(label);
    onHoverLabelChange?.(label);
  };

  return (
    <div className="relative mx-auto h-[42svh] min-h-[280px] w-full max-w-[1100px] select-none overflow-visible sm:h-[56svh] sm:min-h-0 lg:h-[62svh]">
      <Canvas
        className="h-full w-full"
        shadows={!mobileOptimizedMode}
        dpr={mobileOptimizedMode ? [1, 1.1] : [1, 1.45]}
        camera={{ fov: 36, position: [5.45, 5.15, 5.75] }}
      >
        <CubeScene
          onTileSelect={onTileSelect}
          reducedMotion={reducedMotion}
          lowPerfMode={mobileOptimizedMode}
          onFaceChange={onFaceChange}
          onHoverLabelChange={handleHoverLabelChange}
          onAutoRotateComplete={onAutoRotateComplete}
        />
      </Canvas>

      {hoveredLabel ? (
        <div className="pointer-events-none absolute right-5 top-5 z-30 hidden max-w-[220px] rounded-lg border border-cyan-300/60 bg-slate-950/92 px-3 py-2 text-sm font-semibold text-cyan-100 shadow-xl sm:block">
          {hoveredLabel}
        </div>
      ) : null}
    </div>
  );
}
