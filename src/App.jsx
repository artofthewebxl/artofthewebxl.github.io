import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Noise,
  SelectiveBloom,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import './App.css'

const screenInfo = [
  { 
    title: "Screen 1", 
    content: "This is information about screen 1. It contains details about this specific feature.",
    link: "https://example.com/screen1"
  },
  { 
    title: "Screen 2", 
    content: "Screen 2 represents another important feature of this device. Here you can learn about its specifications.",
    link: "https://example.com/screen2"
  },
  { 
    title: "Screen 3", 
    content: "Screen 3 shows the history and evolution of this technology over time.",
    link: "https://example.com/screen3"
  },
  { 
    title: "Screen 4", 
    content: "Screen 4 contains technical specifications and compatibility information.",
    link: "https://example.com/screen4"
  },
  { 
    title: "Screen 5", 
    content: "Screen 5 has information about connectivity options available on this device.",
    link: "https://example.com/screen5"
  },
  { 
    title: "Screen 6", 
    content: "Screen 6 explains the user interface and accessibility features.",
    link: "https://example.com/screen6"
  },
  { 
    title: "Screen 7", 
    content: "Screen 7 shows the available updates and software features.",
    link: "https://example.com/screen7"
  },
  { 
    title: "Screen 8", 
    content: "Screen 8 presents additional accessories and compatible devices.",
    link: "https://example.com/screen8"
  },
  { 
    title: "Screen 9", 
    content: "Screen 9 contains warranty information and support options.",
    link: "https://example.com/screen9"
  },
  { 
    title: "Screen 10", 
    content: "Screen 10 includes troubleshooting tips and common solutions.",
    link: "https://example.com/screen10"
  },
];

function InfoPanel({ activeScreenIndex, closePanel, isMobile }) {
  if (activeScreenIndex < 0) return null;
  
  const info = screenInfo[activeScreenIndex];
  
  return (
    <div className="info-panel">
      <div className="info-content">
        <h2>{info.title}</h2>
        <p>{info.content}</p>
        {/* Link that opens in a new tab instead of close button */}
        <a 
          href={info.link} 
          className="info-link" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

function CircleButton({ position, number, onClick, active, scale = 1, animationOffset = 0 }) {
  const circleRef = useRef()
  const [hovering, setHovering] = useState(false)
  
  useFrame((state) => {
    if (circleRef.current) {
      const time = state.clock.getElapsedTime() + animationOffset
      
      switch (number) {
        case 1:
          circleRef.current.position.y = Math.sin(time * 0.8) * 0.03
          circleRef.current.rotation.z = Math.sin(time * 0.5) * 0.05
          break
        case 2:
          circleRef.current.position.x = Math.sin(time * 0.7) * 0.02
          circleRef.current.rotation.x = Math.sin(time * 0.6) * 0.04
          break
        case 3:
          circleRef.current.position.x = Math.sin(time * 0.5) * 0.02
          circleRef.current.position.y = Math.cos(time * 0.5) * 0.02
          circleRef.current.rotation.y = Math.sin(time * 0.4) * 0.06
          break
        case 4:
          circleRef.current.position.x = Math.sin(time * 0.6) * 0.025
          circleRef.current.position.y = Math.sin(time * 1.2) * 0.015
          circleRef.current.rotation.z = Math.cos(time * 0.7) * 0.04
          break
        case 5:
          circleRef.current.position.y = Math.abs(Math.sin(time * 0.9)) * 0.03
          circleRef.current.rotation.x = Math.sin(time * 0.8) * 0.05
          break
        case 6:
          circleRef.current.rotation.x = Math.sin(time * 0.7) * 0.06
          circleRef.current.rotation.z = Math.cos(time * 0.4) * 0.03
          circleRef.current.position.z = Math.sin(time * 0.5) * 0.01
          break
        case 7:
          circleRef.current.rotation.y = Math.sin(time * 0.5) * 0.07
          circleRef.current.position.x = Math.sin(time * 0.3) * 0.01
          break
        case 8:
          circleRef.current.position.x = Math.sin(time * 0.4) * 0.02
          circleRef.current.position.y = Math.cos(time * 0.5) * 0.02
          circleRef.current.rotation.z = time * 0.05 % (Math.PI * 2)
          break
        case 9:
          const pulse = 1 + Math.sin(time * 0.6) * 0.03
          circleRef.current.scale.x = scale * pulse
          circleRef.current.scale.y = scale * pulse
          circleRef.current.rotation.y = Math.sin(time * 0.4) * 0.05
          break
        case 10:
          circleRef.current.rotation.z = Math.sin(time * 0.4) * 0.08
          circleRef.current.position.x = Math.sin(time * 0.6) * 0.015
          break
        default:
          circleRef.current.position.y = Math.sin(time * 0.6) * 0.02
          circleRef.current.rotation.z = Math.sin(time * 0.4) * 0.03
      }
    }
  })
  
  return (
    <group position={position}>
      <group ref={circleRef} scale={scale}>
        <mesh 
          onClick={() => onClick(number - 1)}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
            setHovering(true)
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
            setHovering(false)
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
          <meshStandardMaterial 
            color={active ? "#ff00ff" : "#000000"}
            emissive={active ? "#ff00ff" : "#000000"}
            emissiveIntensity={hovering ? 1.2 : (active ? 1 : 0)}
            transparent={!active}
            opacity={active ? 1 : 0.9}
          />
        </mesh>
        
        {!active && (
          <mesh
            rotation={[0, 0, 0]}
          >
            <ringGeometry args={[0.18, 0.2, 32]} />
            <meshStandardMaterial 
              color="#ff00ff" 
              emissive="#ff00ff"
              emissiveIntensity={hovering ? 1.2 : 0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
        </Text>
      </group>
    </group>
  )
}

function TVModel({ modelRef, setScreenMeshes }) {
  const { scene } = useGLTF('/tv/scene.gltf')
  
  useEffect(() => {
    if (scene) {
      const textureMeshes = []
      scene.traverse((child) => {
        if (child.isMesh &&
         (child.name.toLowerCase().includes('screen') ||
          child.name.toLowerCase().includes('sreen') ||
          (child.material && child.material.map &&
           child.material.map.name &&
           child.material.map.name.includes('emissive')))) {
          if (!child.userData.originalEmissive && child.material) {
            child.material = child.material.clone();
            if (!child.material.emissive) {
              child.material.emissive = new THREE.Color(1, 1, 1);
              child.material.emissiveIntensity = 0.5;
            }
            child.userData.originalEmissive = child.material.emissive.clone();
            child.userData.originalEmissiveIntensity =
              child.material.emissiveIntensity || 0.5;
          }
          textureMeshes.push(child);
        }
      });
      
      if (textureMeshes.length > 0) {
        setScreenMeshes(textureMeshes);
      }
    }
  }, [scene, setScreenMeshes]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={15}
      position={[1.55, 0.1, 0]}
    />
  )
}

function ScreenEffects({ screenMeshes, activeScreenIndex }) {
  const pulseSpeed = 6;
  const pulseMin = 0.5;
  const pulseMax = 0.65;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pulseFactor = (Math.sin(time * pulseSpeed) + 1) / 2;
    const intensity = pulseMin + pulseFactor * (pulseMax - pulseMin);
    
    screenMeshes.forEach((mesh, index) => {
      if (mesh.material) {
        const boost = index === activeScreenIndex ? 1.5 : 1.0;
        mesh.material.emissiveIntensity =
          mesh.userData.originalEmissiveIntensity * intensity * boost;
        mesh.material.emissive.set(
          mesh.userData.originalEmissive.r * intensity * boost,
          mesh.userData.originalEmissive.g * intensity * boost,
          mesh.userData.originalEmissive.b * intensity * boost
        );
      }
    });
  });
  
  return null;
}

function CameraController({ screenMeshes, activeScreenIndex, inDetailView }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const timeoutRef = useRef(null);
  const originalCameraPosition = useRef(new THREE.Vector3(0, 2, 4));
  const originalTargetPosition = useRef(new THREE.Vector3(0.5, 1.8, 0));
  const isAnimatingRef = useRef(false);
  
  // Store initial camera position on first render
  useEffect(() => {
    originalCameraPosition.current.copy(camera.position);
    if (controlsRef.current) {
      originalTargetPosition.current.copy(controlsRef.current.target);
    }
  }, []);

  // Handle camera movement when activeScreenIndex changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    isAnimatingRef.current = true;
    
    if (activeScreenIndex >= 0 && screenMeshes.length > activeScreenIndex && inDetailView) {
      // Move to selected screen with closer view for detail view
      const targetMesh = screenMeshes[activeScreenIndex];
      const boundingBox = new THREE.Box3().setFromObject(targetMesh);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      
      const meshSize = new THREE.Vector3();
      boundingBox.getSize(meshSize);
      
      // Even closer offset for selected view in detail mode
      const offset = new THREE.Vector3(0, 0, 1.0);
      const targetPosition = center.clone().add(offset);
      
      const duration = 1000; // ms
      const startTime = Date.now();
      const startPosition = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease in-out quad
        
        camera.position.lerpVectors(startPosition, targetPosition, easeT);
        controlsRef.current.target.lerpVectors(startTarget, center, easeT);
        
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
        }
      };
      
      animate();
    } else if (activeScreenIndex >= 0 && screenMeshes.length > activeScreenIndex) {
      // Move to selected screen
      const targetMesh = screenMeshes[activeScreenIndex];
      const boundingBox = new THREE.Box3().setFromObject(targetMesh);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      
      const meshSize = new THREE.Vector3();
      boundingBox.getSize(meshSize);
      
      const offset = new THREE.Vector3(0, 0, 1.5);
      const targetPosition = center.clone().add(offset);
      
      const duration = 1000; // ms
      const startTime = Date.now();
      const startPosition = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease in-out quad
        
        camera.position.lerpVectors(startPosition, targetPosition, easeT);
        controlsRef.current.target.lerpVectors(startTarget, center, easeT);
        
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
        }
      };
      
      animate();
    } else {
      // Return to original view when deselecting
      const duration = 1000; // ms
      const startTime = Date.now();
      const startPosition = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease in-out quad
        
        camera.position.lerpVectors(startPosition, originalCameraPosition.current, easeT);
        controlsRef.current.target.lerpVectors(startTarget, originalTargetPosition.current, easeT);
        
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
        }
      };
      
      animate();
    }
  }, [activeScreenIndex, screenMeshes, camera, inDetailView]);
  
  return <OrbitControls ref={controlsRef} target={[0.5, 1.8, 0]} enabled={!inDetailView} />;
}

function ScreenButtons({ screenMeshes, activeScreenIndex, setActiveScreenIndex, setInDetailView }) {
  return (
    <>
      {screenMeshes.map((mesh, index) => {
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        let offsetPosition;
        let circleScale = 1;

        if (index === 0) {
          offsetPosition = [
            center.x + (size.x * 0.8),
            center.y,
            center.z + 0.5
          ];
        } else if (index === 3) {
          offsetPosition = [
            center.x + (size.x * 0.6),
            center.y + 0.08,
            center.z + 0.6
          ];
        } else if (index === 5) {
          offsetPosition = [
            center.x + (size.x * 0.8),
            center.y + 0.08,
            center.z + 0.6
          ];
        } else if (index === 1) {
          offsetPosition = [
            center.x + (size.x * 0.5),
            center.y,
            center.z + 0.2
          ];
        } 
        else if (index === 8) {
          offsetPosition = [
            center.x + (size.x * 0.8),
            center.y,
            center.z + 0.3
          ];
          circleScale = 0.7;
        } else if (index === 9) {
          offsetPosition = [
            center.x + (size.x * 0.6),
            center.y,
            center.z + 0.2
          ];
        } else if (index === 6) {
          offsetPosition = [
            center.x + (size.x * -0.85),
            center.y,
            center.z + 0.2
          ];
        } else {
          offsetPosition = [
            center.x + (size.x * 0.8),
            center.y,
            center.z + 0.3
          ];
        }
        
        return (
          <CircleButton
            key={index}
            position={offsetPosition}
            number={index + 1}
            active={index === activeScreenIndex}
            scale={circleScale}
            animationOffset={index * 0.5}
            onClick={(clickedIndex) => {
              if (clickedIndex === activeScreenIndex) {
                setActiveScreenIndex(-1);
                setInDetailView(false);
              } else {
                setActiveScreenIndex(clickedIndex);
                setInDetailView(true);
              }
            }}
          />
        );
      })}
    </>
  );
}

export default function App() {
  const modelRef = useRef();
  const dirLightRef = useRef();
  const [screenMeshes, setScreenMeshes] = useState([]);
  const [activeScreenIndex, setActiveScreenIndex] = useState(-1);
  const [inDetailView, setInDetailView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const screenBloomRef = useRef();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const closePanel = () => {
    setActiveScreenIndex(-1);
    setInDetailView(false);
  };

  const canvasClassName = inDetailView 
    ? (isMobile ? 'r3f-canvas hidden' : 'r3f-canvas split-view') 
    : 'r3f-canvas';

  return (
    <div className="app-container">
      <Canvas className={canvasClassName} camera={{ position: [0, 2, 4] }}>
        <color attach="background" args={['#101010']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          ref={dirLightRef}
          color="magenta"
          position={[-5, 2, 20]}
          intensity={0.7}
        />
        
        <Suspense fallback={null}>
          <TVModel
            modelRef={modelRef}
            setScreenMeshes={setScreenMeshes}
          />
        </Suspense>
        
        {screenMeshes.length > 0 && (
          <>
            <ScreenEffects 
              screenMeshes={screenMeshes} 
              activeScreenIndex={activeScreenIndex} 
            />
            <ScreenButtons 
              screenMeshes={screenMeshes}
              activeScreenIndex={activeScreenIndex}
              setActiveScreenIndex={setActiveScreenIndex}
              setInDetailView={setInDetailView}
            />
            <CameraController
              screenMeshes={screenMeshes}
              activeScreenIndex={activeScreenIndex}
              inDetailView={inDetailView}
            />
          </>
        )}
        
        <EffectComposer autoClear={false}>
          <Bloom
            mipmapBlur
            intensity={0.4}
            luminanceThreshold={0}
            luminanceSmoothing={0.5}
          />
          {screenMeshes.length > 0 && (
            <SelectiveBloom
              ref={screenBloomRef}
              lights={[]}
              selection={screenMeshes}
              intensity={0.9}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.15}
              kernelSize={KernelSize.LARGE}
              mipmapBlur={true}
            />
          )}
          <Noise blendFunction={BlendFunction.HARD_LIGHT} opacity={0.03} />
        </EffectComposer>
      </Canvas>
      
      <InfoPanel 
        activeScreenIndex={activeScreenIndex} 
        closePanel={closePanel}
        isMobile={isMobile}
      />
    </div>
  )
}