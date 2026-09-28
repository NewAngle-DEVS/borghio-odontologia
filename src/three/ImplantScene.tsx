import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Cena procedural "Anatomia do cuidado".
 * Representação ILUSTRATIVA de um implante dentário com pilar e coroa –
 * não é uma reprodução fiel de um produto real.
 */

export type ProgressRef = { current: number };

export type ImplantSceneProps = {
  progress: ProgressRef;
  mode: "sequence" | "linear";
  reduced: boolean;
  active: boolean;
  quality: "high" | "low";
  labels?: MutableRefObject<(HTMLDivElement | null)[]>;
  eventSource?: React.RefObject<HTMLElement | null>;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ss = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = THREE.MathUtils.lerp;

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const IMPLANT_PROFILE: [number, number][] = [
  [0, -1.9],
  [0.1, -1.885],
  [0.19, -1.83],
  [0.25, -1.72],
  [0.28, -1.5],
  [0.3, -1.0],
  [0.325, -0.45],
  [0.335, -0.18],
  [0.372, -0.13],
  [0.372, -0.03],
  [0.335, 0],
  [0.2, 0],
  [0, 0],
];

function coreRadius(y: number) {
  // Linear interpolation over the descending part of the profile
  for (let i = 0; i < 8; i++) {
    const [r0, y0] = IMPLANT_PROFILE[i];
    const [r1, y1] = IMPLANT_PROFILE[i + 1];
    if (y >= y0 && y <= y1) return lerp(r0, r1, (y - y0) / (y1 - y0));
  }
  return 0.3;
}

class ThreadHelix extends THREE.Curve<THREE.Vector3> {
  constructor(
    private turns = 10.5,
    private yTop = -0.21,
    private yBottom = -1.74
  ) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const y = lerp(this.yTop, this.yBottom, t);
    const a = t * this.turns * Math.PI * 2;
    // thread depth fades out at the apex
    const depth = 0.014 * (1 - ss(0.86, 1, t));
    const r = coreRadius(y) + depth;
    return target.set(Math.cos(a) * r, y, Math.sin(a) * r);
  }
}

function smoothLathe(points: [number, number][], samples: number, radial: number) {
  const spline = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const pts = spline.getPoints(samples).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
  // make sure poles are exactly on the axis
  pts[0].x = 0;
  pts[pts.length - 1].x = 0;
  return new THREE.LatheGeometry(pts, radial);
}

function finalize(geo: THREE.BufferGeometry) {
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  const merged = mergeVertices(geo, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

function buildCrown(q: "high" | "low") {
  const profile: [number, number][] = [
    [0, 0.1],
    [0.2, 0.065],
    [0.36, 0.0],
    [0.425, 0.04],
    [0.505, 0.16],
    [0.585, 0.34],
    [0.6, 0.48],
    [0.588, 0.6],
    [0.545, 0.715],
    [0.47, 0.795],
    [0.36, 0.83],
    [0.22, 0.8],
    [0.1, 0.745],
    [0, 0.725],
  ];
  const geo = smoothLathe(profile, q === "high" ? 72 : 44, q === "high" ? 128 : 72);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    const th = Math.atan2(v.z, v.x);
    const top = ss(0.55, 0.8, v.y);
    // four cusps at the "corners" of the occlusal table
    const cusp = Math.pow(0.5 + 0.5 * Math.cos(4 * (th - Math.PI / 4)), 1.6);
    const ring = Math.exp(-Math.pow((r - 0.37) / 0.17, 2));
    const fissure = Math.exp(-Math.pow(r / 0.13, 2));
    // secondary grooves between cusps
    const groove = Math.pow(0.5 + 0.5 * Math.cos(4 * th), 8) * ss(0.05, 0.3, r) * (1 - ss(0.45, 0.6, r));
    v.y += top * (0.1 * cusp * ring - 0.035 * fissure - 0.02 * groove);
    // subtle organic irregularity + slightly rectangular molar footprint
    const wobble = 1 + 0.018 * Math.cos(2 * th + 0.6) + 0.01 * Math.cos(3 * th);
    v.x *= 1.06 * wobble;
    v.z *= 0.93 * wobble;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return finalize(geo);
}

function buildAbutment(q: "high" | "low") {
  const profile: [number, number][] = [
    [0, 0],
    [0.3, 0],
    [0.345, 0.05],
    [0.345, 0.1],
    [0.29, 0.16],
    [0.235, 0.205],
    [0.19, 0.72],
    [0.16, 0.765],
    [0, 0.775],
  ];
  const pts = profile.map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(pts, q === "high" ? 64 : 40);
  const hex = new THREE.CylinderGeometry(0.19, 0.19, 0.18, 6, 1);
  hex.translate(0, -0.09, 0);
  return { body, hex };
}

function buildImplant(q: "high" | "low") {
  const core = new THREE.LatheGeometry(
    IMPLANT_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
    q === "high" ? 72 : 40
  );
  const thread = new THREE.TubeGeometry(
    new ThreadHelix(),
    q === "high" ? 720 : 380,
    0.036,
    q === "high" ? 10 : 6,
    false
  );
  return { core, thread };
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(20,35,75,0.55)");
  grd.addColorStop(0.45, "rgba(20,35,75,0.18)");
  grd.addColorStop(1, "rgba(20,35,75,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Scroll choreography                                                 */
/* ------------------------------------------------------------------ */

function choreography(p: number, mode: "sequence" | "linear") {
  if (mode === "linear") {
    const e = ss(0.08, 0.75, p) * 0.85;
    return { e, xf: 0, scale: 0.9 - 0.14 * e, rot: p * Math.PI * 0.9, tilt: 0.16 + 0.1 * e, camZ: 7.4, label: 0 };
  }
  // 1. Presentation (0–0.18) · 2. Exploration (0.18–0.66) · 3. Transition (0.66–1)
  const a = ss(0.12, 0.38, p);
  const b = ss(0.7, 0.94, p);
  const e = ss(0.2, 0.42, p) * (1 - ss(0.64, 0.84, p));
  return {
    e,
    xf: lerp(lerp(0.4, 0.1, a), -0.44, b),
    scale: lerp(lerp(1.0, 0.74, a), 0.84, b),
    rot: p * Math.PI * 1.25,
    tilt: 0.12 + 0.16 * e,
    camZ: lerp(7.2, 6.9, a),
    label: ss(0.33, 0.41, p) * (1 - ss(0.58, 0.66, p)),
  };
}

/* ------------------------------------------------------------------ */
/* Scene graph                                                         */
/* ------------------------------------------------------------------ */

function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

function Assembly({ progress, mode, reduced, quality, labels }: Omit<ImplantSceneProps, "active">) {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const crown = useRef<THREE.Mesh>(null!);
  const abutment = useRef<THREE.Group>(null!);
  const implant = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const smooth = useRef(progress.current);
  const pointer = useRef({ x: 0, y: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const geo = useMemo(
    () => ({ crown: buildCrown(quality), abut: buildAbutment(quality), imp: buildImplant(quality) }),
    [quality]
  );
  const shadowTex = useMemo(() => shadowTexture(), []);

  const mats = useMemo(
    () => ({
      titanium: new THREE.MeshStandardMaterial({
        color: "#c2c8d0",
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.15,
        side: THREE.DoubleSide,
      }),
      abutment: new THREE.MeshStandardMaterial({
        color: "#d9d0bf",
        metalness: 1,
        roughness: 0.22,
        side: THREE.DoubleSide,
        envMapIntensity: 1.1,
      }),
      ceramic: new THREE.MeshPhysicalMaterial({
        color: "#f6f2ea",
        roughness: 0.3,
        metalness: 0,
        clearcoat: 0.85,
        clearcoatRoughness: 0.14,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.45,
        side: THREE.DoubleSide,
        envMapIntensity: 0.9,
      }),
    }),
    []
  );

  useEffect(
    () => () => {
      geo.crown.dispose();
      geo.abut.body.dispose();
      geo.abut.hex.dispose();
      geo.imp.core.dispose();
      geo.imp.thread.dispose();
    },
    [geo]
  );
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      shadowTex.dispose();
    },
    [mats, shadowTex]
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    smooth.current = reduced ? progress.current : THREE.MathUtils.damp(smooth.current, progress.current, 7, d);
    const p = smooth.current;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const c = choreography(p, mode);
    const halfW = state.viewport.width / 2;

    if (!reduced && mode === "sequence") {
      pointer.current.x = THREE.MathUtils.damp(pointer.current.x, state.pointer.x, 3, d);
      pointer.current.y = THREE.MathUtils.damp(pointer.current.y, state.pointer.y, 3, d);
    }

    outer.current.position.set(c.xf * halfW, -0.05, 0);
    outer.current.scale.setScalar(c.scale);

    inner.current.rotation.set(
      c.tilt - pointer.current.y * 0.08,
      -0.5 + t * 0.16 + c.rot + pointer.current.x * 0.22,
      -0.06 * (1 - c.e)
    );
    inner.current.position.y = 0.39 - 0.18 * c.e + Math.sin(t * 0.9) * 0.035;

    crown.current.position.y = 0.2 + 1.12 * c.e;
    crown.current.rotation.y = c.e * 0.6;
    abutment.current.position.y = 0.46 * c.e;
    abutment.current.rotation.y = -c.e * Math.PI * 0.5;
    implant.current.position.y = -0.72 * c.e;
    // the fixture "unscrews" while the pieces separate
    implant.current.rotation.y = c.e * Math.PI * 3;

    // shadow lives in the (scaled) outer group: follow the implant apex
    const floor = -1.7 - 0.9 * c.e;
    shadow.current.position.set(0, floor, 0);
    const sm = shadow.current.material as THREE.MeshBasicMaterial;
    sm.opacity = 0.75 - 0.35 * c.e;

    state.camera.position.set(0, 0.35, c.camZ);
    state.camera.lookAt(0, 0.02, 0);

    // HTML callouts anchored to each piece
    const els = labels?.current;
    if (els && mode === "sequence") {
      const anchors: [THREE.Object3D, number][] = [
        [crown.current, 0.45],
        [abutment.current, 0.4],
        [implant.current, -0.95],
      ];
      const { width, height } = state.size;
      anchors.forEach(([obj, y], i) => {
        const el = els[i];
        if (!el) return;
        obj.localToWorld(tmp.set(0, y, 0)).project(state.camera);
        const x = (tmp.x * 0.5 + 0.5) * width;
        const yy = (-tmp.y * 0.5 + 0.5) * height;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${yy.toFixed(1)}px, 0)`;
        el.style.opacity = c.label.toFixed(3);
        el.style.visibility = c.label > 0.01 ? "visible" : "hidden";
      });
    }
  });

  return (
    <group ref={outer}>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} scale={[2.3, 2.3, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.75} />
      </mesh>
      <group ref={inner}>
        <group ref={implant}>
          <mesh geometry={geo.imp.core} material={mats.titanium} />
          <mesh geometry={geo.imp.thread} material={mats.titanium} />
        </group>
        <group ref={abutment}>
          <mesh geometry={geo.abut.body} material={mats.abutment} />
          <mesh geometry={geo.abut.hex} material={mats.abutment} />
        </group>
        <mesh ref={crown} geometry={geo.crown} material={mats.ceramic} />
      </group>
    </group>
  );
}

export default function ImplantScene(props: ImplantSceneProps) {
  const { active, reduced, quality, eventSource, ...rest } = props;
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      eventSource={eventSource as React.RefObject<HTMLElement> | undefined}
      eventPrefix="client"
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.4]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0.35, 7.2], near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <StudioEnvironment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 6, 5]} intensity={2.4} color="#fff3e2" />
      <directionalLight position={[5, 2.5, -4]} intensity={1.6} color="#9fb2ff" />
      <directionalLight position={[0, -3, 4]} intensity={0.35} color="#ffffff" />
      <Assembly {...rest} reduced={reduced} quality={quality} />
    </Canvas>
  );
}
