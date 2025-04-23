import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: Request) {
  try {
    const updatedData = await req.json();

    const filePath = path.join(process.cwd(), "data", "templists.json");

    // Async file writing for non-blocking IO
    await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json(
      { message: "Templists saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving templists:", error);
    // Return a NextResponse object for errors too
    return NextResponse.json(
      { message: "Failed to save templists" },
      { status: 500 },
    );
  }
}

// export async function GET(req: Request) {
//   // ... logic to read and return templists ...
// }
