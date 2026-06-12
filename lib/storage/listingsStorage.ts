import type { UserListing } from "@/lib/types/listing";

const DB_NAME = "aqar-online-db";
const DB_VERSION = 2;
const LISTINGS_STORE = "listings";
const IMAGES_STORE = "images";

type StoredListing = Omit<UserListing, "images" | "img"> & {
  imageCount: number;
};

function normalizeListings(raw: UserListing[]): UserListing[] {
  return raw.map((l) => ({
    ...l,
    images: l.images ?? (l.img ? [l.img] : []),
    status: l.status ?? "pending",
  }));
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LISTINGS_STORE)) {
        db.createObjectStore(LISTINGS_STORE);
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function legacyKey(userId: string) {
  return `aqar-listings-${userId}`;
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getImage(
  db: IDBDatabase,
  key: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, "readonly");
    const req = tx.objectStore(IMAGES_STORE).get(key);
    req.onsuccess = () => resolve((req.result as string) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function loadImages(
  db: IDBDatabase,
  userId: string,
  listingId: number | string,
  count: number
): Promise<string[]> {
  if (count === 0) return [];

  const results = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      getImage(db, `${userId}:${listingId}:${i}`)
    )
  );

  return results.filter((src): src is string => Boolean(src));
}

async function migrateFromLocalStorage(userId: string): Promise<UserListing[]> {
  try {
    const legacy = localStorage.getItem(legacyKey(userId));
    if (!legacy) return [];

    const parsed = normalizeListings(JSON.parse(legacy));
    await saveListings(userId, parsed);
    localStorage.removeItem(legacyKey(userId));
    return parsed;
  } catch {
    return [];
  }
}

export async function loadListings(userId: string): Promise<UserListing[]> {
  try {
    const db = await openDB();

    const stored = await new Promise<StoredListing[] | UserListing[] | null>(
      (resolve, reject) => {
        const tx = db.transaction(LISTINGS_STORE, "readonly");
        const req = tx.objectStore(LISTINGS_STORE).get(userId);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
      }
    );

    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      return migrateFromLocalStorage(userId);
    }

    const first = stored[0] as StoredListing | UserListing;

    // بيانات قديمة فيها الصور مدمجة
    if ("images" in first && Array.isArray(first.images)) {
      return normalizeListings(stored as UserListing[]);
    }

    const rebuilt: UserListing[] = [];

    for (const item of stored as StoredListing[]) {
      const images = await loadImages(db, userId, item.id, item.imageCount ?? 0);
      rebuilt.push({
        ...item,
        images,
        img: images[0] ?? "",
      });
    }

    return normalizeListings(rebuilt);
  } catch {
    return migrateFromLocalStorage(userId);
  }
}

export async function saveListings(
  userId: string,
  listings: UserListing[]
): Promise<void> {
  const db = await openDB();

  const meta: StoredListing[] = listings.map(
    ({ images, img, ...rest }) => ({
      ...rest,
      imageCount: images?.length ?? (img ? 1 : 0),
    })
  );

  const tx = db.transaction([LISTINGS_STORE, IMAGES_STORE], "readwrite");
  const listingsStore = tx.objectStore(LISTINGS_STORE);
  const imagesStore = tx.objectStore(IMAGES_STORE);

  listingsStore.put(meta, userId);

  for (const listing of listings) {
    const imgs = listing.images?.length
      ? listing.images
      : listing.img
        ? [listing.img]
        : [];

    imgs.forEach((src, index) => {
      imagesStore.put(src, `${userId}:${listing.id}:${index}`);
    });
  }

  await txDone(tx);
}
