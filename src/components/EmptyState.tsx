import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, gradients, radius, shadow, spacing, typography } from "../theme";
import { PrimaryButton } from "./PrimaryButton";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
	return (
		<View style={styles.container}>
			<Animated.View entering={FadeInDown.duration(500).springify().damping(15)}>
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[styles.iconCircle, shadow.primary]}>
					<Ionicons name="cube-outline" size={44} color={colors.onPrimary} />
				</LinearGradient>
			</Animated.View>

			<Animated.Text
				entering={FadeInDown.delay(120).duration(500)}
				style={styles.title}>
				No products yet
			</Animated.Text>
			<Animated.Text
				entering={FadeInDown.delay(200).duration(500)}
				style={styles.subtitle}>
				Your storefront is empty. Add your first product and it’ll show up
				here, beautifully.
			</Animated.Text>

			<Animated.View
				entering={FadeInDown.delay(300).duration(500)}
				style={styles.action}>
				<PrimaryButton label="Add your first product" onPress={onAdd} />
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.xl,
		gap: spacing.md,
	},
	iconCircle: {
		width: 104,
		height: 104,
		borderRadius: radius.pill,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md,
	},
	title: { ...typography.title, color: colors.text },
	subtitle: {
		...typography.body,
		color: colors.textMuted,
		textAlign: "center",
		maxWidth: 300,
	},
	action: { alignSelf: "stretch", marginTop: spacing.lg },
});
