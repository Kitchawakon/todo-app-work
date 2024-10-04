import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

// url => api/v1/todo/pid
export async function GET(
  req: Request,
  {params}: {params:{pid:string}}) {
  try {
    const pid = params.pid;
    await connectToDatabase();
    const todoResult = await Todo.find({_id:pid});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;
    const body = await req.json()
    await connectToDatabase();
    const updatedTodo = await Todo.findByIdAndUpdate(pid, body, {
      new: true, 
      runValidators: true,
    });
    return NextResponse.json({ data: updatedTodo });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}

export async function DELETE(
  req: Request,
  {params}: {params:{pid:string}}) {
  try {
    const pid = params.pid;
    await connectToDatabase();
    const todoResult = await Todo.deleteOne({_id:pid});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}