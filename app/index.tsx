import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeInDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryFilterBar } from "../src/components/CategoryFilterBar";
import { EmptyState } from "../src/components/EmptyState";
import { FilterSortBar } from "../src/components/FilterSortBar";
import { NoResults } from "../src/components/NoResults";
import { ProductCard } from "../src/components/ProductCard";
import { SearchBar } from "../src/components/SearchBar";
import { SortSheet } from "../src/components/SortSheet";
import { useProducts } from "../src/context/ProductsContext";
import { useProductQuery } from "../src/hooks/useProductQuery";
import { SORT_OPTIONS } from "../src/types/filters";
import {
	colors,
	gradients,
	radius,
	shadow,
	spacing,
	typography,
} from "../src/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MyProductsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { products, isLoading, refresh } = useProducts();

	// Search / filter / sort state + derived results.
	const query = useProductQuery(products);
	const [sortOpen, setSortOpen] = useState(false);
	const sortShort = useMemo(
		() => SORT_OPTIONS.find((o) => o.value === query.sort)?.short ?? "Sort",
		[query.sort],
	);

	// Pull-to-refresh: re-read from storage, keeping the spinner up briefly so
	// it doesn't flicker on an instant local read.
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const started = Date.now();
		try {
			await refresh();
		} finally {
			const elapsed = Date.now() - started;
			if (elapsed < 600) {
				await new Promise((resolve) => setTimeout(resolve, 600 - elapsed));
			}
			setRefreshing(false);
		}
	}, [refresh]);

	// Brief loading animation on the FAB before the modal opens.
	const [navigating, setNavigating] = useState(false);
	const fabPress = useSharedValue(0);
	const fabStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 - fabPress.value * 0.08 }],
	}));

	// Reset the FAB when we come back from the Add screen.
	useFocusEffect(
		useCallback(() => {
			setNavigating(false);
		}, []),
	);

	const goToAdd = () => {
		if (navigating) return;
		setNavigating(true);
		setTimeout(() => {
			router.push("/add-product");
		}, 520);
	};

	// Pass ONLY the id through the route — the detail screen looks the rest up.
	const goToDetail = (id: string) =>
		router.push({ pathname: "/product/[id]", params: { id } });

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Loading your products…</Text>
			</View>
		);
	}

	if (products.length === 0) {
		return (
			<View style={[styles.flex, { paddingTop: insets.top }]}>
				<EmptyState onAdd={goToAdd} />
			</View>
		);
	}

	const { results } = query;
	const resultCaption = query.isFiltering
		? `${results.length} of ${products.length} ${products.length === 1 ? "product" : "products"}`
		: `${products.length} ${products.length === 1 ? "product listed" : "products listed"}`;

	return (
		<View style={styles.flex}>
			{/* Fixed header — search/filter/sort stay accessible while the list scrolls. */}
			<View
				// entering={FadeInDown.duration(450)}
				style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
				<View style={styles.titleRow}>
					<View style={styles.headerText}>
						<Text style={styles.greeting}>Welcome back</Text>
						<Text style={styles.title}>My Products</Text>
					</View>
					<LinearGradient
						colors={gradients.primary}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={[styles.logoBadge, shadow.primary]}>
						<Ionicons
							name="storefront"
							size={24}
							color={colors.onPrimary}
						/>
					</LinearGradient>
				</View>

				<SearchBar value={query.search} onChangeText={query.setSearch} />

				<FilterSortBar
					status={query.status}
					onStatusChange={query.setStatus}
					counts={query.counts}
					sortShort={sortShort}
					onOpenSort={() => setSortOpen(true)}
				/>

				<CategoryFilterBar
					value={query.category}
					onChange={query.setCategory}
				/>
			</View>

			{results.length === 0 ? (
				<NoResults onClear={query.clear} />
			) : (
				<FlatList
					data={results}
					keyExtractor={(item) => item.id}
					renderItem={({ item, index }) => (
						<ProductCard
							product={item}
							index={index}
							onPress={() => goToDetail(item.id)}
						/>
					)}
					contentContainerStyle={[
						styles.listContent,
						{ paddingBottom: insets.bottom + 110 },
					]}
					ItemSeparatorComponent={() => (
						<View style={{ height: spacing.md }} />
					)}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					ListHeaderComponent={
						<Text style={styles.resultCaption}>{resultCaption}</Text>
					}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={colors.primary}
							colors={[colors.primary, colors.violet]}
							progressBackgroundColor={colors.surface}
						/>
					}
				/>
			)}

			{/* Floating action button with a brief loading animation. */}
			<AnimatedPressable
				onPress={goToAdd}
				onPressIn={() =>
					(fabPress.value = withSpring(1, { damping: 16, stiffness: 250 }))
				}
				onPressOut={() =>
					(fabPress.value = withSpring(0, { damping: 16, stiffness: 250 }))
				}
				accessibilityRole="button"
				accessibilityLabel="Add product"
				accessibilityState={{ busy: navigating }}
				style={[
					styles.fab,
					{ bottom: insets.bottom + spacing.lg },
					fabStyle,
					shadow.primary,
				]}>
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.fabGradient}>
					{navigating ? (
						<ActivityIndicator size="small" color={colors.onPrimary} />
					) : (
						<Ionicons name="add" size={32} color={colors.onPrimary} />
					)}
				</LinearGradient>
			</AnimatedPressable>

			<SortSheet
				visible={sortOpen}
				value={query.sort}
				onChange={(value) => {
					query.setSort(value);
					setSortOpen(false);
				}}
				onClose={() => setSortOpen(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1, backgroundColor: colors.background },
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.md,
		backgroundColor: colors.background,
	},
	loadingText: { ...typography.caption, color: colors.textMuted },
	header: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.md,
		gap: spacing.md,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerText: { flex: 1, gap: 2 },
	greeting: { ...typography.label, color: colors.primary },
	title: { ...typography.title, color: colors.text },
	logoBadge: {
		width: 52,
		height: 52,
		borderRadius: radius.lg,
		alignItems: "center",
		justifyContent: "center",
	},
	listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
	resultCaption: {
		...typography.caption,
		color: colors.textMuted,
		marginBottom: spacing.md,
	},
	fab: {
		position: "absolute",
		right: spacing.lg,
		width: 62,
		height: 62,
		borderRadius: radius.pill,
	},
	fabGradient: {
		flex: 1,
		borderRadius: radius.pill,
		alignItems: "center",
		justifyContent: "center",
	},
});
