# Vendor Mini-App

A single-vendor product-catalog app — a vendor lists products with a photo, price, description, and
active/inactive status. Three screens: **My Products** (list) → **Add Product** (form + camera) →
**Product Detail**. Fully local and offline (Expo SDK 54, React Native 0.81, Expo Router, TypeScript).

## Running it

**Prereqs:** Node 18+ and either the [Expo Go](https://expo.dev/go) app on an Android device, or an
Android emulator.

```bash
npm install

npx expo start

OR

npx expo start -c
```

Everything stays **Expo Go-compatible** on purpose — no custom dev build is needed to run or grade it.
The camera/gallery flow needs a real device or an emulator with a (virtual) camera.

## Tech & key decisions

Expo Router (file-based, typed routes) · TypeScript (`strict`) · plain `StyleSheet` with central
design tokens ([src/theme/index.ts](src/theme/index.ts)) · AsyncStorage
([src/lib/storage.ts](src/lib/storage.ts)) · photo capture via `expo-image-picker`
([src/hooks/useImagePicker.ts](src/hooks/useImagePicker.ts)). The product **id is passed through the
route**; the detail screen re-looks it up from context rather than drilling props.

## Tradeoffs

- **AsyncStorage over in-memory** — products survive an app restart, which is what a vendor expects.
  Tradeoff: stored JSON is read back unvalidated and cast to `Product[]`, so the storage key
  (`vendor.products.v1`) must be bumped or migrated if the shape changes.
- **Plain `StyleSheet` over NativeWind/Tamagui** — zero config, fully type-safe, and nothing to break
  across SDK upgrades. Tokens live in one file so the whole app restyles from there.
- **Image stored as a local `file://` URI** — nothing is uploaded. These URIs are device-local and can
  go stale; a real backend would need to upload the actual image bytes, not just the path.
- **One React context as the single source of truth**
  ([src/context/ProductsContext.tsx](src/context/ProductsContext.tsx)) — right-sized for a single
  vendor; would be swapped for a server/cache layer if this synced to a backend.

## What I'd improve with more time

- Edit / delete (intentionally omitted — outside the assignment's 3-screen scope).
- A real backend with image upload + sync, instead of local-only storage.
- Schema validation / migration on the stored data instead of a blind cast.
- Tests (`jest-expo`) for validation, the query hook, and the add flow.
- List pagination / virtualization once a vendor has hundreds of products.

## AI Notes

**Which AI tool & how much:** I used Claude Code. It wrote most of the first version. I edited it and
learned from it as I went.

**Where the AI got it wrong:**

1. **It said to use Expo 56.** That is the newest version. But Android Expo Go does not support it
   yet. So the app would not open on my phone. I downgraded to **Expo 54**. Then it ran.
2. **The drag-down close animation looked wrong.** The sheet faded to the middle instead of sliding
   down. I changed it so it slides straight down off the bottom.
3. **The swipe-down to close did nothing at first.** The gesture code was in the wrong place. I moved
   it inside the popup and then the swipe worked.

**Something the AI taught me:** This is my first React Native app. It taught me almost everything,
coming from web:

- `div` → `View`, `img` → `Image`, `button` → `Pressable`
- No CSS files. Styles are JS objects (`StyleSheet`).
- How **Expo Router** works. Files and folders become screens.
- What **SafeAreaProvider** does. It keeps content off the notch and home bar.
- What a **FlatList** is. It is a fast scrolling list.
- **KeyboardAvoidingView** and **ScrollView** for forms.
- **Stack** navigation. The back button comes from it.

I did not know any of this before. I learned a lot.

---

> Deliverables not in this repo: a 1–2 min screen recording of the end-to-end flow (including camera),
> and the built APK.
