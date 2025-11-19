// three-hero.js - Three.js background for hero section
class ThreeHeroBackground {
    constructor() {
      this.container = document.getElementById('three-container');
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.mesh = null;
      this.animationFrame = null;
      this.startTime = Date.now();
      
      this.init();
    }
  
    init() {
      try {
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
          console.warn('Three.js not loaded, using fallback background');
          this.useFallback();
          return;
        }
  
        this.setupThreeJS();
        this.setupScene();
        this.setupResizeHandler();
        this.animate();
        
      } catch (error) {
        console.error('Three.js initialization failed:', error);
        this.useFallback();
      }
    }
  
    setupThreeJS() {
      // Create scene
      this.scene = new THREE.Scene();
      
      // Create camera (Orthographic for fullscreen quad)
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      // Create renderer
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0); // Transparent background
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
      
      this.container.appendChild(this.renderer.domElement);
    }
  
    setupScene() {
      // Shader material for the aurora effect
      const material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;

          #define NUM_OCTAVES 3

          float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);

            float res = mix(
              mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
              mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
            return res * res;
          }

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.3;
            vec2 shift = vec2(100);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.4;
            }
            return v;
          }

          void main() {
            vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
            vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
            vec2 v;
            vec4 o = vec4(0.0);

            float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

            for (float i = 0.0; i < 35.0; i++) {
              v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
              float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
              vec4 auroraColors = vec4(
                0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
                0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
                0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
                1.0
              );
              vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
              float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
              o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
            }

            o = tanh(pow(o / 100.0, vec4(1.6)));
            gl_FragColor = o * 1.5;
          }
        `
      });

      // Create fullscreen quad
      const geometry = new THREE.PlaneGeometry(2, 2);
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
    }
  
    setupResizeHandler() {
      const handleResize = () => {
        if (!this.renderer) return;
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.mesh && this.mesh.material.uniforms.iResolution) {
          this.mesh.material.uniforms.iResolution.value.set(
            window.innerWidth, 
            window.innerHeight
          );
        }
      };
  
      window.addEventListener('resize', handleResize);
      this.handleResize = handleResize;
    }
  
    animate() {
      if (!this.renderer || !this.scene || !this.camera) return;
  
      const currentTime = Date.now();
      const elapsedTime = (currentTime - this.startTime) * 0.001; // Convert to seconds
  
      // Update shader time uniform
      if (this.mesh && this.mesh.material.uniforms.iTime) {
        this.mesh.material.uniforms.iTime.value = elapsedTime;
      }
  
      this.renderer.render(this.scene, this.camera);
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  
    useFallback() {
      // Add gradient fallback background with new colors
      this.container.style.background = 'linear-gradient(135deg, #4092ef 0%, #0079d2 100%)';
      this.container.classList.add('hero-gradient-bg');
    }
  
    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      
      if (this.handleResize) {
        window.removeEventListener('resize', this.handleResize);
      }
      
      // Clean up Three.js resources
      if (this.renderer) {
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
      }
      
      if (this.mesh) {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the container exists
    if (document.getElementById('three-container')) {
      new ThreeHeroBackground();
    }
    
  
  /*------------------------------------------            Three Hero Background CTA Section Scripts            ----------------------------------------*/

  // Three.js Dotted Surface Background

  // Initialize dotted surface when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize category list accordion
  new CategoryListAccordion();
  
  // Initialize hero shader background
  new HeroShaderBackground();
  
  // Initialize dotted surface for CTA section
  // Try Three.js first, fallback to CSS if it fails
  try {
    new DottedSurface('dotted-surface');
  } catch (error) {
    console.warn('Three.js dotted surface failed, using CSS fallback:', error);
    new DottedSurfaceFallback('dotted-surface');
  }
});

    // Initialize dotted surface for CTA section
    if (document.getElementById('dotted-surface')) {
        new DottedSurface('dotted-surface');
      }
    });
  
class DottedSurface {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
  
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.particles = null;
      this.animationId = null;
      this.count = 0;
      
      this.SEPARATION = 150;
      this.AMOUNTX = 40;
      this.AMOUNTY = 60;
      
      this.init();
    }
  
    init() {
      // Check if Three.js is available
      if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, using fallback background');
        this.container.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        return;
      }
  
      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x000000, 2000, 10000);
  
      // Camera setup
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.set(0, 355, 1220);
  
      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(this.scene.fog.color, 0);
  
      this.container.appendChild(this.renderer.domElement);
  
      // Create particles
      this.createParticles();
  
      // Start animation
      this.animate();
  
      // Handle window resize
      window.addEventListener('resize', () => this.handleResize());
    }
  
    createParticles() {
      const positions = [];
      const colors = [];
  
      // Create geometry for all particles
      const geometry = new THREE.BufferGeometry();
  
      for (let ix = 0; ix < this.AMOUNTX; ix++) {
        for (let iy = 0; iy < this.AMOUNTY; iy++) {
          const x = ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2;
          const y = 0; // Will be animated
          const z = iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) / 2;
  
          positions.push(x, y, z);
          
          // Use light blue dots for dark background
          colors.push(0.5, 0.7, 0.9); // RGB values for light blue
        }
      }
  
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
      // Create material
      const material = new THREE.PointsMaterial({
        size: 8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });
  
      // Create points object
      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    }
  
    animate() {
      this.animationId = requestAnimationFrame(() => this.animate());
  
      if (this.particles) {
        const geometry = this.particles.geometry;
        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;
  
        let i = 0;
        for (let ix = 0; ix < this.AMOUNTX; ix++) {
          for (let iy = 0; iy < this.AMOUNTY; iy++) {
            const index = i * 3;
  
            // Animate Y position with sine waves
            positions[index + 1] =
              Math.sin((ix + this.count) * 0.3) * 50 +
              Math.sin((iy + this.count) * 0.5) * 50;
  
            i++;
          }
        }
  
        positionAttribute.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
        this.count += 0.1;
      }
    }
  
    handleResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
  
    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
  
      if (this.renderer && this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
  
      // Clean up Three.js objects
      if (this.scene) {
        this.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
  
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }
  
  // Alternative CSS-only fallback for dotted background
  class DottedSurfaceFallback {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
  
      this.createCSSDots();
    }
  
    createCSSDots() {
      // Create a grid of dots using CSS with new colors
      this.container.style.background = `
        radial-gradient(circle at 25% 25%, rgba(64, 146, 239, 0.3) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(0, 121, 210, 0.3) 2px, transparent 2px)
      `;
      this.container.style.backgroundSize = '100px 100px, 150px 150px';
      this.container.style.backgroundPosition = '0 0, 50px 50px';
      this.container.style.animation = 'moveBackground 20s linear infinite';
      
      // Add keyframes for background movement
      if (!document.getElementById('dot-animation')) {
        const style = document.createElement('style');
        style.id = 'dot-animation';
        style.textContent = `
          @keyframes moveBackground {
            0% { background-position: 0 0, 50px 50px; }
            100% { background-position: 100px 100px, 150px 150px; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }