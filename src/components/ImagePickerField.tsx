import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useImagePicker } from "../hooks/useImagePicker";
import { colors, gradients, radius, shadow, spacing, typography } from "../theme";

interface Props {
	imageUri: string | null;
	onChange: (uri: string) => void;
	error?: string;
}

export function ImagePickerField({ imageUri, onChange, error }: Props) {
	const { takePhoto, pickFromGallery, permissionDenied } = useImagePicker();

	const handleTakePhoto = async () => {
		const res = await takePhoto();
		if (res) onChange(res.uri);
	};
	const handlePickGallery = async () => {
		const res = await pickFromGallery();
		if (res) onChange(res.uri);
	};

	return (
		<View style={styles.wrapper}>
			<Text style={styles.label}>
				Product photo<Text style={styles.required}> *</Text>
			</Text>

			{imageUri ? (
				<Pressable onPress={handleTakePhoto} style={styles.previewWrap}>
					<Image
						source={{ uri: imageUri }}
						style={styles.preview}
						contentFit="cover"
					/>
					<View style={styles.previewOverlay}>
						<Ionicons name="refresh" size={16} color="#fff" />
						<Text style={styles.previewOverlayText}>Tap to retake</Text>
					</View>
				</Pressable>
			) : (
				<View style={[styles.placeholder, !!error && styles.placeholderError]}>
					<View style={styles.placeholderIconWrap}>
						<Ionicons name="image-outline" size={28} color={colors.primary} />
					</View>
					<Text style={styles.placeholderText}>No photo added yet</Text>
				</View>
			)}

			<View style={styles.actions}>
				<Pressable
					onPress={handleTakePhoto}
					accessibilityRole="button"
					style={({ pressed }) => [
						styles.shadowWrap,
						!pressed && shadow.primary,
						styles.actionFlex,
					]}>
					<LinearGradient
						colors={gradients.primary}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.primaryAction}>
						<Ionicons name="camera" size={18} color={colors.onPrimary} />
						<Text style={styles.primaryActionText}>Take photo</Text>
					</LinearGradient>
				</Pressable>

				<Pressable
					onPress={handlePickGallery}
					accessibilityRole="button"
					style={({ pressed }) => [
						styles.outlineAction,
						styles.actionFlex,
						pressed && styles.outlinePressed,
					]}>
					<Ionicons name="images-outline" size={18} color={colors.primary} />
					<Text style={styles.outlineActionText}>Gallery</Text>
				</Pressable>
			</View>

			{permissionDenied && (
				<Text style={styles.hint}>
					Permission was denied. You can enable camera/photos access from the
					system prompt or in Settings.
				</Text>
			)}
			{!!error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: { gap: spacing.sm },
	label: { ...typography.label, color: colors.textMuted },
	required: { color: colors.danger },
	previewWrap: {
		borderRadius: radius.xl,
		overflow: "hidden",
		...shadow.md,
	},
	preview: { width: "100%", height: 210, backgroundColor: colors.surfaceAlt },
	previewOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		gap: spacing.xs,
		paddingVertical: spacing.sm,
		backgroundColor: "rgba(14,21,37,0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	previewOverlayText: { ...typography.caption, color: "#fff" },
	placeholder: {
		height: 210,
		borderRadius: radius.xl,
		borderWidth: 1.5,
		borderStyle: "dashed",
		borderColor: colors.borderStrong,
		backgroundColor: colors.tint,
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.sm,
	},
	placeholderError: { borderColor: colors.danger },
	placeholderIconWrap: {
		width: 56,
		height: 56,
		borderRadius: radius.pill,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "center",
		...shadow.sm,
	},
	placeholderText: { ...typography.caption, color: colors.textMuted },
	actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
	actionFlex: { flex: 1 },
	shadowWrap: { borderRadius: radius.lg },
	primaryAction: {
		height: 50,
		borderRadius: radius.lg,
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	primaryActionText: { ...typography.label, color: colors.onPrimary },
	outlineAction: {
		height: 50,
		borderRadius: radius.lg,
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: colors.borderStrong,
		backgroundColor: colors.surface,
	},
	outlinePressed: { backgroundColor: colors.surfaceSunken },
	outlineActionText: { ...typography.label, color: colors.primary },
	hint: { ...typography.caption, color: colors.textMuted },
	error: { ...typography.caption, color: colors.danger },
});
