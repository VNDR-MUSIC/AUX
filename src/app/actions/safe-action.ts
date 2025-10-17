
"use server";
import { NextResponse } from "next/server";
import { serializeFirestoreData } from "@/lib/serialization";


/**
 * Master Safe Server Action Wrapper
 * @param action - async function containing your server logic
 * Returns a JSON-safe response with success/error handling
 */
export async function safeServerAction(action: () => Promise<any>) {
  try {
    const result = await action();
    // The result from the action is serialized here before being sent to the client.
    return NextResponse.json({ success: true, data: serializeFirestoreData(result) });
  } catch (error: any) {
    console.error("🔥 Server Action Error:", error);
    // If any error occurs, it's caught and a standardized error response is returned.
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
