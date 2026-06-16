import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { colors, radius, shadow, spacing, typography } from "../theme";

interface Props {
	value: string;
	onChangeText: (value: string) => void;
	placeholder?: string;
}

export function SearchBar({
	value,
	onChangeText,
	placeholder = "Search products",
}: Props) {
	const focus = useSharedValue(0);

	const animStyle = useAnimatedStyle(() => ({
		borderColor: interpolateColor(
			focus.value,
			[0, 1],
			[colors.border, colors.primary],
		),
	}));

	return (
		<Animated.View style={[styles.container, shadow.sm, animStyle]}>
			<Ionicons name="search" size={20} color={colors.textMuted} />
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={colors.textFaint}
				onFocus={() => (focus.value = withTiming(1, { duration: 160 }))}
				onBlur={() => (focus.value = withTiming(0, { duration: 160 }))}
				returnKeyType="search"
				autoCorrect={false}
				autoCapitalize="none"
				accessibilityLabel="Search products"
			/>
			{value.length > 0 && (
				<Pressable
					onPress={() => onChangeText("")}
					hitSlop={10}
					accessibilityRole="button"
					accessibilityLabel="Clear search">
					<Ionicons name="close-circle" size={20} color={colors.textFaint} />
				</Pressable>
			)}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		height: 52,
		paddingHorizontal: spacing.lg,
		backgroundColor: colors.surface,
		borderWidth: 1.5,
		borderColor: colors.border,
		borderRadius: radius.lg,
	},
	input: {
		flex: 1,
		...typography.body,
		color: colors.text,
		paddingVertical: 0, // keep text vertically centered on Android
	},
});
