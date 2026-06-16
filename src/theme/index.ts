/**
 * Central design tokens — premium light theme (indigo / violet).
 *
 * Everything visual is defined ONCE here and imported everywhere. Plain
 * StyleSheet (no NativeWind) is a deliberate choice: zero config, nothing to
 * break across SDK versions, full type-safety. Gradients, shadows and the
 * accent ramp all live here so the whole app restyles from one file.
 */

export const colors = {
	// Surfaces — soft, cool whites
	background: "#F6F7FB",
	backgroundElevated: "#FFFFFF",
	surface: "#FFFFFF",
	surfaceAlt: "#EEF0F8", // image placeholders / sunken fills
	surfaceSunken: "#F1F2F9",
	tint: "#EEF0FF", // faint indigo wash for hero areas

	// Hairlines / borders
	border: "#E7E9F2",
	borderStrong: "#D6D9E8",

	// Text
	text: "#0E1525",
	textMuted: "#5B6475",
	textFaint: "#9AA3B5",

	// Brand accent ramp (indigo → violet)
	primary: "#6366F1",
	primaryPressed: "#4F46E5",
	primarySoft: "#EEF0FF",
	violet: "#8B5CF6",
	onPrimary: "#FFFFFF",

	// Status
	active: "#10B981",
	activeSurface: "rgba(16,185,129,0.12)",
	inactive: "#94A3B8",
	inactiveSurface: "rgba(148,163,184,0.16)",

	danger: "#EF4444",
	dangerSurface: "rgba(239,68,68,0.10)",

	// Misc
	overlay: "rgba(14,21,37,0.45)",
	white: "#FFFFFF",
	black: "#0E1525",
} as const;

/** Gradient stop tuples — spread straight into <LinearGradient colors={...} />. */
export const gradients = {
	primary: ["#6366F1", "#8B5CF6"] as const,
	primaryPressed: ["#4F46E5", "#7C3AED"] as const,
	splash: ["#FFFFFF", "#EEF0FF", "#F3F0FF"] as const,
	hero: ["#EEF0FF", "#F6F7FB"] as const,
	imageScrim: ["transparent", "rgba(14,21,37,0.55)"] as const,
	card: ["#FFFFFF", "#FBFBFF"] as const,
} as const;

export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
} as const;

export const radius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 22,
	xxl: 28,
	pill: 999,
} as const;

export const typography = {
	display: { fontSize: 34, lineHeight: 40, fontWeight: "800" as const, letterSpacing: -0.5 },
	title: { fontSize: 28, lineHeight: 34, fontWeight: "800" as const, letterSpacing: -0.3 },
	heading: { fontSize: 20, lineHeight: 26, fontWeight: "700" as const, letterSpacing: -0.2 },
	body: { fontSize: 16, lineHeight: 23, fontWeight: "400" as const },
	bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
	label: { fontSize: 14, lineHeight: 18, fontWeight: "600" as const },
	caption: { fontSize: 13, lineHeight: 17, fontWeight: "500" as const },
	price: { fontSize: 18, lineHeight: 22, fontWeight: "800" as const, letterSpacing: -0.2 },
} as const;

/**
 * Elevation presets. Soft, colored shadows (cool indigo-gray) read as
 * "premium" on light surfaces. Spread onto a style: `style={[s.card, shadow.md]}`.
 */
export const shadow = {
	sm: {
		shadowColor: "#3B3F66",
		shadowOpacity: 0.07,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
	},
	md: {
		shadowColor: "#3B3F66",
		shadowOpacity: 0.1,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 8 },
		elevation: 6,
	},
	lg: {
		shadowColor: "#2A2E55",
		shadowOpacity: 0.16,
		shadowRadius: 28,
		shadowOffset: { width: 0, height: 14 },
		elevation: 12,
	},
	/** Colored glow for primary CTAs / the FAB. */
	primary: {
		shadowColor: "#6366F1",
		shadowOpacity: 0.4,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 10 },
		elevation: 10,
	},
} as const;

export const theme = { colors, gradients, spacing, radius, typography, shadow };
export type Theme = typeof theme;
