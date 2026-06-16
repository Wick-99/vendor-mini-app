import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { useProducts } from "../context/ProductsContext";
import { AppLoadingScreen } from "./AppLoadingScreen";

/** Keep the premium splash up at least this long so it never just flashes. */
const MIN_DURATION = 2400;

/**
 * Overlays the animated loading screen until products have hydrated AND a
 * minimum brand-display time has passed, then fades itself out. Rendered as
 * the last child of the root layout so it sits above every screen.
 */
export function AppSplashGate() {
	const { isLoading } = useProducts();
	const [minElapsed, setMinElapsed] = useState(false);

	useEffect(() => {
		// Hand off from the native splash to our JS one with no blank frame.
		SplashScreen.hideAsync().catch(() => {});
		const timer = setTimeout(() => setMinElapsed(true), MIN_DURATION);
		return () => clearTimeout(timer);
	}, []);

	if (!isLoading && minElapsed) return null;

	return (
		<Animated.View
			exiting={FadeOut.duration(450)}
			style={[StyleSheet.absoluteFill, styles.z]}>
			<AppLoadingScreen />
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	z: { zIndex: 1000, elevation: 1000 },
});
