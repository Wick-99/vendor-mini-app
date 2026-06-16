import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Which product status the list is filtered to. */
export type StatusFilter = "all" | "active" | "inactive";

/** How the list is ordered. */
export type SortOption =
	| "newest"
	| "oldest"
	| "price-asc"
	| "price-desc"
	| "name-asc";

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

export interface SortMeta {
	value: SortOption;
	/** Full label shown in the sort sheet. */
	label: string;
	/** Compact label shown on the sort button. */
	short: string;
	icon: IoniconName;
}

export const SORT_OPTIONS: SortMeta[] = [
	{ value: "newest", label: "Newest first", short: "Newest", icon: "time-outline" },
	{ value: "oldest", label: "Oldest first", short: "Oldest", icon: "hourglass-outline" },
	{
		value: "price-asc",
		label: "Price: low to high",
		short: "Price ↑",
		icon: "trending-up-outline",
	},
	{
		value: "price-desc",
		label: "Price: high to low",
		short: "Price ↓",
		icon: "trending-down-outline",
	},
	{ value: "name-asc", label: "Name: A–Z", short: "Name", icon: "text-outline" },
];
