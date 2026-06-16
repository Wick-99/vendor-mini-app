import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CATEGORIES, categoryMeta, type ProductCategory } from "../types/category";
import { colors, gradients, radius, shadow, spacing, typography } from "../theme";

export type CategoryFilter = ProductCategory | "all";

interface Props {
	value: CategoryFilter;
	onChange: (value: CategoryFilter) => void;
}

/** Premium horizontally-scrollable category filter (icon pills, "All" first). */
export function CategoryFilterBar({ value, onChange }: Props) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.row}>
			<CategoryChip
				label="All"
				icon="grid"
				selected={value === "all"}
				onPress={() => onChange("all")}
			/>
			{CATEGORIES.map((cat) => (
				<CategoryChip
					key={cat.value}
					label={cat.label}
					icon={cat.icon}
					selected={value === cat.value}
					onPress={() => onChange(cat.value)}
				/>
			))}
		</ScrollView>
	);
}

function CategoryChip({
	label,
	icon,
	selected,
	onPress,
}: {
	label: string;
	icon: ReturnType<typeof categoryMeta>["icon"];
	selected: boolean;
	onPress: () => void;
}) {
	const inner = (
		<>
			<View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
				<Ionicons
					name={icon}
					size={16}
					color={selected ? colors.onPrimary : colors.primary}
				/>
			</View>
			<Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
		</>
	);

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityState={{ selected }}
			style={({ pressed }) => [pressed && !selected && styles.pressed]}>
			{selected ? (
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[styles.pill, shadow.primary]}>
					{inner}
				</LinearGradient>
			) : (
				<View style={[styles.pill, styles.pillIdle]}>{inner}</View>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	row: { gap: spacing.sm, alignItems: "center", paddingRight: spacing.sm },
	pill: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		height: 46,
		paddingLeft: spacing.xs,
		paddingRight: spacing.md,
		borderRadius: radius.pill,
	},
	pillIdle: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
	pressed: { opacity: 0.7 },
	iconCircle: {
		width: 36,
		height: 36,
		borderRadius: radius.pill,
		backgroundColor: colors.primarySoft,
		alignItems: "center",
		justifyContent: "center",
	},
	iconCircleSelected: { backgroundColor: "rgba(255,255,255,0.25)" },
	label: { ...typography.label, color: colors.textMuted },
	labelSelected: { color: colors.onPrimary },
});
