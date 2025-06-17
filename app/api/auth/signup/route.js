import ConnectMongoDb from "@/lib/mongodb";
import Users from "@/models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { user_name, email, password, phone_number } = await request.json();
    if (!user_name || !email || !password || !phone_number) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    await ConnectMongoDb();
    const existing = await Users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User with this email already registered" }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await Users.create({
      user_name,
      email,
      password: hashed,
      role: "User",
      phone_number, // needs to be collected from signup form
    });
    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
