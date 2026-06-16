import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { resolveCategory, type ProductCategory } from "../types/category";
import { colors, radius, spacing, typography } from "../theme";

/** Compact, read-only category badge for cards and the detail screen. */
export function CategoryPill({
	category,
	customCategory,
	size = "sm",
}: {
	category: ProductCategory | undefined;
	customCategory?: string;
	size?: "sm" | "md";
}) {
	const { label, icon } = resolveCategory(category, customCategory);
	const isMd = size === "md";
	return (
		<View style={[styles.pill, isMd && styles.pillMd]}>
			<Ionicons name={icon} size={isMd ? 15 : 13} color={colors.primary} />
			<Text style={[styles.text, isMd && styles.textMd]} numberOfLines={1}>
				{label}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	pill: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		gap: spacing.xs,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
		borderRadius: radius.pill,
		backgroundColor: colors.primarySoft,
	},
	pillMd: { paddingVertical: 6, paddingHorizontal: spacing.md },
	text: { ...typography.caption, color: colors.primary },
	textMd: { ...typography.label, color: colors.primary },
});
