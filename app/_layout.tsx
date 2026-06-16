import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { AppSplashGate } from "../src/components/AppSplashGate";
import { ProductsProvider } from "../src/context/ProductsContext";
import { colors } from "../src/theme";

// Hold the native splash until our animated loading screen is ready to take over.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<ProductsProvider>
				<StatusBar style="dark" />
				<Stack
					screenOptions={{
						headerStyle: { backgroundColor: colors.background },
						headerTintColor: colors.primary,
						headerTitleStyle: {
							fontWeight: "800",
							color: colors.text,
						},
						headerShadowVisible: false,
						contentStyle: { backgroundColor: colors.background },
					}}>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen
						name="add-product"
						options={{ title: "Add Product", presentation: "modal" }}
					/>
					<Stack.Screen name="product/[id]" options={{ title: "Product" }} />
				</Stack>
				<AppSplashGate />
			</ProductsProvider>
		</SafeAreaProvider>
	);
}
