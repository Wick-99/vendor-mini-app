import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import type { ProductStatus } from "../types/product";

export function StatusBadge({ status }: { status: ProductStatus }) {
	const isActive = status === "active";
	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor: isActive
						? colors.activeSurface
						: colors.inactiveSurface,
				},
			]}>
			<View
				style={[
					styles.dot,
					{ backgroundColor: isActive ? colors.active : colors.inactive },
				]}
			/>
			<Text
				style={[
					styles.label,
					{ color: isActive ? colors.active : colors.inactive },
				]}>
				{isActive ? "Active" : "Inactive"}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
		borderRadius: radius.pill,
		gap: spacing.xs,
	},
	dot: { width: 7, height: 7, borderRadius: radius.pill },
	label: { ...typography.caption },
});
