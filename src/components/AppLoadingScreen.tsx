import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeInUp,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { colors, gradients, radius, spacing, typography } from "../theme";
import { SplashHero } from "./SplashHero3D";

/** Premium, animated boot screen: 3D hero + brand + a custom loading pulse. */
export function AppLoadingScreen() {
	return (
		<View style={styles.fill}>
			<LinearGradient
				colors={gradients.splash}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={StyleSheet.absoluteFill}
			/>

			<View style={styles.center}>
				<Animated.View entering={FadeIn.duration(600)} style={styles.heroWrap}>
					<SplashHero />
				</Animated.View>

				<Animated.Text
					entering={FadeInUp.delay(260).duration(650)}
					style={styles.brand}>
					Vendor
				</Animated.Text>
				<Animated.Text
					entering={FadeInUp.delay(420).duration(650)}
					style={styles.tagline}>
					Your storefront, beautifully simple
				</Animated.Text>
			</View>

			<Animated.View
				entering={FadeIn.delay(700).duration(700)}
				style={styles.loaderWrap}>
				<LoadingDots />
			</Animated.View>
		</View>
	);
}

function LoadingDots() {
	return (
		<View style={styles.dots}>
			{[0, 1, 2].map((i) => (
				<Dot key={i} index={i} />
			))}
		</View>
	);
}

function Dot({ index }: { index: number }) {
	const v = useSharedValue(0);
	useEffect(() => {
		v.value = withDelay(
			index * 180,
			withRepeat(
				withSequence(
					withTiming(1, { duration: 520, easing: Easing.inOut(Easing.quad) }),
					withTiming(0, { duration: 520, easing: Easing.inOut(Easing.quad) }),
				),
				-1,
				false,
			),
		);
	}, [index, v]);

	const style = useAnimatedStyle(() => ({
		opacity: 0.3 + v.value * 0.7,
		transform: [{ scale: 0.75 + v.value * 0.55 }],
	}));

	return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
	fill: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.background },
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	heroWrap: { marginBottom: spacing.lg },
	brand: {
		...typography.display,
		color: colors.primary,
		letterSpacing: 1,
	},
	tagline: {
		...typography.body,
		color: colors.textMuted,
		marginTop: spacing.xs,
	},
	loaderWrap: {
		position: "absolute",
		bottom: 64,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	dots: { flexDirection: "row", gap: spacing.sm },
	dot: {
		width: 10,
		height: 10,
		borderRadius: radius.pill,
		backgroundColor: colors.primary,
	},
});
