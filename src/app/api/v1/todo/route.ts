// src/app/api/v1/todo/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

// GET
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({}).select('-__v');
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({
      error: {
        message: err instanceof Error ? err.message : "An unexpected error occurred",
      },
    });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTodo = { ...body, status: false };
    const res = await Todo.create(newTodo);
    return NextResponse.json({ data: res });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    });
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const res = await Todo.updateOne(
      { _id: id },
      { status: status }
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: { message: "No task found with the provided ID" } });
    }

    return NextResponse.json({ message: "Task updated successfully", data: res });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    });
  }
}

// DELETE
// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: { message: "ID is required for deletion" } });
    }

    const res = await Todo.deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: { message: "No task found with the provided ID" } });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE error:", error);
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    });
  }
}

