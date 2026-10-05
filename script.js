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

    // Scroll reveal animation
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3D viewers sit in collapsed "Watch demo" panels (display: none), so they only
    // intersect the viewport once opened. Defer the heavy STL download until then.
    lazyInit3DViewer('amr-viewer', 'assets/models/AMR300.STL', 'amr-loading');
    lazyInit3DViewer('whitepost-viewer', 'assets/models/WhitePost.STL', 'whitepost-loading');

    // Tap-to-zoom for gallery photos (hover zoom is handled in CSS)
    const zoomImages = document.querySelectorAll('.zoom-img');

    zoomImages.forEach(img => {
        img.addEventListener('click', function () {
            const isActive = this.classList.contains('touch-active');
            zoomImages.forEach(z => z.classList.remove('touch-active'));
            if (!isActive) {
                this.classList.add('touch-active');
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.zoom-img')) {
            zoomImages.forEach(img => img.classList.remove('touch-active'));
        }
    });

    // "Watch demo" buttons expand/collapse the video + 3D media of a card
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card, .timeline-item');
            const open = card.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', String(open));
            btn.querySelector('span').textContent = open ? 'Hide demo' : 'Watch demo';
            btn.querySelector('i').className = open ? 'fas fa-circle-xmark' : 'fas fa-circle-play';
            if (open) {
                requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
            }
        });
    });

    // Hamburger Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

function lazyInit3DViewer(containerId, modelPath, loadingElementId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const start = () => init3DViewer(container, modelPath, loadingElementId, 0xD27D60);
    if (!('IntersectionObserver' in window)) {
        start();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
            observer.disconnect();
            start();
        }
    });
    observer.observe(container);
}

function init3DViewer(container, modelPath, loadingElementId, modelColor = 0xD27D60) {
    if (typeof THREE === 'undefined' || !THREE.STLLoader || !THREE.OrbitControls) {
        const message = document.getElementById(loadingElementId);
        if (message) message.innerText = '3D viewer unavailable.';
        return;
    }

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

    // Load STL Model
    const loader = new THREE.STLLoader();
    const loadingText = document.getElementById(loadingElementId);

    loader.load(
        modelPath,
        function (geometry) {
            if (loadingText) loadingText.style.display = 'none';

            // Center the model
            geometry.center();

            // Create material (Terra Cotta color to match theme: #D27D60)
            const material = new THREE.MeshPhongMaterial({ 
                color: modelColor, 
                specular: 0x111111, 
                shininess: 200 
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
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                loadingText.innerText = `Loading 3D Model... ${percent}%`;
            }
        },
        function (error) {
            console.error('An error happened while loading the STL:', error);
            loadingText.innerText = 'Failed to load model.';
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
