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

const CIRCLE_CONFIG = {
  // Default values for circles
  defaultCircle: {
    scale: 0.8,
    position: { x: 0.8, y: 0, z: 0.3 }
  },
  
  // Default values for subcircles
  subcircles: {
    xButton: { x: -0.25, y: 0.1, z: 0.02 },
    linkButton: { x: -0.25, y: -0.1, z: 0.02 },
    size: 0.05
  },
  
  screenOverrides: {
    //Clock
    0: { 
      position: { x: 0.5, y: 0, z: 0.6 },
      scale: 0.6,
      subcircles: {
        xButton: { x: -0.27, y: 0.06, z: 0.02 },
        linkButton: { x: -0.27, y: -0.06, z: 0.02 }
      }
    },
    //Still Life
    1: { 
      position: { x: 0.4, y: 0, z: 0.2 },
      scale: 0.8,
      subcircles: {
        xButton: { x: 0.25, y: 0.06, z: 0.02 },
        linkButton: { x: 0.25, y: -0.06, z: 0.02 }
      }
    },
    //XL
    2: { 
      position: { x: 0.6, y: 0, z: 0.3 },
      scale: 0.8,
      subcircles: {
        xButton: { x: -0.27, y: 0.06, z: 0.02 },
        linkButton: { x: -0.27, y: -0.06, z: 0.02 }
      }
    },
    //RR
    3: { 
      position: { x: 0.4, y: -0.08, z: 0.6 },
      scale: 0.7,
      subcircles: {
        xButton: { x: -0.27, y: 0.06, z: 0.02 },
        linkButton: { x: -0.27, y: -0.06, z: 0.02 }
      }
    },
    //N
    4: { 
      position: { x: 0.6, y: -0.03, z: 0.3 },
      scale: 0.7,
      subcircles: {
        xButton: { x: -0.27, y: 0.06, z: 0.02 },
        linkButton: { x: -0.27, y: -0.06, z: 0.02 }
      }
    },
    //ice
    5: { 
      position: { x: 0.6, y: 0, z: 0.6 },
      scale: 0.6,
      subcircles: {
        xButton: { x: -0.28, y: 0.06, z: 0.02 },
        linkButton: { x: -0.28, y: -0.06, z: 0.02 }
      }
    },
    //CN
    6: { 
      position: { x: -0.7, y: 0, z: 0.2 },
      scale: 0.6,
      subcircles: {
        xButton: { x: 0.26, y: 0.06, z: 0.02 },  
        linkButton: { x: 0.26, y: -0.06, z: 0.02 }
      }
    },
    //tree
    7: { 
      position: { x: 0.6, y: -.06, z: 0.3 },
      scale: 0.65,
      subcircles: {
        xButton: { x: 0.25, y: 0.06, z: 0.02 },
        linkButton: { x: 0.25, y: -0.06, z: 0.02 }
      }
    },
    //sleep
    8: { 
      position: { x: 0.8, y: -.05, z: 0.3 },
      scale: 0.4,
      subcircles: {
        xButton: { x: 0.25, y: 0.06, z: 0.02 },
        linkButton: { x: 0.25, y: -0.06, z: 0.02 }
      }
    },
    //maze
    9: { 
      position: { x: 0.5, y: -.08, z: 0.2 },
      scale: 0.6,
      subcircles: {
        xButton: { x: -0.26, y: 0.06, z: 0.02 },
        linkButton: { x: -0.26, y: -0.06, z: 0.02 }
      }
    }
  }
};

const screenInfo = [
  { 
    title: "Screen 1 (Clock)", 
    link: "https://editor.p5js.org/ximluo/full/m75E5wBsZ"
  },
  { 
    title: "Screen 2 (Still Life)", 
    link: "https://codepen.io/Ximing-Luo-the-bashful/pen/pvzYewo"
  },
  { 
    title: "Screen 3 (Portfolio)", 
    link: "http://ximingluo.com"
  },
  { 
    title: "Screen 4 (readings)", 
    link: "https://artofthewebxl.github.io/readings/"
  },
  { 
    title: "Screen 5 (Music)", 
    link: "https://artofthewebxl.github.io/s2a2/"
  },
  { 
    title: "Screen 6 (Iceberg)", 
    link: "https://codepen.io/Ximing-Luo-the-bashful/pen/raBqVGB"
  },
  { 
    title: "Screen 7 (Movies)", 
    link: "https://artofthewebxl.github.io/s1a3/"
  },
  { 
    title: "Screen 8 (Trees)", 
    link: "https://editor.p5js.org/ximluo/full/biJeTuvhd"
  },
  { 
    title: "Screen 9 (Sleep)", 
    link: "https://stevein1020.github.io/s3a2/"
  },
  { 
    title: "Screen 10 (maze)", 
    link: "https://artofthewebxl.github.io/s3a1/"
  },
];

function SubCircle({ position, icon, onClick, onPointerOver, onPointerOut }) {
  const size = CIRCLE_CONFIG.subcircles.size;
  
  return (
    <group position={position}>
      <mesh 
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <circleGeometry args={[size, 32]} />
        <meshStandardMaterial 
          color="#000000"
          transparent={true}
          opacity={0}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[size - 0.005, size, 32]} />
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={size * 0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>
    </group>
  );
}

function CircleButton({ position, number, onClick, active, scale = 1, animationOffset = 0 }) {
  const circleRef = useRef()
  const [hovering, setHovering] = useState(false)
  
  const handleLinkClick = (e) => {
    e.stopPropagation();
    window.open(screenInfo[number - 1].link, '_blank');
  };
  
  const handleDeactivateClick = (e) => {
    e.stopPropagation();
    onClick(-1);
  };
  
  // Get subcircle positions for this screen
  const screenIndex = number - 1;
  const screenConfig = CIRCLE_CONFIG.screenOverrides[screenIndex];
  const subcircleConfig = screenConfig?.subcircles || CIRCLE_CONFIG.subcircles;
  
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
          <cylinderGeometry args={[0.1, 0.2, 0.02, 32]} />
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
              emissiveIntensity={hovering ? 0.5 : 1.2}
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
        
        {/* Sub-circles when active */}
        {active && (
          <>
            <SubCircle
              position={[
                subcircleConfig.xButton.x,
                subcircleConfig.xButton.y,
                subcircleConfig.xButton.z
              ]}
              icon="✕"
              onClick={handleDeactivateClick}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            />
            <SubCircle
              position={[
                subcircleConfig.linkButton.x,
                subcircleConfig.linkButton.y,
                subcircleConfig.linkButton.z
              ]}
              icon="↗"
              onClick={handleLinkClick}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            />
          </>
        )}
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
        
        // Get the configuration for this screen - now all screens have overrides
        const screenConfig = CIRCLE_CONFIG.screenOverrides[index];
        const position = screenConfig.position;
        const scale = screenConfig.scale;
        
        // Calculate the final position
        const offsetPosition = [
          center.x + (size.x * position.x),
          center.y + position.y,
          center.z + position.z
        ];
        
        return (
          <CircleButton
            key={index}
            position={offsetPosition}
            number={index + 1}
            active={index === activeScreenIndex}
            scale={scale}
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
  const screenBloomRef = useRef();

  return (
    <div className="app-container">
      <Canvas camera={{ position: [0, 2, 4] }}>
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
    </div>
  )
}