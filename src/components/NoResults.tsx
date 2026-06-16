import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors, radius, spacing, typography } from "../theme";

export function NoResults({ onClear }: { onClear: () => void }) {
	return (
		<Animated.View entering={FadeIn.duration(300)} style={styles.container}>
			<View style={styles.iconWrap}>
				<Ionicons name="search-outline" size={34} color={colors.primary} />
			</View>
			<Text style={styles.title}>No matches found</Text>
			<Text style={styles.subtitle}>
				Nothing matches your search and filters. Try a different term or clear
				them to see everything.
			</Text>
			<Pressable
				onPress={onClear}
				accessibilityRole="button"
				style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}>
				<Ionicons name="refresh" size={16} color={colors.primary} />
				<Text style={styles.clearText}>Clear filters</Text>
			</Pressable>
		</Animated.View>
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
	iconWrap: {
		width: 80,
		height: 80,
		borderRadius: radius.pill,
		backgroundColor: colors.primarySoft,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.xs,
	},
	title: { ...typography.heading, color: colors.text },
	subtitle: {
		...typography.body,
		color: colors.textMuted,
		textAlign: "center",
		maxWidth: 300,
	},
	clearBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.sm,
		height: 46,
		paddingHorizontal: spacing.xl,
		borderRadius: radius.pill,
		borderWidth: 1.5,
		borderColor: colors.primary,
		backgroundColor: colors.primarySoft,
	},
	clearBtnPressed: { backgroundColor: colors.surfaceSunken },
	clearText: { ...typography.label, color: colors.primary },
});
