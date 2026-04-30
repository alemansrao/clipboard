import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import ConnectMongoDb from '@/lib/db';
import { validateSignupInput } from '@/lib/validators';
import User from '@/models/User';

export async function POST(request) {
  try {
    const payload = await request.json();
    const parsed = validateSignupInput(payload);

    await ConnectMongoDb();
    const existingUser = await User.findOne({ email: parsed.email });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);

    await User.create({
      userName: parsed.userName,
      email: parsed.email,
      passwordHash,
      authProviders: ['credentials'],
      role: 'user'
    });

    return NextResponse.json({ message: 'Account created successfully.' }, { status: 201 });
  } catch (error) {
    const message = error?.message || 'Unable to create account.';
    const status = message.includes('Invalid') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
