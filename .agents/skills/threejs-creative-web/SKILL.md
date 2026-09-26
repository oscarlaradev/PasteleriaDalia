---
name: threejs-creative-web
description: >-
  Implements immersive 3D canvas experiences, interactive product visualizers, particle systems,
  and custom WebGL shaders using Three.js and React Three Fiber (@react-three/fiber).
  Use when building Awwwards-caliber interactive 3D hero sections, floating product displays,
  or custom shader backgrounds.
---

# Three.js & Creative WebGL Skill

This skill guides the design and implementation of lightweight, performant, and awe-inspiring 3D experiences on the web.

---

## 📦 Tech Stack
- **Three.js Core**: Direct canvas control, lighting, materials, scene graph.
- **React Three Fiber (R3F)**: Declarative React bindings for Three.js.
- **Drei (`@react-three/drei`)**: Helpers for environment maps, OrbitControls, float animations, and GLTF loading.
- **GLSL Shaders**: Custom vertex and fragment shaders for organic water, fluid ripple, or particle noise.

---

## 🚀 Performance Rules for High-End 3D
1. **Model Optimization**: Always compress GLTF/GLB models with Draco or Meshopt (`gltf-pipeline`, `draco`). Target < 2.5 MB total asset size.
2. **Device Pixel Ratio (DPR)**: Clamp DPR to `Math.min(window.devicePixelRatio, 2)` to prevent mobile GPU throttling.
3. **Power Preference**: Set `powerPreference: "high-performance"` on WebGLRenderer.
4. **Disposal**: Unconditionally dispose geometries, materials, and textures on unmount to eliminate memory leaks.

---

## 🛠️ Essential Pattern: React Three Fiber Canvas with Soft Floating
```tsx
import { Canvas } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";

export function Hero3DScene() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        
        <PresentationControls
          global
          snap
          polar={[-0.2, 0.2]}
          azimuth={[-0.4, 0.4]}
        >
          <Suspense fallback={null}>
            <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
              {/* Mesh or loaded GLTF model */}
              <mesh castShadow receiveShadow>
                <torusKnotGeometry args={[1, 0.35, 128, 32]} />
                <meshPhysicalMaterial
                  color="#D97D8D"
                  roughness={0.2}
                  metalness={0.1}
                  clearcoat={0.8}
                  clearcoatRoughness={0.1}
                />
              </mesh>
            </Float>
            <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={10} blur={2} />
            <Environment preset="city" />
          </Suspense>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
```
