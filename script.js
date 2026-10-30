document.addEventListener("DOMContentLoaded", () => {
    // ========== Dark / Light Mode Toggle ==========
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check for saved preference, or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    }

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Add rotation animation
            themeToggle.classList.add('rotating');
            setTimeout(() => themeToggle.classList.remove('rotating'), 500);

            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            if (newTheme === 'light') {
                html.removeAttribute('data-theme');
            } else {
                html.setAttribute('data-theme', 'dark');
            }

            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.setAttribute('data-theme', 'dark');
                updateIcon('dark');
            } else {
                html.removeAttribute('data-theme');
                updateIcon('light');
            }
        }
    });

    // Scroll reveal animation (smooth scrolling for nav links is handled by CSS scroll-behavior)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // 3D Model Viewers: three.js and the model are only downloaded once the viewer
    // becomes visible (its card is hovered/tapped open), not on page load
    const viewers = [
        { id: 'amr-viewer', model: 'assets/models/AMR300.glb', loading: 'amr-loading' },
        { id: 'whitepost-viewer', model: 'assets/models/WhitePost.glb', loading: 'whitepost-loading' }
    ];

    const viewerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const viewer = viewers.find(v => v.id === entry.target.id);
            loadThree()
                .then(() => init3DViewer(entry.target, viewer.model, viewer.loading, 0xD27D60))
                .catch(error => {
                    console.error('Failed to load three.js:', error);
                    const loadingText = document.getElementById(viewer.loading);
                    if (loadingText) loadingText.innerText = 'Failed to load model.';
                });
        });
    });

    viewers.forEach(v => {
        const container = document.getElementById(v.id);
        if (container) viewerObserver.observe(container);
    });

    // Mobile Touch Support for Hover Elements
    const cardElements = document.querySelectorAll('.project-card, .timeline-item');
    const zoomImages = document.querySelectorAll('.zoom-img');
    
    // Handle zoom images separately (they live inside timeline-items)
    zoomImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent bubbling to parent timeline-item
            const isActive = this.classList.contains('touch-active');
            // Remove active from all zoom images
            zoomImages.forEach(z => z.classList.remove('touch-active'));
            if (!isActive) {
                this.classList.add('touch-active');
            }
        });
    });

    // Cards that hide videos/3D models until opened are also reachable by keyboard
    const expandableCards = [...cardElements].filter(el => el.querySelector('.hover-media, .intern-media'));
    expandableCards.forEach(el => el.setAttribute('tabindex', '0'));

    function setCardActive(card) {
        const isActive = card.classList.contains('touch-active');

        // Remove active class from all card/timeline elements
        cardElements.forEach(sibling => sibling.classList.remove('touch-active'));

        // Toggle: if was active, stay collapsed; if not, expand
        if (!isActive) {
            card.classList.add('touch-active');
        }
    }

    // Handle cards and timeline items
    cardElements.forEach(el => {
        el.addEventListener('click', function(e) {
            // Ignore if clicking a link, video, or zoom image
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'a' || tag === 'iframe' || e.target.closest('a, .zoom-img')) return;
            setCardActive(this);
        });
    });

    expandableCards.forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.target !== this || (e.key !== 'Enter' && e.key !== ' ')) return;
            e.preventDefault();
            setCardActive(this);
        });
    });

    // Remove active class when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card, .timeline-item, .zoom-img')) {
            cardElements.forEach(el => el.classList.remove('touch-active'));
            zoomImages.forEach(img => img.classList.remove('touch-active'));
        }
    });

    // Hamburger Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        const setMenuOpen = (open) => {
            navLinks.classList.toggle('active', open);
            mobileMenu.setAttribute('aria-expanded', String(open));
            mobileMenu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        };

        mobileMenu.addEventListener('click', () => {
            setMenuOpen(!navLinks.classList.contains('active'));
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
    }
});

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

// Load three.js once, then its add-ons (they need the global THREE to exist first)
let threePromise = null;
function loadThree() {
    if (!threePromise) {
        const examples = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
        threePromise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
            .then(() => Promise.all([
                loadScript(examples + 'controls/OrbitControls.js'),
                loadScript(examples + 'loaders/GLTFLoader.js'),
                loadScript(examples + 'loaders/DRACOLoader.js')
            ]));
        threePromise.catch(() => { threePromise = null; });
    }
    return threePromise;
}

let dracoLoader = null;

function init3DViewer(container, modelPath, loadingElementId, modelColor = 0xD27D60) {
    const scene = new THREE.Scene();
    
    // Camera setup
    const initialWidth = container.clientWidth || 300;
    const initialHeight = container.clientHeight || 200;
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 1000);
    camera.position.set(0, 150, 300); // Adjust based on model scale

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 50);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-100, -200, -50);
    scene.add(backLight);

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Handle Container Resize (Crucial for display:none to block transitions)
    const resizeObserver = new ResizeObserver(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
    resizeObserver.observe(container);

    // Load Draco-compressed GLB Model (converted from the original STL)
    // One DRACOLoader is shared so the decoder is only downloaded once
    if (!dracoLoader) {
        dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('assets/vendor/draco/');
        dracoLoader.setDecoderConfig({ type: 'wasm' });
    }
    const loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const loadingText = document.getElementById(loadingElementId);

    loader.load(
        modelPath,
        function (gltf) {
            if (loadingText) loadingText.style.display = 'none';

            let geometry;
            gltf.scene.traverse(obj => {
                if (obj.isMesh && !geometry) geometry = obj.geometry;
            });

            // Center the model
            geometry.center();

            // Create material (Terra Cotta color to match theme: #D27D60)
            // flatShading: the model has no normals, same faceted look as the STL
            const material = new THREE.MeshPhongMaterial({
                color: modelColor,
                specular: 0x111111,
                shininess: 200,
                flatShading: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Adjust rotation if needed (STL models often come in rotated 90 deg around X)
            mesh.rotation.x = -Math.PI / 2;
            
            // Auto scale the model to fit view
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 150 / maxDim; // Target size
            mesh.scale.set(scale, scale, scale);

            scene.add(mesh);
        },
        function (xhr) {
            if (xhr.lengthComputable && loadingText) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                loadingText.innerText = `Loading 3D Model... ${percent}%`;
            }
        },
        function (error) {
            console.error('An error happened while loading the model:', error);
            if (loadingText) loadingText.innerText = 'Failed to load model.';
        }
    );

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        // Optimize: Only render if container is visible
        if (container.offsetParent !== null) {
            controls.update();
            renderer.render(scene, camera);
        }
    }
    animate();
}
