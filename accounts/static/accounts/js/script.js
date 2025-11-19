document.addEventListener('DOMContentLoaded', function() {
    class FullScreenScrollFX {
        constructor() {
          this.sections = [
            { leftLabel: "SEO Optimisation", title: "SEO Optimisation", rightLabel: "SEO Optimisation" },
            { leftLabel: "Social Media", title: "Social Media Marketing", rightLabel: "Social Media" },
            { leftLabel: "Email Marketing", title: "E-Mail Marketing", rightLabel: "Email Marketing" }
          ];
          
          this.total = this.sections.length;
          this.currentIndex = 0;
          this.isAnimating = false;
          
          this.bgImages = document.querySelectorAll('.fx-bg-img');
          this.leftItems = document.querySelectorAll('.fx-left-item');
          this.rightItems = document.querySelectorAll('.fx-right-item');
          this.featuredTitles = document.querySelectorAll('.fx-featured');
          this.progressFill = document.querySelector('.fx-progress-fill');
          this.progressNumbers = document.querySelector('.fx-progress-numbers span:first-child');
          
          this.leftTrack = document.querySelector('.fx-left .fx-track');
          this.rightTrack = document.querySelector('.fx-right .fx-track');
          this.fxSection = document.querySelector('.fx');
          
          this.init();
        }
        
        init() {
          // Set initial states
          gsap.set(this.bgImages, { opacity: 0, scale: 1.04 });
          gsap.set(this.bgImages[0], { opacity: 1, scale: 1 });
          
          // Set initial background
          this.updateBackgroundColor(0);
          
          // Set up click handlers
          this.leftItems.forEach((item, index) => {
            item.addEventListener('click', () => this.goTo(index));
          });
          
          this.rightItems.forEach((item, index) => {
            item.addEventListener('click', () => this.goTo(index));
          });
          
          // Initialize ScrollTrigger
          this.setupScrollTrigger();
          
          // Initial animation
          this.animateEntrance();
        }
        
        setupScrollTrigger() {
          // Disabled scroll-based changes - only click to change
        }
        
        changeSection(toIndex) {
          if (toIndex === this.currentIndex || this.isAnimating) return;
          this.isAnimating = true;
          
          const fromIndex = this.currentIndex;
          const direction = toIndex > fromIndex ? 1 : -1;
          
          // Update current index
          this.currentIndex = toIndex;
          
          // Update background color
          this.updateBackgroundColor(toIndex);
          
          // Update progress numbers
          if (this.progressNumbers) {
            this.progressNumbers.textContent = String(toIndex + 1).padStart(2, '0');
          }
          
          // Update progress bar
          if (this.progressFill) {
            const progressPercent = (toIndex / (this.total - 1)) * 100;
            this.progressFill.style.width = `${progressPercent}%`;
          }
          
          // Animate backgrounds
          const prevBg = this.bgImages[fromIndex];
          const newBg = this.bgImages[toIndex];
          
          if (newBg) {
            gsap.set(newBg, { opacity: 0, scale: 1.04 });
            gsap.to(newBg, { 
              opacity: 1, 
              scale: 1, 
              duration: 0.7, 
              ease: "power2.out" 
            });
          }
          
          if (prevBg) {
            gsap.to(prevBg, { 
              opacity: 0, 
              duration: 0.7, 
              ease: "power2.out" 
            });
          }
          
          // Update list items
          this.leftItems.forEach((item, index) => {
            item.classList.toggle('active', index === toIndex);
            gsap.to(item, {
              opacity: index === toIndex ? 1 : 0.35,
              x: index === toIndex ? 10 : 0,
              duration: 0.6,
              ease: "power3.out"
            });
          });
          
          this.rightItems.forEach((item, index) => {
            item.classList.toggle('active', index === toIndex);
            gsap.to(item, {
              opacity: index === toIndex ? 1 : 0.35,
              x: index === toIndex ? -10 : 0,
              duration: 0.6,
              ease: "power3.out"
            });
          });
          
          // Update featured titles
          this.featuredTitles.forEach((title, index) => {
            title.classList.toggle('active', index === toIndex);
          });
          
          // Center lists
          this.centerLists(toIndex);
          
          // Reset animation flag
          setTimeout(() => {
            this.isAnimating = false;
          }, 700);
        }
        
        updateBackgroundColor(index) {
          if (this.fxSection) {
            this.fxSection.setAttribute('data-active-section', index);
          }
        }
        
        centerLists(toIndex) {
          const rowHeight = 60; // Approximate row height in pixels
          const targetY = -(toIndex * rowHeight);
          
          gsap.to(this.leftTrack, {
            y: targetY,
            duration: 0.7,
            ease: "power3.out"
          });
          
          gsap.to(this.rightTrack, {
            y: targetY,
            duration: 0.7,
            ease: "power3.out"
          });
        }
        
        goTo(index) {
          const clampedIndex = Math.max(0, Math.min(index, this.total - 1));
          this.changeSection(clampedIndex);
          // Don't scroll - keep section sticky
        }
        
        animateEntrance() {
          // Animate list items on load
          gsap.fromTo(this.leftItems, 
            { opacity: 0, y: 20 },
            { 
              opacity: (i) => i === 0 ? 1 : 0.35, 
              y: 0, 
              duration: 0.5, 
              stagger: 0.06, 
              ease: "power3.out" 
            }
          );
          
          gsap.fromTo(this.rightItems, 
            { opacity: 0, y: 20 },
            { 
              opacity: (i) => i === 0 ? 1 : 0.35, 
              y: 0, 
              duration: 0.5, 
              stagger: 0.06, 
              delay: 0.2,
              ease: "power3.out" 
            }
          );
          
          // Animate glass cards on load
          gsap.fromTo('.glass-card', 
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              delay: 0.4,
              ease: "power3.out" 
            }
          );
        }
      }    
    // Initialize the effect
    new FullScreenScrollFX();
  });

  /*------------------------------------------            Category List Scripts            ----------------------------------------*/

 // Category List Accordion functionality
class CategoryListAccordion {
    constructor() {
      this.categoryItems = document.querySelectorAll('.category-item');
      this.activeItem = null;
      this.init();
    }
  
    init() {
      this.categoryItems.forEach(item => {
        // Mouse enter event (keep hover effects)
        item.addEventListener('mouseenter', (e) => {
          this.handleMouseEnter(e);
        });
  
        // Mouse leave event
        item.addEventListener('mouseleave', (e) => {
          this.handleMouseLeave(e);
        });
  
        // Click event for accordion
        item.addEventListener('click', (e) => {
          this.handleClick(e);
        });
      });
    }
  
    handleMouseEnter(e) {
      const item = e.currentTarget;
      const itemId = item.dataset.id;
      
      // Hover effects are handled by CSS
      console.log(`Hovered category: ${itemId}`);
    }
  
    handleMouseLeave(e) {
      const item = e.currentTarget;
      const itemId = item.dataset.id;
      
      // Only remove hover effects if not active
      if (!item.classList.contains('active')) {
        // Hover cleanup handled by CSS
      }
    }
  
    handleClick(e) {
      const item = e.currentTarget;
      const itemId = item.dataset.id;
      
      // Close currently active item if clicking a different one
      if (this.activeItem && this.activeItem !== item) {
        this.closeItem(this.activeItem);
      }
      
      // Toggle current item
      if (item.classList.contains('active')) {
        this.closeItem(item);
        this.activeItem = null;
      } else {
        this.openItem(item);
        this.activeItem = item;
      }
      
      console.log(`Clicked category: ${itemId}`);
    }
  
    openItem(item) {
      item.classList.add('active');
    }
  
    closeItem(item) {
      item.classList.remove('active');
    }
  
    // Optional: Close all items
    closeAll() {
      this.categoryItems.forEach(item => {
        this.closeItem(item);
      });
      this.activeItem = null;
    }
  }
  
  // Initialize category accordion when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    new CategoryListAccordion();
  });

  /*------------------------------------------            Hero Section Scroll Effect            ----------------------------------------*/
  // WebGL Shader Background for Hero Section
class HeroShaderBackground {
    constructor() {
      this.canvas = document.getElementById('hero-canvas');
      this.gl = null;
      this.program = null;
      this.animationFrame = null;
      this.pointers = new Map();
      this.lastCoords = [0, 0];
      this.moves = [0, 0];
      this.scale = 1;
      
      this.init();
    }
  
    init() {
      this.setupWebGL();
      this.setupEventListeners();
      this.resize();
      this.render();
    }
  
    setupWebGL() {
      this.gl = this.canvas.getContext('webgl2');
      if (!this.gl) {
        console.warn('WebGL2 not supported, falling back to gradient background');
        this.canvas.style.background = 'linear-gradient(135deg, #4092ef 0%, #0079d2 100%)';
        return;
      }
  
      // Vertex shader source
      const vertexShaderSource = `#version 300 es
        precision highp float;
        in vec4 position;
        void main() {
          gl_Position = position;
        }
      `;
  
      // Fragment shader source (with moving starfield)
      const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 fragColor;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 mouse;
        uniform int pointerCount;
        
        #define PI 3.14159265359
  
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
  
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
  
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(p);
            p = rot * p * 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        float starMask(vec2 uv, float density, float speed, float size) {
          vec2 st = uv * density;
          st.x += time * speed;
          vec2 cell = floor(st);
          vec2 gv = fract(st) - 0.5;
          float rnd = hash(cell);
          float presence = step(0.985, rnd); // sparse stars
          float star = presence * smoothstep(size, 0.0, length(gv));
          // twinkle
          float twinkle = sin(time * 4.0 + rnd * 12.0) * 0.5 + 0.5;
          return star * mix(0.6, 1.0, twinkle);
        }
  
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.x, resolution.y);
          vec2 mouseUV = mouse / resolution;
          
          // Animate with time
          float t = time * 0.5;
          uv += 0.1 * sin(t * 0.5 + uv.y * 3.0);
          
          // Create wave patterns
          float pattern = fbm(uv * 3.0 + t * 0.1);
          pattern += 0.5 * fbm(uv * 6.0 - t * 0.2);
          
          // Mouse interaction
          float mouseDist = length(uv - mouseUV);
          pattern += 0.3 * exp(-mouseDist * 4.0) * sin(t * 2.0 + mouseDist * 10.0);

          // Moving starfield layers (left -> right)
          float starsFar = starMask(uv + vec2(0.0, t * 0.01), 18.0, 0.08, 0.18);
          float starsMid = starMask(uv, 30.0, 0.15, 0.14);
          float starsNear = starMask(uv * 1.5, 45.0, 0.22, 0.1);
          float stars = starsFar * 0.4 + starsMid * 0.7 + starsNear * 0.9;
          
          // Color palette matching new theme (#4092ef to #0079d2)
          vec3 color1 = vec3(0.25, 0.57, 0.94);  // #4092ef
          vec3 color2 = vec3(0.0, 0.48, 0.82);   // #0079d2
          vec3 color3 = vec3(0.0, 0.21, 0.51);   // #003683
          
          // Create gradient with pattern
          float gradient = uv.y * 0.5 + 0.5;
          vec3 baseColor = mix(color1, color2, gradient);
          
          // Add pattern to base color
          vec3 finalColor = mix(baseColor, color3, pattern * 0.3);
          
          // Add some sparkle
          float sparkle = hash(uv * 100.0 + t);
          if (sparkle > 0.99) {
            finalColor += vec3(0.8, 0.9, 1.0) * (sparkle - 0.99) * 10.0;
          }

          // Blend in starfield glow
          finalColor += vec3(0.9, 0.95, 1.0) * stars;
          
          fragColor = vec4(finalColor, 1.0);
        }
      `;
  
      // Compile shaders
      const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      if (!vertexShader || !fragmentShader) return;
  
      // Create program
      this.program = this.gl.createProgram();
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.gl.linkProgram(this.program);
  
      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error('Program linking failed:', this.gl.getProgramInfoLog(this.program));
        return;
      }
  
      // Set up geometry
      const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
      const buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
  
      const positionLocation = this.gl.getAttribLocation(this.program, 'position');
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  
      // Get uniform locations
      this.resolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
      this.timeLocation = this.gl.getUniformLocation(this.program, 'time');
      this.mouseLocation = this.gl.getUniformLocation(this.program, 'mouse');
      this.pointerCountLocation = this.gl.getUniformLocation(this.program, 'pointerCount');
    }
  
    compileShader(type, source) {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
  
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        return null;
      }
  
      return shader;
    }
  
    setupEventListeners() {
      window.addEventListener('resize', () => this.resize());
      
      // Mouse move for interactive effects
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.lastCoords = [
          (e.clientX - rect.left) * this.scale,
          (rect.height - (e.clientY - rect.top)) * this.scale
        ];
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
  
      // Touch events for mobile
      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          this.lastCoords = [
            (e.touches[0].clientX - rect.left) * this.scale,
            (rect.height - (e.touches[0].clientY - rect.top)) * this.scale
          ];
        }
      }, { passive: false });
    }
  
    resize() {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      this.scale = dpr;
      
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
    }
  
    render(time = 0) {
      if (!this.gl || !this.program) {
        // Fallback to CSS gradient if WebGL fails
        this.canvas.style.background = 'linear-gradient(135deg, #4092ef 0%, #0079d2 100%)';
        return;
      }
  
      this.gl.useProgram(this.program);
      
      // Set uniforms
      this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
      this.gl.uniform1f(this.timeLocation, time * 0.001);
      this.gl.uniform2f(this.mouseLocation, this.lastCoords[0], this.lastCoords[1]);
      this.gl.uniform1i(this.pointerCountLocation, this.pointers.size);
      
      // Render
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      
      // Reset mouse movement
      this.moves = [0, 0];
      
      this.animationFrame = requestAnimationFrame((t) => this.render(t));
    }
  
    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }
  
  // Initialize hero shader when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    new HeroShaderBackground();
  });