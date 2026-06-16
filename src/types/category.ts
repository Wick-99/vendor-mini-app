import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type ProductCategory =
	| "apparel"
	| "electronics"
	| "home"
	| "beauty"
	| "food"
	| "accessories"
	| "other";

export interface CategoryMeta {
	value: ProductCategory;
	label: string;
	icon: IoniconName;
}

export const CATEGORIES: CategoryMeta[] = [
	{ value: "apparel", label: "Apparel", icon: "shirt-outline" },
	{ value: "electronics", label: "Electronics", icon: "hardware-chip-outline" },
	{ value: "home", label: "Home", icon: "home-outline" },
	{ value: "beauty", label: "Beauty", icon: "sparkles-outline" },
	{ value: "food", label: "Food", icon: "fast-food-outline" },
	{ value: "accessories", label: "Accessories", icon: "watch-outline" },
	{ value: "other", label: "Other", icon: "pricetag-outline" },
];

/** Fallback for products saved before categories existed. */
export const DEFAULT_CATEGORY: ProductCategory = "other";

/** Resolve metadata for a (possibly missing/legacy) category value. */
export function categoryMeta(value: ProductCategory | undefined | null): CategoryMeta {
	return (
		CATEGORIES.find((c) => c.value === value) ??
		CATEGORIES[CATEGORIES.length - 1] // "other"
	);
}

export interface ResolvedCategory {
	label: string;
	icon: IoniconName;
}

/**
 * The display label + icon for a product's category. When the category is
 * "other" and a free-text `customCategory` was provided, that text is shown
 * (with a generic tag icon) instead of the literal "Other".
 */
export function resolveCategory(
	value: ProductCategory | undefined | null,
	customCategory?: string | null,
): ResolvedCategory {
	const custom = customCategory?.trim();
	if (value === "other" && custom) {
		return { label: custom, icon: "pricetag-outline" };
	}
	const meta = categoryMeta(value);
	return { label: meta.label, icon: meta.icon };
}
