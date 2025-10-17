"use server";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Recursively serialize Firestore data to JSON-safe values.
 * Converts Timestamp -> ISO string, handles arrays and nested objects.
 */
function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Timestamp) return data.toDate().toISOString();
  if (Array.isArray(data)) return data.map(serializeFirestoreData);
  
  const serialized: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      serialized[key] = serializeFirestoreData(data[key]);
    }
  }
  return serialized;
}


/**
 * Master Safe Server Action Wrapper
 * @param action - async function containing your server logic
 * Returns a plain JSON object with success/error handling.
 */
export async function safeServerAction(action: () => Promise<any>): Promise<{ success: boolean; data?: any; error?: string; details?: string; }> {
  try {
    const result = await action();
    // The serialization should now happen inside the action that calls this wrapper.
    return { success: true, data: serializeFirestoreData(result) };
  } catch (error: any) {
    console.error("🔥 Server Action Error:", error);
    return {
      success: false,
      error: "Internal Server Error",
      details: error.message,
    };
  }
}
