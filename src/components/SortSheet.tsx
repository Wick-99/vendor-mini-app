import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
	LayoutChangeEvent,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SORT_OPTIONS, type SortOption } from "../types/filters";
import { colors, radius, shadow, spacing, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Start well below the screen; the exact resting offset is set from the
// measured sheet height after first layout.
const HIDDEN_OFFSET = 600;
const OPEN_DURATION = 300;
const CLOSE_DURATION = 240;

interface Props {
	visible: boolean;
	value: SortOption;
	onChange: (value: SortOption) => void;
	onClose: () => void;
}

/**
 * Bottom-sheet sort picker. Animation is fully controlled (no Modal fade): the
 * sheet slides straight up on open and straight down on close — a single smooth
 * translate, no bounce, no cross-fade. It can also be dragged down to dismiss.
 */
export function SortSheet({ visible, value, onChange, onClose }: Props) {
	const insets = useSafeAreaInsets();
	const [mounted, setMounted] = useState(visible);
	const translateY = useSharedValue(HIDDEN_OFFSET);
	const backdrop = useSharedValue(0);
	const sheetH = useSharedValue(HIDDEN_OFFSET); // for the drag worklet
	const sheetHeight = useRef(HIDDEN_OFFSET); // for the JS close animation

	useEffect(() => {
		if (visible) {
			setMounted(true);
			backdrop.value = withTiming(1, { duration: OPEN_DURATION });
			translateY.value = withTiming(0, {
				duration: OPEN_DURATION,
				easing: Easing.out(Easing.cubic),
			});
		} else {
			backdrop.value = withTiming(0, { duration: CLOSE_DURATION });
			translateY.value = withTiming(
				sheetHeight.current,
				{ duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) },
				(finished) => {
					if (finished) runOnJS(setMounted)(false);
				},
			);
		}
	}, [visible, backdrop, translateY]);

	// Drag the sheet down to dismiss; release short of the threshold springs back.
	const pan = Gesture.Pan()
		.activeOffsetY(10)
		.onUpdate((e) => {
			translateY.value = Math.max(0, e.translationY);
		})
		.onEnd((e) => {
			const shouldClose = e.translationY > sheetH.value * 0.3 || e.velocityY > 800;
			if (shouldClose) {
				runOnJS(onClose)();
			} else {
				translateY.value = withTiming(0, {
					duration: 200,
					easing: Easing.out(Easing.cubic),
				});
			}
		});

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));
	const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

	const onLayout = (e: LayoutChangeEvent) => {
		const h = e.nativeEvent.layout.height;
		sheetHeight.current = h;
		sheetH.value = h;
	};

	if (!mounted) return null;

	return (
		<Modal
			visible
			transparent
			animationType="none"
			statusBarTranslucent
			onRequestClose={onClose}>
			<GestureHandlerRootView style={styles.fill}>
				<AnimatedPressable
					style={[styles.backdrop, backdropStyle]}
					onPress={onClose}
					accessibilityRole="button"
					accessibilityLabel="Close sort options"
				/>
				<GestureDetector gesture={pan}>
					<Animated.View
						onLayout={onLayout}
						style={[
							styles.sheet,
							{ paddingBottom: insets.bottom + spacing.lg },
							sheetStyle,
						]}>
						<View style={styles.handle} />
						<Text style={styles.title}>Sort by</Text>

						{SORT_OPTIONS.map((opt) => {
							const selected = opt.value === value;
							return (
								<Pressable
									key={opt.value}
									onPress={() => onChange(opt.value)}
									accessibilityRole="button"
									accessibilityState={{ selected }}
									style={({ pressed }) => [
										styles.option,
										pressed && styles.optionPressed,
									]}>
									<View
										style={[styles.optionIcon, selected && styles.optionIconActive]}>
										<Ionicons
											name={opt.icon}
											size={18}
											color={selected ? colors.onPrimary : colors.primary}
										/>
									</View>
									<Text
										style={[styles.optionLabel, selected && styles.optionLabelActive]}>
										{opt.label}
									</Text>
									{selected && (
										<Ionicons name="checkmark" size={22} color={colors.primary} />
									)}
								</Pressable>
							);
						})}
					</Animated.View>
				</GestureDetector>
			</GestureHandlerRootView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	fill: { flex: 1 },
	backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
	sheet: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: colors.background,
		borderTopLeftRadius: radius.xxl,
		borderTopRightRadius: radius.xxl,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
		gap: spacing.xs,
		...shadow.lg,
	},
	handle: {
		alignSelf: "center",
		width: 44,
		height: 5,
		borderRadius: radius.pill,
		backgroundColor: colors.borderStrong,
		marginBottom: spacing.md,
	},
	title: { ...typography.heading, color: colors.text, marginBottom: spacing.sm },
	option: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: radius.md,
		paddingHorizontal: spacing.sm,
	},
	optionPressed: { backgroundColor: colors.surfaceSunken },
	optionIcon: {
		width: 40,
		height: 40,
		borderRadius: radius.md,
		backgroundColor: colors.primarySoft,
		alignItems: "center",
		justifyContent: "center",
	},
	optionIconActive: { backgroundColor: colors.primary },
	optionLabel: { ...typography.bodyStrong, color: colors.text, flex: 1 },
	optionLabelActive: { color: colors.primary },
});
