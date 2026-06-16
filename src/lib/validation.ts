import type { ProductCategory } from "../types/category";
import type { NewProductInput } from "../types/product";

export interface FieldErrors {
	name?: string;
	price?: string;
	imageUri?: string;
	category?: string;
	customCategory?: string;
}

/** "12" "12.5" "12.50" → number; "" "abc" "-3" "0" "1.2.3" → null */
export function parsePrice(input: string): number | null {
	const trimmed = input.trim();
	if (trimmed === "") return null;
	if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
	const value = Number(trimmed);
	if (!Number.isFinite(value) || value <= 0) return null;
	return value;
}

export function validateProduct(values: {
	name: string;
	price: string;
	imageUri: string | null;
	category: ProductCategory | null;
	customCategory: string;
}): FieldErrors {
	const errors: FieldErrors = {};

	if (values.name.trim().length === 0) {
		errors.name = "Product name is required.";
	} else if (values.name.trim().length > 80) {
		errors.name = "Keep the name under 80 characters.";
	}

	if (values.price.trim().length === 0) {
		errors.price = "Price is required.";
	} else if (parsePrice(values.price) === null) {
		errors.price = "Enter a valid price greater than 0 (e.g. 24.99).";
	}

	if (!values.imageUri) {
		errors.imageUri = "Add a product photo.";
	}

	if (!values.category) {
		errors.category = "Choose a category.";
	} else if (values.category === "other") {
		const custom = values.customCategory.trim();
		if (custom.length === 0) {
			errors.customCategory = "Name your category.";
		} else if (custom.length > 30) {
			errors.customCategory = "Keep it under 30 characters.";
		}
	}

	return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
	return Object.keys(errors).length > 0;
}

export function formatPrice(price: number): string {
	return `$${price.toFixed(2)}`;
}

export function toNewProduct(values: {
	name: string;
	price: string;
	description: string;
	imageUri: string;
	status: NewProductInput["status"];
	category: ProductCategory;
	customCategory: string;
}): NewProductInput {
	return {
		name: values.name.trim(),
		price: parsePrice(values.price) as number,
		description: values.description.trim(),
		imageUri: values.imageUri,
		status: values.status,
		category: values.category,
		customCategory:
			values.category === "other" ? values.customCategory.trim() : undefined,
	};
}
