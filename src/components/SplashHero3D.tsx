import type { ExpoWebGLRenderingContext } from "expo-gl";
import { GLView } from "expo-gl";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as THREE from "three";
import { AnimatedOrb } from "./AnimatedOrb";

const SIZE = 200;

/**
 * A slowly rotating crystalline gem rendered with three.js directly on an
 * expo-gl surface (no expo-three — we provide three's WebGLRenderer a minimal
 * "canvas" backed by the GL context, which keeps the heavy/fragile
 * @expo/browser-polyfill → expo-2d-context chain out of the bundle).
 *
 * Self-heals: any GL failure (init or per-frame) swaps in the Reanimated
 * <AnimatedOrb /> fallback so the splash never breaks.
 */
function Hero3D() {
	const [failed, setFailed] = useState(false);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	if (failed) return <AnimatedOrb />;

	const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
		try {
			const width = gl.drawingBufferWidth;
			const height = gl.drawingBufferHeight;

			// Minimal canvas shim so three's WebGLRenderer is happy without a DOM.
			const canvas = {
				width,
				height,
				clientWidth: width,
				clientHeight: height,
				style: {},
				addEventListener: () => {},
				removeEventListener: () => {},
				getContext: () => gl,
			};

			const renderer = new THREE.WebGLRenderer({
				canvas: canvas as unknown as HTMLCanvasElement,
				context: gl as unknown as WebGLRenderingContext,
				antialias: true,
				alpha: true,
			});
			renderer.setSize(width, height, false);
			renderer.setClearColor(0xffffff, 0); // transparent — gradient shows through

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
			camera.position.set(0, 0, 4.3);

			scene.add(new THREE.AmbientLight(0xffffff, 0.85));
			const key = new THREE.DirectionalLight(0xffffff, 1.5);
			key.position.set(3, 4, 5);
			scene.add(key);
			const rim = new THREE.PointLight(0x8b5cf6, 2.4, 60);
			rim.position.set(-4, -2, 2);
			scene.add(rim);
			const fill = new THREE.PointLight(0x6366f1, 1.8, 60);
			fill.position.set(4, -3, 3);
			scene.add(fill);

			const geometry = new THREE.IcosahedronGeometry(1.4, 0);
			const material = new THREE.MeshStandardMaterial({
				color: 0x6366f1,
				metalness: 0.5,
				roughness: 0.16,
				flatShading: true,
			});
			const gem = new THREE.Mesh(geometry, material);
			scene.add(gem);

			// Crystalline edge highlight
			const wire = new THREE.LineSegments(
				new THREE.EdgesGeometry(geometry),
				new THREE.LineBasicMaterial({
					color: 0xc7d2fe,
					transparent: true,
					opacity: 0.6,
				}),
			);
			gem.add(wire);

			const animate = () => {
				try {
					rafRef.current = requestAnimationFrame(animate);
					gem.rotation.x += 0.006;
					gem.rotation.y += 0.013;
					renderer.render(scene, camera);
					gl.endFrameEXP();
				} catch (err) {
					if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
					console.warn("3D hero frame failed, falling back:", err);
					setFailed(true);
				}
			};
			animate();
		} catch (err) {
			console.warn("3D hero init failed, falling back:", err);
			setFailed(true);
		}
	};

	return (
		<View style={styles.wrap}>
			<GLView style={styles.gl} onContextCreate={onContextCreate} />
		</View>
	);
}

/** Error boundary so a GLView mount crash degrades gracefully to the orb. */
class Hero3DBoundary extends React.Component<
	{ children: React.ReactNode },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	componentDidCatch(err: unknown) {
		console.warn("3D hero boundary caught:", err);
	}
	render() {
		return this.state.failed ? <AnimatedOrb /> : this.props.children;
	}
}

export function SplashHero() {
	return (
		<Hero3DBoundary>
			<Hero3D />
		</Hero3DBoundary>
	);
}

const styles = StyleSheet.create({
	wrap: {
		width: SIZE,
		height: SIZE,
		alignItems: "center",
		justifyContent: "center",
	},
	gl: { width: SIZE, height: SIZE },
});
