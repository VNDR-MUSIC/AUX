
import { Timestamp, GeoPoint, DocumentReference } from "firebase/firestore";

/**
 * Recursively serializes Firestore data into plain JSON-friendly objects.
 * Converts Timestamps to ISO strings, GeoPoints to {lat, lng}, 
 * and DocumentReferences to paths.
 */
export function serializeFirestoreData(data: unknown): unknown {
  if (data === undefined || data === null) return null;

  if (data instanceof Timestamp) return data.toDate().toISOString();
  if (data instanceof GeoPoint) return { lat: data.latitude, lng: data.longitude };
  if (data instanceof DocumentReference) return data.path;

  if (Array.isArray(data)) return data.map(serializeFirestoreData);

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeFirestoreData((data as Record<string, unknown>)[key]);
      }
    }
    return result;
  }

  return data; // primitives: string, number, boolean, etc.
}
