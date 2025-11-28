
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  disableCenterDimming?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

/**
 * Full-screen nebula shader background.
 * Props drive GLSL uniforms.
 * Colors maintained as Icycon Blue/Cyan palette for both modes.
 * Supports transparency to overlay on white background in light mode.
 */
export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
  isDarkMode = true,
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Sync props into uniforms
  useEffect(() => {
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer with alpha enabled for transparency
    // OPTIMIZATION: powerPreference: "high-performance" hints the browser to use dGPU if available
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    
    // OPTIMIZATION: Cap pixel ratio to 2 to prevent massive GPU load on 4k/Retina screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock  = new THREE.Clock();

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Ray-marched nebula fragment shader
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4);
        p.xy *= m(t*0.3);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        uv.x += .4;
        vec3 col = vec3(0.0);
        float d = 2.5;

        // Ray-march
        // OPTIMIZATION: Reduced iterations from 5 to 4 for better performance with minimal visual loss
        for (int i = 0; i <= 4; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = vec3(0.0);

          // Always use the "Dark Mode" Icycon Blue/Cyan Palette
          base = hasActiveReminders
            ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
            : hasUpcomingReminders
            ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
            // Default Icycon Blue Theme
            : vec3(0.0, 0.1, 0.3) + vec3(0.3, 0.6, 1.2)*f;

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        // Calculate alpha based on brightness to allow background to show through black areas
        float brightness = max(col.r, max(col.g, col.b));
        float alpha = smoothstep(0.0, 0.5, brightness);

        // Center dimming
        float dist   = distance(fragCoord, iResolution*0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming
                     ? 1.0
                     : smoothstep(radius*0.3, radius*0.5, dist);

        O = vec4(col, alpha);
        if (!disableCenterDimming) {
           O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `;

    // Uniforms
    const uniforms = {
      iTime:                { value: 0 },
      iResolution:          { value: new THREE.Vector2() },
      iMouse:               { value: new THREE.Vector2() },
      hasActiveReminders:   { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
    };

    const material = new THREE.ShaderMaterial({ 
      vertexShader, 
      fragmentShader, 
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Resize & mouse
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };
    
    // Initial size
    onResize();
    
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);
    window.addEventListener("mousemove", onMouseMove);

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 transition-opacity duration-500 will-change-[opacity] ${className}`}
      aria-label="Interactive nebula background"
    />
  );
}
