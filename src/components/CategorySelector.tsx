import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORIES, type ProductCategory } from "../types/category";
import { colors, radius, spacing, typography } from "../theme";

interface Props {
	value: ProductCategory | null;
	onChange: (value: ProductCategory) => void;
	error?: string;
}

/** Wrapping grid of category chips for the Add Product form. */
export function CategorySelector({ value, onChange, error }: Props) {
	return (
		<View style={styles.wrapper}>
			<Text style={styles.label}>
				Category<Text style={styles.required}> *</Text>
			</Text>

			<View style={styles.grid}>
				{CATEGORIES.map(({ value: cat, label, icon }) => {
					const selected = cat === value;
					return (
						<Pressable
							key={cat}
							onPress={() => onChange(cat)}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							style={[styles.chip, selected && styles.chipSelected]}>
							<Ionicons
								name={icon}
								size={16}
								color={selected ? colors.onPrimary : colors.primary}
							/>
							<Text style={[styles.chipText, selected && styles.chipTextSelected]}>
								{label}
							</Text>
						</Pressable>
					);
				})}
			</View>

			{!!error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: { gap: spacing.sm },
	label: { ...typography.label, color: colors.textMuted },
	required: { color: colors.danger },
	grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		height: 40,
		paddingHorizontal: spacing.md,
		borderRadius: radius.pill,
		borderWidth: 1.5,
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	chipSelected: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	chipText: { ...typography.label, color: colors.text },
	chipTextSelected: { color: colors.onPrimary },
	error: { ...typography.caption, color: colors.danger },
});
