"use server";
import { NextResponse } from "next/server";
import { Timestamp, GeoPoint, DocumentReference } from "firebase/firestore";

/**
 * Recursively serialize Firestore data to JSON-safe values.
 * Handles:
 * - Timestamp -> ISO string
 * - GeoPoint -> { lat, lng }
 * - DocumentReference -> path string
 * - Arrays, nested objects
 * - null and undefined
 * - Any unknown types -> string
 */
function serializeFirestoreData(data: any): any {
  if (data === undefined) return null; // avoid undefined
  if (data === null) return null;
  if (data instanceof Timestamp) return data.toDate().toISOString();
  if (data instanceof GeoPoint) return { lat: data.latitude, lng: data.longitude };
  if (data instanceof DocumentReference) return data.path;
  if (Array.isArray(data)) return data.map(serializeFirestoreData);
  if (data && typeof data === "object") {
    // This is the crucial part for nested objects.
    // It creates a new object and recursively calls serializeFirestoreData for each value.
    const serialized: Record<string, any> = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            serialized[key] = serializeFirestoreData(data[key]);
        }
    }
    return serialized;
  }
  
  // Handle primitives and other types
  if (typeof data === "function") return `[Function: ${data.name || "anonymous"}]`;
  if (typeof data === "symbol") return data.toString();
  
  return data;
}


/**
 * Master Safe Server Action Wrapper
 * @param action - async function containing your server logic
 * Returns a JSON-safe response with success/error handling
 */
export async function safeServerAction(action: () => Promise<any>) {
  try {
    const result = await action();
    const serializedResult = serializeFirestoreData(result);
    return NextResponse.json({ success: true, data: serializedResult });
  } catch (error: any) {
    console.error("🔥 Server Action Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}