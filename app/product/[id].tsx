import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryPill } from "../../src/components/CategoryPill";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { StatusBadge } from "../../src/components/StatusBadge";
import { useProducts } from "../../src/context/ProductsContext";
import { formatPrice } from "../../src/lib/validation";
import { colors, gradients, radius, shadow, spacing, typography } from "../../src/theme";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { getProductById } = useProducts();

	const product = id ? getProductById(id) : undefined;

	if (!product) {
		return (
			<View style={styles.missing}>
				<Stack.Screen options={{ title: "Not found" }} />
				<View style={styles.missingIcon}>
					<Ionicons name="alert-circle-outline" size={40} color={colors.primary} />
				</View>
				<Text style={styles.missingTitle}>Product not found</Text>
				<Text style={styles.missingBody}>
					This product may have been removed or never existed.
				</Text>
				<View style={styles.missingAction}>
					<PrimaryButton
						label="Back to products"
						onPress={() => router.back()}
					/>
				</View>
			</View>
		);
	}

	return (
		<>
			<Stack.Screen options={{ title: product.name }} />
			<ScrollView
				style={styles.flex}
				contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
				showsVerticalScrollIndicator={false}>
				<Animated.View entering={FadeIn.duration(350)} style={styles.imageFrame}>
					<Image
						source={{ uri: product.imageUri }}
						style={styles.image}
						contentFit="cover"
						transition={250}
					/>
					<LinearGradient
						colors={gradients.imageScrim}
						style={styles.scrim}
					/>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.delay(120).duration(450)}
					style={styles.body}>
					<View style={styles.headerRow}>
						<Text style={styles.name}>{product.name}</Text>
						<StatusBadge status={product.status} />
					</View>

					<CategoryPill
						category={product.category}
						customCategory={product.customCategory}
						size="md"
					/>

					<View style={styles.priceCard}>
						<Text style={styles.priceLabel}>Price</Text>
						<Text style={styles.price}>{formatPrice(product.price)}</Text>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionLabel}>Description</Text>
						<Text style={styles.description}>
							{product.description?.trim()
								? product.description
								: "No description provided."}
						</Text>
					</View>
				</Animated.View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1, backgroundColor: colors.background },
	imageFrame: {
		width: "100%",
		aspectRatio: 4 / 3,
		backgroundColor: colors.surfaceAlt,
	},
	image: { width: "100%", height: "100%" },
	scrim: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: "45%",
	},
	body: {
		padding: spacing.lg,
		gap: spacing.lg,
		marginTop: -spacing.xl,
		borderTopLeftRadius: radius.xxl,
		borderTopRightRadius: radius.xxl,
		backgroundColor: colors.background,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.md,
	},
	name: { ...typography.title, color: colors.text, flex: 1 },
	priceCard: {
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.lg,
		gap: spacing.xs,
		...shadow.sm,
	},
	priceLabel: { ...typography.label, color: colors.textMuted },
	price: { ...typography.display, color: colors.primary },
	section: { gap: spacing.sm },
	sectionLabel: { ...typography.label, color: colors.textMuted },
	description: { ...typography.body, color: colors.text },
	missing: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: "center",
		justifyContent: "center",
		padding: spacing.xl,
		gap: spacing.md,
	},
	missingIcon: {
		width: 80,
		height: 80,
		borderRadius: radius.pill,
		backgroundColor: colors.primarySoft,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.sm,
	},
	missingTitle: { ...typography.heading, color: colors.text },
	missingBody: {
		...typography.body,
		color: colors.textMuted,
		textAlign: "center",
	},
	missingAction: { alignSelf: "stretch", marginTop: spacing.lg },
});
