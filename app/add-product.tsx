import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ComponentProps, useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategorySelector } from "../src/components/CategorySelector";
import { FormField } from "../src/components/FormField";
import { ImagePickerField } from "../src/components/ImagePickerField";
import { PrimaryButton } from "../src/components/PrimaryButton";
import { useProducts } from "../src/context/ProductsContext";
import {
	FieldErrors,
	hasErrors,
	toNewProduct,
	validateProduct,
} from "../src/lib/validation";
import { colors, gradients, radius, shadow, spacing, typography } from "../src/theme";
import type { ProductCategory } from "../src/types/category";
import type { ProductStatus } from "../src/types/product";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export default function AddProductScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { addProduct } = useProducts();

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [category, setCategory] = useState<ProductCategory | null>(null);
	const [customCategory, setCustomCategory] = useState("");
	const [status, setStatus] = useState<ProductStatus>("active");

	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const priceRef = useRef<TextInput>(null);
	const descRef = useRef<TextInput>(null);
	const scrollRef = useRef<ScrollView>(null);

	// The KeyboardAvoidingView (behavior="padding") shrinks the form when the
	// keyboard opens, but doesn't scroll the focused input into view. The "Other"
	// custom-category field appears low in the form, so nudge the scroll up when
	// it focuses to lift it above the keyboard. Android only — iOS already does this.
	const handleCustomFocus = () => {
		if (Platform.OS !== "android") return;
		setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
	};

	const errors: FieldErrors = validateProduct({
		name,
		price,
		imageUri,
		category,
		customCategory,
	});
	const visibleErrors: FieldErrors = submitted ? errors : {};

	const handleSubmit = async () => {
		setSubmitted(true);
		if (hasErrors(errors)) return;
		try {
			setIsSubmitting(true);
			await addProduct(
				toNewProduct({
					name,
					price,
					description,
					imageUri: imageUri as string,
					status,
					category: category as ProductCategory,
					customCategory,
				}),
			);
			router.back(); // new product is already at the top of the list
		} catch {
			setIsSubmitting(false); // persist failed — keep the form for retry
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior="padding">
			<ScrollView
				ref={scrollRef}
				style={styles.flex}
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}>
				<Animated.Text entering={FadeInDown.duration(400)} style={styles.lead}>
					Add a product to your storefront. A clear photo and a fair price help
					it sell.
				</Animated.Text>

				<Section icon="image-outline" title="Photo" delay={80}>
					<ImagePickerField
						imageUri={imageUri}
						onChange={setImageUri}
						error={visibleErrors.imageUri}
					/>
				</Section>

				<Section icon="create-outline" title="Basics" delay={160}>
					<FormField
						label="Product name"
						required
						value={name}
						onChangeText={setName}
						placeholder="e.g. Handmade leather wallet"
						error={visibleErrors.name}
						returnKeyType="next"
						onSubmitEditing={() => priceRef.current?.focus()}
						maxLength={80}
					/>
					<FormField
						ref={priceRef}
						label="Price (USD)"
						required
						value={price}
						onChangeText={setPrice}
						placeholder="24.99"
						keyboardType="decimal-pad"
						error={visibleErrors.price}
						returnKeyType="next"
						onSubmitEditing={() => descRef.current?.focus()}
					/>
					<FormField
						ref={descRef}
						label="Short description"
						value={description}
						onChangeText={setDescription}
						placeholder="A sentence or two about the product"
						multiline
						numberOfLines={4}
						style={styles.textArea}
						maxLength={300}
					/>
				</Section>

				<Section icon="options-outline" title="Organize" delay={240}>
					<CategorySelector
						value={category}
						onChange={setCategory}
						error={visibleErrors.category}
					/>

					{category === "other" && (
						<Animated.View entering={FadeIn.duration(220)}>
							<FormField
								label="Custom category"
								required
								value={customCategory}
								onChangeText={setCustomCategory}
								placeholder="e.g. Handmade, Vintage, Seasonal"
								error={visibleErrors.customCategory}
								onFocus={handleCustomFocus}
								autoCapitalize="words"
								maxLength={30}
							/>
						</Animated.View>
					)}

					<View style={styles.statusBlock}>
						<Text style={styles.statusLabel}>Status</Text>
						<View style={styles.segmented}>
							<SegmentButton
								label="Active"
								selected={status === "active"}
								onPress={() => setStatus("active")}
							/>
							<SegmentButton
								label="Inactive"
								selected={status === "inactive"}
								onPress={() => setStatus("inactive")}
							/>
						</View>
					</View>
				</Section>
			</ScrollView>

			{/* Sticky save bar */}
			<View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
				<PrimaryButton
					label="Save product"
					onPress={handleSubmit}
					loading={isSubmitting}
				/>
			</View>
		</KeyboardAvoidingView>
	);
}

function Section({
	icon,
	title,
	delay,
	children,
}: {
	icon: IoniconName;
	title: string;
	delay: number;
	children: React.ReactNode;
}) {
	return (
		<Animated.View
			entering={FadeInDown.delay(delay).duration(450)}
			style={styles.section}>
			<View style={styles.sectionHeader}>
				<View style={styles.sectionIcon}>
					<Ionicons name={icon} size={15} color={colors.primary} />
				</View>
				<Text style={styles.sectionTitle}>{title}</Text>
			</View>
			<View style={styles.sectionBody}>{children}</View>
		</Animated.View>
	);
}

function SegmentButton({
	label,
	selected,
	onPress,
}: {
	label: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityState={{ selected }}
			style={styles.segment}>
			{selected ? (
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.segmentFill}>
					<Text style={[styles.segmentText, styles.segmentTextSelected]}>
						{label}
					</Text>
				</LinearGradient>
			) : (
				<Text style={styles.segmentText}>{label}</Text>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1, backgroundColor: colors.background },
	content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xl },
	lead: { ...typography.body, color: colors.textMuted },
	section: { gap: spacing.md },
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	sectionIcon: {
		width: 28,
		height: 28,
		borderRadius: radius.sm,
		backgroundColor: colors.primarySoft,
		alignItems: "center",
		justifyContent: "center",
	},
	sectionTitle: {
		...typography.caption,
		color: colors.textMuted,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	sectionBody: { gap: spacing.lg },
	textArea: {
		minHeight: 110,
		paddingTop: spacing.md,
		textAlignVertical: "top",
	},
	statusBlock: { gap: spacing.sm },
	statusLabel: { ...typography.label, color: colors.textMuted },
	segmented: {
		flexDirection: "row",
		backgroundColor: colors.surfaceSunken,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.xs,
		gap: spacing.xs,
	},
	segment: {
		flex: 1,
		height: 46,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	segmentFill: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	segmentText: { ...typography.label, color: colors.textMuted },
	segmentTextSelected: { color: colors.onPrimary },
	footer: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		backgroundColor: colors.background,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: colors.border,
		...shadow.lg,
	},
});
