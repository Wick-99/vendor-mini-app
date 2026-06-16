import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";

type PickResult = { uri: string } | null;

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
	mediaTypes: ["images"],
	allowsEditing: true,
	aspect: [4, 3],
	quality: 0.7, // compress a little — full-res photos are huge
};

export function useImagePicker() {
	const [permissionDenied, setPermissionDenied] = useState(false);

	const promptOpenSettings = useCallback(
		(kind: "Camera" | "Photo library") => {
			Alert.alert(
				`${kind} access needed`,
				`Enable ${kind.toLowerCase()} access in Settings to add a product photo.`,
				[
					{ text: "Not now", style: "cancel" },
					{ text: "Open Settings", onPress: () => Linking.openSettings() },
				],
			);
		},
		[],
	);

	const takePhoto = useCallback(async (): Promise<PickResult> => {
		const perm = await ImagePicker.requestCameraPermissionsAsync();
		if (!perm.granted) {
			setPermissionDenied(true);
			if (!perm.canAskAgain) promptOpenSettings("Camera");
			return null;
		}
		setPermissionDenied(false);
		const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
		if (result.canceled) return null;
		return { uri: result.assets[0].uri };
	}, [promptOpenSettings]);

	const pickFromGallery = useCallback(async (): Promise<PickResult> => {
		const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!perm.granted) {
			setPermissionDenied(true);
			if (!perm.canAskAgain) promptOpenSettings("Photo library");
			return null;
		}
		setPermissionDenied(false);
		const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
		if (result.canceled) return null;
		return { uri: result.assets[0].uri };
	}, [promptOpenSettings]);

	return { takePhoto, pickFromGallery, permissionDenied };
}
