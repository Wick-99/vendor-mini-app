import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { loadProducts, saveProducts } from "../lib/storage";
import type { NewProductInput, Product } from "../types/product";

interface ProductsContextValue {
	products: Product[];
	isLoading: boolean;
	addProduct: (input: NewProductInput) => Promise<Product>;
	updateProduct: (id: string, input: NewProductInput) => Promise<void>;
	getProductById: (id: string) => Product | undefined;
	/** Re-read products from storage (used by pull-to-refresh). */
	refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
	undefined,
);

function createId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Hydrate from storage once, on mount.
	useEffect(() => {
		let cancelled = false;
		(async () => {
			const stored = await loadProducts();
			if (!cancelled) {
				stored.sort((a, b) => b.createdAt - a.createdAt);
				setProducts(stored);
				setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const addProduct = useCallback(
		async (input: NewProductInput): Promise<Product> => {
			const product: Product = {
				...input,
				id: createId(),
				createdAt: Date.now(),
			};
			const next = [product, ...products]; // new product goes to the TOP
			setProducts(next);
			await saveProducts(next);
			return product;
		},
		[products],
	);

	const updateProduct = useCallback(
		async (id: string, input: NewProductInput): Promise<void> => {
			const next = products.map((p) =>
				p.id === id ? { ...p, ...input } : p,
			);
			setProducts(next);
			await saveProducts(next);
		},
		[products],
	);

	const getProductById = useCallback(
		(id: string) => products.find((p) => p.id === id),
		[products],
	);

	const refresh = useCallback(async () => {
		const stored = await loadProducts();
		stored.sort((a, b) => b.createdAt - a.createdAt);
		setProducts(stored);
	}, []);

	const value = useMemo(
		() => ({ products, isLoading, addProduct, updateProduct, getProductById, refresh }),
		[products, isLoading, addProduct, updateProduct, getProductById, refresh],
	);

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	);
}

export function useProducts(): ProductsContextValue {
	const ctx = useContext(ProductsContext);
	if (!ctx)
		throw new Error("useProducts must be used within a <ProductsProvider>.");
	return ctx;
}
