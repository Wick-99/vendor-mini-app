import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { STATUS_FILTERS, type StatusFilter } from "../types/filters";
import { colors, radius, spacing, typography } from "../theme";

interface Props {
	status: StatusFilter;
	onStatusChange: (value: StatusFilter) => void;
	counts: Record<StatusFilter, number>;
	sortShort: string;
	onOpenSort: () => void;
}

export function FilterSortBar({
	status,
	onStatusChange,
	counts,
	sortShort,
	onOpenSort,
}: Props) {
	return (
		<View style={styles.row}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.chips}
				style={styles.chipScroll}>
				{STATUS_FILTERS.map(({ value, label }) => {
					const selected = value === status;
					return (
						<Pressable
							key={value}
							onPress={() => onStatusChange(value)}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							style={[styles.chip, selected && styles.chipSelected]}>
							<Text style={[styles.chipText, selected && styles.chipTextSelected]}>
								{label}
							</Text>
							<View style={[styles.countPill, selected && styles.countPillSelected]}>
								<Text
									style={[
										styles.countText,
										selected && styles.countTextSelected,
									]}>
									{counts[value]}
								</Text>
							</View>
						</Pressable>
					);
				})}
			</ScrollView>

			<Pressable
				onPress={onOpenSort}
				accessibilityRole="button"
				accessibilityLabel={`Sort: ${sortShort}`}
				style={({ pressed }) => [styles.sortBtn, pressed && styles.sortBtnPressed]}>
				<Ionicons name="swap-vertical" size={16} color={colors.primary} />
				<Text style={styles.sortText}>{sortShort}</Text>
				<Ionicons name="chevron-down" size={14} color={colors.textMuted} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
	chipScroll: { flex: 1 },
	chips: { gap: spacing.sm, paddingRight: spacing.sm, alignItems: "center" },
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		height: 38,
		paddingHorizontal: spacing.md,
		borderRadius: radius.pill,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	chipSelected: {
		backgroundColor: colors.primarySoft,
		borderColor: colors.primary,
	},
	chipText: { ...typography.label, color: colors.textMuted },
	chipTextSelected: { color: colors.primary },
	countPill: {
		minWidth: 20,
		paddingHorizontal: 6,
		height: 20,
		borderRadius: radius.pill,
		backgroundColor: colors.surfaceSunken,
		alignItems: "center",
		justifyContent: "center",
	},
	countPillSelected: { backgroundColor: colors.primary },
	countText: { ...typography.caption, fontSize: 11, color: colors.textMuted },
	countTextSelected: { color: colors.onPrimary },
	sortBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		height: 38,
		paddingHorizontal: spacing.md,
		borderRadius: radius.pill,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	sortBtnPressed: { backgroundColor: colors.surfaceSunken },
	sortText: { ...typography.label, color: colors.text },
});
