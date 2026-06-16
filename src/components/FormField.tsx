import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { colors, radius, spacing, typography } from "../theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props extends TextInputProps {
	label: string;
	error?: string;
	required?: boolean;
}

export const FormField = forwardRef<TextInput, Props>(function FormField(
	{ label, error, required, style, onFocus, onBlur, ...inputProps },
	ref,
) {
	const focus = useSharedValue(0);

	const restColor = error ? colors.danger : colors.border;
	const activeColor = error ? colors.danger : colors.primary;

	const animBorder = useAnimatedStyle(() => ({
		borderColor: interpolateColor(
			focus.value,
			[0, 1],
			[restColor, activeColor],
		),
	}));

	const handleFocus: NonNullable<TextInputProps["onFocus"]> = (e) => {
		focus.value = withTiming(1, { duration: 160 });
		onFocus?.(e);
	};
	const handleBlur: NonNullable<TextInputProps["onBlur"]> = (e) => {
		focus.value = withTiming(0, { duration: 160 });
		onBlur?.(e);
	};

	return (
		<View style={styles.wrapper}>
			<Text style={styles.label}>
				{label}
				{required && <Text style={styles.required}> *</Text>}
			</Text>
			<AnimatedTextInput
				ref={ref}
				style={[styles.input, animBorder, style]}
				placeholderTextColor={colors.textFaint}
				accessibilityLabel={label}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...inputProps}
			/>
			{!!error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
});

const styles = StyleSheet.create({
	wrapper: { gap: spacing.sm },
	label: { ...typography.label, color: colors.textMuted },
	required: { color: colors.danger },
	input: {
		...typography.body,
		color: colors.text,
		backgroundColor: colors.surface,
		borderWidth: 1.5,
		borderColor: colors.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		minHeight: 54,
	},
	error: { ...typography.caption, color: colors.danger },
});
