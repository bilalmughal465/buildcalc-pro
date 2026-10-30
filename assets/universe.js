(function(){
        const canvas = document.createElement('canvas');
        canvas.id = 'universe-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Fill the canvas fully once at the start, so there is no blink/flash
        ctx.fillStyle = '#052e16';
        ctx.fillRect(0, 0, width, height);

        // Interactive mouse state
        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            radius: 150
        };

        // Scroll rotation: cube rotates as the page is scrolled
        let scrollAngle = 0;
        window.addEventListener('scroll', () => {
            scrollAngle = window.scrollY * 0.002;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            ctx.fillStyle = '#052e16';
            ctx.fillRect(0, 0, width, height);
            initStars();
        });

        // --- STARFIELD SYSTEM ---
        const stars = [];
        const starCount = 280; // more stars
        const starColor = '#ffffff'; // white only

        class Star {
            constructor() {
                this.reset();
                this.z = Math.random() * width; // varied depth from the start, no sudden pop
            }

            reset() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = width;
                this.size = Math.random() * 0.8 + 0.3; // smaller stars
                this.color = starColor;
                this.speed = Math.random() * 1 + 0.25; // slow
            }

            update() {
                this.z -= this.speed;
                if (this.z <= 0) {
                    this.reset();
                }

                // Mouse gravitational warping effect
                let dx = (this.x * (width / this.z)) + width / 2 - mouse.x;
                let dy = (this.y * (width / this.z)) + height / 2 - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.z += force * 5; // Push stars back when hovered
                }
            }

            draw() {
                // 3D projection, size capped so incoming stars do not get huge
                const sx = (this.x * (width / this.z)) + width / 2;
                const sy = (this.y * (width / this.z)) + height / 2;
                const size = Math.min(this.size * (width / this.z), 3);

                if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.shadowBlur = 0; // no flickering glow
                    ctx.fill();
                }
            }
        }

        function initStars() {
            stars.length = 0;
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }
        }

        // --- 3D CUBE, LINES ONLY ---
        // Full 8 vertices of a cube
        let vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
        ];

        // Full 12 edges: back face, front face, connecting bars
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        let angleX = 0;
        let angleY = 0;

        function project3D(x, y, z, size, cx, cy) {
            // Apply perspective calculation
            const distance = 4;
            const fov = 500;
            const rotX = x * Math.cos(angleX) - z * Math.sin(angleX);
            const rotZ = x * Math.sin(angleX) + z * Math.cos(angleX);
            
            const rotY = y * Math.cos(angleY) - rotZ * Math.sin(angleY);
            const finalZ = y * Math.sin(angleY) + rotZ * Math.cos(angleY) + distance;

            // size actually scales the cube now
            const base = Math.min(width, height) * 0.18;
            const scale = size / base;

            return {
                // cube centre: main cube slightly to the right, second cube uses its own centre
                x: (rotX * fov) / finalZ * scale + (typeof cx !== 'undefined' ? cx : width / 2 + width * 0.15),
                y: (rotY * fov) / finalZ * scale + (typeof cy !== 'undefined' ? cy : height / 2)
            };
        }

        // --- CORE ANIMATION LOOP ---
        function animate() {
            // Smooth mouse easing
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            // Opaque clear every frame, so there is no blinking / trailing flash
            ctx.fillStyle = '#052e16';
            ctx.fillRect(0, 0, width, height);

            // Very light white glow in the middle, like BuildCalc's background lighting
            // (cube is drawn after the stars, so the cube stays on top of the stars)
            const glow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.5);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            // Draw and update stars
            ctx.shadowBlur = 0;
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            // Rotate cube with mouse position AND scroll
            angleY = (mouse.x - width / 2) * 0.002 + scrollAngle;
            angleX = (mouse.y - height / 2) * 0.002 + scrollAngle * 0.7;

            // Cube centres: right cube a bit more right, left cube a bit more left
            // Same size for both cubes. On mobile, smaller offsets and smaller cubes
            // so they stay behind the content and look good on a small screen.
            let cubeCenterX = width / 2 + width * 0.15;
            const cubeCenterY = height / 2;
            let cube2CenterX = width / 2 - width * 0.35;
            const cube2CenterY = height / 2 + height * 0.12;
            let cubeRadiusMobile = Math.min(width, height) * 0.126;
            if (width < 600) {
                cubeRadiusMobile *= 0.7;
                cubeCenterX = width / 2 + width * 0.08;
                cube2CenterX = width / 2 - width * 0.22;
            }

            // Draw cube as lines only (no fill, no vertex dots)
            // 45% of the previous bigger size: 0.28 * 0.45 = 0.126
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;

            const cubeRadius = cubeRadiusMobile; // 45% size, same for both cubes
            // Corners but inside the page: cubes never go outside the page line,
            // and they stay behind the content (canvas z-index 0, content z-index 1)
            const projHalf = 125 * (cubeRadius / (Math.min(width, height) * 0.18));
            // Half inside / half outside the content area (860px wrap, centred):
            // right cube centred on the right content edge, left cube on the left edge
            const contentLeft = Math.max(0, (width - 860) / 2);
            const contentRight = width - contentLeft;
            cubeCenterX = contentRight;
            cube2CenterX = contentLeft;

            edges.forEach(edge => {
                const p1 = project3D(...vertices[edge[0]], cubeRadius, cubeCenterX, cubeCenterY);
                const p2 = project3D(...vertices[edge[1]], cubeRadius, cubeCenterX, cubeCenterY);

                ctx.canvas.getContext('2d').beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });

            // Second cube on the background, left side, slightly lower, no text
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            edges.forEach(edge => {
                const p1 = project3D(...vertices[edge[0]], cubeRadius, cube2CenterX, cube2CenterY);
                const p2 = project3D(...vertices[edge[1]], cubeRadius, cube2CenterX, cube2CenterY);
                ctx.canvas.getContext('2d').beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });
            requestAnimationFrame(animate);
        }

        // Initialize setup and run
        initStars();
        animate();
    })();