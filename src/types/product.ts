import type { ProductCategory } from "./category";

export type ProductStatus = "active" | "inactive";

export interface Product {
	id: string;
	name: string;
	price: number; // dollars, as a number
	description: string;
	imageUri: string; // local file URI (file://...) from the picker
	status: ProductStatus;
	category: ProductCategory;
	customCategory?: string; // free-text label, only when category === "other"
	createdAt: number; // epoch ms — used to sort newest-first
}

export type NewProductInput = Pick<
	Product,
	| "name"
	| "price"
	| "description"
	| "imageUri"
	| "status"
	| "category"
	| "customCategory"
>;
