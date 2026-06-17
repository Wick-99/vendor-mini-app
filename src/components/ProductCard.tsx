import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	FadeInDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { formatPrice } from "../lib/validation";
import { colors, radius, shadow, spacing, typography } from "../theme";
import type { Product } from "../types/product";
import { CategoryPill } from "./CategoryPill";
import { StatusBadge } from "./StatusBadge";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 16, stiffness: 240 };

export function ProductCard({
	product,
	onPress,
	onEdit,
	index = 0,
}: {
	product: Product;
	onPress: () => void;
	onEdit?: () => void;
	index?: number;
}) {
	const pressed = useSharedValue(0);
	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 - pressed.value * 0.03 }],
	}));

	return (
		<Animated.View
			entering={FadeInDown.delay(Math.min(index, 9) * 55)
				.springify()
				.damping(16)}>
			<AnimatedPressable
				onPress={onPress}
				onPressIn={() => (pressed.value = withSpring(1, SPRING))}
				onPressOut={() => (pressed.value = withSpring(0, SPRING))}
				accessibilityRole="button"
				accessibilityLabel={`${product.name}, ${formatPrice(product.price)}, ${product.status}`}
				style={[styles.card, shadow.sm, animStyle]}>
				<Image
					source={{ uri: product.imageUri }}
					style={styles.thumb}
					contentFit="cover"
					transition={150}
				/>
				<View style={styles.body}>
					<Text style={styles.name} numberOfLines={1}>
						{product.name}
					</Text>
					<Text style={styles.price}>{formatPrice(product.price)}</Text>
					<View style={styles.metaRow}>
						<StatusBadge status={product.status} />
						<CategoryPill
							category={product.category}
							customCategory={product.customCategory}
						/>
					</View>
				</View>
				{onEdit && (
					<Pressable
						onPress={onEdit}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel="Edit product"
						style={styles.editButton}>
						<Ionicons name="create-outline" size={18} color={colors.primary} />
					</Pressable>
				)}
				<Ionicons
					name="chevron-forward"
					size={20}
					color={colors.textFaint}
				/>
			</AnimatedPressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.md,
		alignItems: "center",
	},
	thumb: {
		width: 76,
		height: 76,
		borderRadius: radius.lg,
		backgroundColor: colors.surfaceAlt,
	},
	body: { flex: 1, gap: spacing.xs },
	name: { ...typography.bodyStrong, color: colors.text },
	price: { ...typography.price, color: colors.text },
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: spacing.xs,
		marginTop: 2,
	},
	editButton: {
		padding: spacing.xs,
	},
});
