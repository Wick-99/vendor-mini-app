import { useCallback, useMemo, useState } from "react";
import { DEFAULT_CATEGORY, type ProductCategory } from "../types/category";
import type { SortOption, StatusFilter } from "../types/filters";
import type { Product } from "../types/product";

export type CategoryFilter = ProductCategory | "all";

const COMPARATORS: Record<SortOption, (a: Product, b: Product) => number> = {
	newest: (a, b) => b.createdAt - a.createdAt,
	oldest: (a, b) => a.createdAt - b.createdAt,
	"price-asc": (a, b) => a.price - b.price,
	"price-desc": (a, b) => b.price - a.price,
	"name-asc": (a, b) => a.name.localeCompare(b.name),
};

export interface ProductQuery {
	search: string;
	setSearch: (value: string) => void;
	status: StatusFilter;
	setStatus: (value: StatusFilter) => void;
	category: CategoryFilter;
	setCategory: (value: CategoryFilter) => void;
	sort: SortOption;
	setSort: (value: SortOption) => void;
	/** Products after search + status + category filter + sort. */
	results: Product[];
	/** Total per status, for filter-chip badges. */
	counts: Record<StatusFilter, number>;
	/** True when a search term or any non-default filter is active. */
	isFiltering: boolean;
	/** Clear search and reset status + category filters (keeps sort). */
	clear: () => void;
}

/**
 * Derives the visible product list from the raw context list and the user's
 * search / filter / sort selections. Pure derivation memoized on its inputs —
 * the screen just renders `results`.
 */
export function useProductQuery(products: Product[]): ProductQuery {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<StatusFilter>("all");
	const [category, setCategory] = useState<CategoryFilter>("all");
	const [sort, setSort] = useState<SortOption>("newest");

	const results = useMemo(() => {
		const term = search.trim().toLowerCase();
		const filtered = products.filter((p) => {
			if (status !== "all" && p.status !== status) return false;
			// Treat legacy products without a category as "other".
			if (category !== "all" && (p.category ?? DEFAULT_CATEGORY) !== category) {
				return false;
			}
			if (term && !`${p.name} ${p.description}`.toLowerCase().includes(term)) {
				return false;
			}
			return true;
		});
		// filter() already returns a fresh array, so sorting in place is safe.
		return filtered.sort(COMPARATORS[sort]);
	}, [products, search, status, category, sort]);

	const counts = useMemo<Record<StatusFilter, number>>(
		() => ({
			all: products.length,
			active: products.filter((p) => p.status === "active").length,
			inactive: products.filter((p) => p.status === "inactive").length,
		}),
		[products],
	);

	const clear = useCallback(() => {
		setSearch("");
		setStatus("all");
		setCategory("all");
	}, []);

	const isFiltering =
		search.trim() !== "" || status !== "all" || category !== "all";

	return {
		search,
		setSearch,
		status,
		setStatus,
		category,
		setCategory,
		sort,
		setSort,
		results,
		counts,
		isFiltering,
		clear,
	};
}
