import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { colors, gradients } from "../theme";

const SIZE = 150;
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Pure-Reanimated fallback for the 3D hero — a rotating, breathing gradient
 * orb with a soft glow. Used if expo-gl/three isn't available on the device.
 */
export function AnimatedOrb() {
	const spin = useSharedValue(0);
	const pulse = useSharedValue(0);

	useEffect(() => {
		spin.value = withRepeat(
			withTiming(1, { duration: 7000, easing: Easing.linear }),
			-1,
			false,
		);
		pulse.value = withRepeat(
			withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
			-1,
			true,
		);
	}, [spin, pulse]);

	const orbStyle = useAnimatedStyle(() => ({
		transform: [
			{ rotate: `${spin.value * 360}deg` },
			{ scale: 1 + pulse.value * 0.06 },
		],
	}));

	const glowStyle = useAnimatedStyle(() => ({
		opacity: 0.35 + pulse.value * 0.4,
		transform: [{ scale: 1.15 + pulse.value * 0.15 }],
	}));

	return (
		<View style={styles.wrap}>
			<Animated.View style={[styles.glow, glowStyle]} />
			<Animated.View style={[styles.orb, orbStyle]}>
				<AnimatedGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>
				<View style={styles.highlight} />
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		width: 200,
		height: 200,
		alignItems: "center",
		justifyContent: "center",
	},
	glow: {
		position: "absolute",
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		backgroundColor: colors.violet,
	},
	orb: {
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		overflow: "hidden",
	},
	highlight: {
		position: "absolute",
		top: SIZE * 0.16,
		left: SIZE * 0.18,
		width: SIZE * 0.32,
		height: SIZE * 0.32,
		borderRadius: SIZE,
		backgroundColor: "rgba(255,255,255,0.45)",
	},
});
