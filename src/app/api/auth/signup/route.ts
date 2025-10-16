import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/dbConnect";
import User from "../../../../models/UserModel";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
