document.addEventListener("DOMContentLoaded", () => {
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

    // Initialize 3D Model Viewer if container exists
    const viewerContainer = document.getElementById('amr-viewer');
    if (viewerContainer) {
        init3DViewer(viewerContainer, 'assets/models/AMR300.STL', 'amr-loading', 0xD27D60);
    }

    const whitepostViewerContainer = document.getElementById('whitepost-viewer');
    if (whitepostViewerContainer) {
        init3DViewer(whitepostViewerContainer, 'assets/models/WhitePost.STL', 'whitepost-loading', 0xEEEEEE);
    }
});

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
