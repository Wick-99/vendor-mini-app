import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { colors, gradients, radius, shadow, spacing, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 18, stiffness: 260 };

interface Props {
	label: string;
	onPress: () => void;
	loading?: boolean;
	disabled?: boolean;
	variant?: "primary" | "secondary";
}

export function PrimaryButton({
	label,
	onPress,
	loading = false,
	disabled = false,
	variant = "primary",
}: Props) {
	const isDisabled = disabled || loading;
	const isSecondary = variant === "secondary";
	const pressed = useSharedValue(0);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 - pressed.value * 0.04 }],
	}));

	const content = (
		<View style={styles.content}>
			{loading && (
				<ActivityIndicator
					size="small"
					color={isSecondary ? colors.primary : colors.onPrimary}
				/>
			)}
			<Text style={[styles.label, isSecondary && styles.secondaryLabel]}>
				{loading ? "Saving…" : label}
			</Text>
		</View>
	);

	return (
		<AnimatedPressable
			onPress={isDisabled ? undefined : onPress}
			onPressIn={() => (pressed.value = withSpring(1, SPRING))}
			onPressOut={() => (pressed.value = withSpring(0, SPRING))}
			disabled={isDisabled}
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled, busy: loading }}
			style={[animStyle, isDisabled && styles.dimmed]}>
			{isSecondary ? (
				<View style={[styles.base, styles.secondary]}>{content}</View>
			) : (
				<View style={[styles.shadowWrap, !isDisabled && shadow.primary]}>
					<LinearGradient
						colors={
							isDisabled
								? [colors.inactive, colors.inactive]
								: gradients.primary
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.base}>
						{content}
					</LinearGradient>
				</View>
			)}
		</AnimatedPressable>
	);
}

const styles = StyleSheet.create({
	base: {
		height: 54,
		borderRadius: radius.lg,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.lg,
		overflow: "hidden",
	},
	shadowWrap: { borderRadius: radius.lg },
	content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
	secondary: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.borderStrong,
	},
	dimmed: { opacity: 0.6 },
	label: { ...typography.bodyStrong, color: colors.onPrimary, letterSpacing: 0.2 },
	secondaryLabel: { color: colors.primary },
});
