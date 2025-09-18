'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

// Memoized DottedSurface component to prevent unnecessary re-renders
export const DottedSurface = memo(({ className, ...props }: DottedSurfaceProps) => {
	const { theme } = useTheme();
	const [webGLError, setWebGLError] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
		geometry: THREE.BufferGeometry;
	} | null>(null);

	useEffect(() => {
		// Trigger fade-in animation after component mounts
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// Effect to update particle colors when theme changes
	useEffect(() => {
		if (!sceneRef.current || webGLError) return;

		const { geometry } = sceneRef.current;
		const colorAttribute = geometry.getAttribute('color');
		const colors = colorAttribute.array as Float32Array;

		// Update colors based on current theme
		for (let i = 0; i < colors.length; i += 3) {
			if (theme === 'dark') {
				// Light gray/white dots for dark theme
				colors[i] = 240 / 255;     // R
				colors[i + 1] = 240 / 255; // G
				colors[i + 2] = 240 / 255; // B
			} else {
				// Dark gray dots for light theme
				colors[i] = 40 / 255;      // R
				colors[i + 1] = 40 / 255;  // G
				colors[i + 2] = 40 / 255;  // B
			}
		}

		colorAttribute.needsUpdate = true;
	}, [theme, webGLError]);

	useEffect(() => {
		if (!containerRef.current || webGLError) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
			});
			
			// Check if the renderer was created successfully
			if (!renderer) {
				throw new Error('Failed to create WebGL renderer');
			}
		} catch (e) {
			console.warn('WebGL not supported, falling back to canvas:', e);
			setWebGLError(true);
			return;
		}

		try {
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setClearColor(scene.fog.color, 0);

			containerRef.current.appendChild(renderer.domElement);
		} catch (e) {
			console.warn('WebGL context error, falling back to canvas:', e);
			setWebGLError(true);
			
			// Clean up renderer if it was created but context failed
			if (renderer) {
				try {
					renderer.dispose();
				} catch (disposeError) {
					console.warn('Error disposing renderer:', disposeError);
				}
			}
			
			return;
		}

		// Create particles
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				// Initial color values (normalized to 0-1 range)
				if (theme === 'dark') {
					// Light gray/white dots for dark theme
					colors.push(240 / 255, 240 / 255, 240 / 255);
				} else {
					// Dark gray dots for light theme
					colors.push(40 / 255, 40 / 255, 40 / 255);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
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
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;

		// Animation function with optimized rendering
		const animate = () => {
			if (!sceneRef.current) return;
			
			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves (slower animation)
					positions[index + 1] =
						Math.sin((ix + count) * 0.15) * 50 +
						Math.sin((iy + count) * 0.25) * 50;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			try {
				renderer.render(scene, camera);
			} catch (e) {
				console.warn('WebGL render error, falling back to canvas:', e);
				setWebGLError(true);
				return;
			}
			
			count += 0.05; // Slower increment for smoother animation
			
			// Store the animation ID for cleanup
			if (sceneRef.current) {
				sceneRef.current.animationId = requestAnimationFrame(animate);
			}
		};

		// Handle window resize with debounce
		let resizeTimeout: NodeJS.Timeout;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}, 100); // Debounce resize events
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		const initialAnimationId = requestAnimationFrame(animate);

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId: initialAnimationId,
			count,
			geometry,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(resizeTimeout);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [theme, webGLError]);

	// Fallback UI when WebGL is not available
	if (webGLError) {
		return (
			<div
				ref={containerRef}
				className={cn('pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-background to-muted transition-opacity duration-1000', 
					isVisible ? 'opacity-100' : 'opacity-0', 
					className)}
				{...props}
			/>
		);
	}

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 -z-10 transition-opacity duration-1000', 
				isVisible ? 'opacity-100' : 'opacity-0', 
				className)}
			{...props}
		/>
	);
});

DottedSurface.displayName = 'DottedSurface';