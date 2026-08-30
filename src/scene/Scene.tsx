import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";
import { scrollState } from "../lib/scroll";

const VIOLA = new THREE.Color("#8b5cf6");
const CIANO = new THREE.Color("#22d3ee");
const ROSA = new THREE.Color("#c084fc");

/**
 * PRNG con seme fisso. Serve perché la disposizione va decisa in un useMemo:
 * con Math.random il doppio render di StrictMode darebbe due scene diverse.
 */
function rnd(seme: number) {
  return () => {
    seme |= 0;
    seme = (seme + 0x6d2b79f5) | 0;
    let t = Math.imul(seme ^ (seme >>> 15), 1 | seme);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Interpolazione esponenziale indipendente dal frame rate. */
const damp = (a: number, b: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

/* ------------------------------------------------------------------ */
/* Campo di particelle: la profondità della scena.                     */
/* ------------------------------------------------------------------ */
function Particelle({ conta = 2600 }: { conta?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { posizioni, colori } = useMemo(() => {
    const posizioni = new Float32Array(conta * 3);
    const colori = new Float32Array(conta * 3);
    const c = new THREE.Color();
    const r0 = rnd(1337);
    for (let i = 0; i < conta; i++) {
      // Distribuzione a guscio: al centro sta l'oggetto, lì non ne voglio.
      const r = 6 + r0() * 16;
      const theta = r0() * Math.PI * 2;
      const phi = Math.acos(2 * r0() - 1);
      posizioni[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posizioni[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      posizioni[i * 3 + 2] = r * Math.cos(phi);
      c.copy(r0() > 0.5 ? VIOLA : CIANO).multiplyScalar(0.4 + r0() * 0.6);
      colori.set([c.r, c.g, c.b], i * 3);
    }
    return { posizioni, colori };
  }, [conta]);

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.02;
    p.rotation.x = Math.sin(scrollState.progress * Math.PI) * 0.25;
    // Lo scroll veloce "tira" le particelle verso la camera: senso di velocità.
    p.position.z = damp(p.position.z, scrollState.velocity * 6, 3, dt);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posizioni, 3]} />
        <bufferAttribute attach="attributes-color" args={[colori, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Nucleo: la "cosa" al centro. Cromo liquido che si deforma.          */
/* ------------------------------------------------------------------ */
function Nucleo({ alta }: { alta: boolean }) {
  const gruppo = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const guscio = useRef<THREE.Mesh>(null);
  const colore = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const g = gruppo.current;
    if (!g) return;
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;

    // Il nucleo attraversa la pagina: destra, sinistra, centro.
    const targetX = Math.sin(p * Math.PI * 2.2) * 2.1;
    const targetY = -Math.sin(p * Math.PI) * 0.5 + Math.sin(t * 0.5) * 0.12;
    g.position.x = damp(g.position.x, targetX, 2.5, dt);
    g.position.y = damp(g.position.y, targetY, 2.5, dt);

    // Si stringe a metà pagina (dove ci sono i progetti) e torna grande in fondo.
    const s = 1.35 - Math.sin(p * Math.PI) * 0.55;
    g.scale.setScalar(damp(g.scale.x, s, 2.5, dt));

    g.rotation.y += dt * (0.15 + Math.abs(scrollState.velocity) * 0.6);
    g.rotation.z = Math.sin(t * 0.25) * 0.15;

    if (guscio.current) {
      guscio.current.rotation.y -= dt * 0.35;
      guscio.current.rotation.x += dt * 0.12;
    }

    // Viola -> rosa -> ciano lungo la pagina: l'accento del sito, in 3D.
    const k = p * 2;
    colore.copy(VIOLA).lerp(ROSA, Math.min(1, k)).lerp(CIANO, Math.max(0, k - 1));
    if (mat.current) mat.current.color.lerp(colore, 0.05);
  });

  return (
    <group ref={gruppo}>
      <mesh>
        <icosahedronGeometry args={[1, alta ? 64 : 24]} />
        <MeshDistortMaterial
          ref={mat as never}
          color={VIOLA}
          envMapIntensity={1.6}
          metalness={0.92}
          roughness={0.12}
          distort={0.34}
          speed={1.4}
        />
      </mesh>

      {/* Guscio a filo di ferro: dà la forma anche quando il cromo riflette buio. */}
      <mesh ref={guscio} scale={1.42}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={CIANO}
          wireframe
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Schegge in orbita.                                                  */
/* ------------------------------------------------------------------ */
function Schegge({ conta = 26 }: { conta?: number }) {
  const gruppo = useRef<THREE.Group>(null);

  const semi = useMemo(() => {
    const r0 = rnd(42);
    return Array.from({ length: conta }, (_, i) => ({
      raggio: 3 + (i % 5) * 0.85,
      offset: (i / conta) * Math.PI * 2,
      y: (r0() - 0.5) * 3.5,
      scala: 0.05 + r0() * 0.12,
      vel: 0.1 + r0() * 0.22,
    }));
  }, [conta]);

  useFrame((state, dt) => {
    const g = gruppo.current;
    if (!g) return;
    g.rotation.y += dt * 0.06;
    g.rotation.x = -0.25 + scrollState.progress * 0.5;
    const t = state.clock.elapsedTime;
    g.children.forEach((figlio, i) => {
      const s = semi[i];
      if (!s) return;
      const a = s.offset + t * s.vel;
      figlio.position.set(Math.cos(a) * s.raggio, s.y, Math.sin(a) * s.raggio);
      figlio.rotation.x += dt * 0.5;
      figlio.rotation.y += dt * 0.3;
    });
  });

  return (
    <group ref={gruppo}>
      {semi.map((s, i) => (
        <mesh key={i} scale={s.scala}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#cbd5ff"
            metalness={1}
            roughness={0.22}
            envMapIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera: parallasse puntatore + avvicinamento con lo scroll.         */
/* ------------------------------------------------------------------ */
function Regia() {
  useFrame((state, dt) => {
    const { camera, pointer } = state;
    scrollState.pointer.x = damp(scrollState.pointer.x, pointer.x, 3, dt);
    scrollState.pointer.y = damp(scrollState.pointer.y, pointer.y, 3, dt);
    camera.position.x = damp(camera.position.x, scrollState.pointer.x * 0.7, 2, dt);
    camera.position.y = damp(camera.position.y, scrollState.pointer.y * 0.45, 2, dt);
    camera.position.z = damp(
      camera.position.z,
      6.4 - scrollState.progress * 1.3,
      2,
      dt,
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */

export default function Scene({ alta }: { alta: boolean }) {
  return (
    <Canvas
      className="pointer-events-none"
      dpr={alta ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: alta, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
    >
      <Regia />

      <ambientLight intensity={0.35} />
      <pointLight position={[5, 4, 5]} intensity={45} color={VIOLA} distance={22} />
      <pointLight position={[-5, -3, 3]} intensity={35} color={CIANO} distance={22} />

      {/* Ambiente costruito a mano: niente HDR scaricato da una CDN. */}
      <Environment resolution={alta ? 256 : 128}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#a78bfa"
          position={[-4, 2, -4]}
          scale={[8, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#22d3ee"
          position={[4, -2, -3]}
          scale={[8, 8, 1]}
        />
        <Lightformer
          form="circle"
          intensity={4}
          color="#ffffff"
          position={[0, 5, 1]}
          scale={[3, 3, 1]}
        />
      </Environment>

      <Nucleo alta={alta} />
      <Schegge conta={alta ? 26 : 12} />
      <Particelle conta={alta ? 2600 : 900} />

      {alta && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.5}
            kernelSize={KernelSize.LARGE}
            mipmapBlur
          />
          <ChromaticAberration offset={[0.0006, 0.0009]} />
          <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
          <Vignette eskil={false} offset={0.24} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
