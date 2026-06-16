import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "../types/product";

const PRODUCTS_KEY = "vendor.products.v1";

export async function loadProducts(): Promise<Product[]> {
	try {
		const raw = await AsyncStorage.getItem(PRODUCTS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Product[]) : [];
	} catch (err) {
		console.warn("Failed to load products from storage:", err);
		return [];
	}
}

export async function saveProducts(products: Product[]): Promise<void> {
	try {
		await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
	} catch (err) {
		console.warn("Failed to save products to storage:", err);
		throw err; // let the caller surface a failure state
	}
}
