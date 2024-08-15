import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { PFI } from "@/lib/models";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const reqBody = await req.json();

  const { name, did } = reqBody;

  try {
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();

    const creator = await db.collection("users").findOne({
      email: session.user?.email,
    });
    const pfiRegistered = await db.collection("pfis").findOne({ did: did });

    if (pfiRegistered) {
      return NextResponse.json(
        { message: "PFI already exist" },
        { status: 400 }
      );
    } else {
      await db.collection("pfis").insertOne(
        new PFI({
          name: name,
          did: did,
          creator: creator?._id,
        })
      );
    }
    return NextResponse.json({ message: "PFI registered!" }, { status: 201 });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const pfis = await db.collection("pfis").find().toArray();

    return NextResponse.json({ pfis });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { did } = await req.json();
  const session = await getServerSession(authOptions);

  try {
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();

    const pfi = await db.collection("pfis").findOne({ did: did });

    if (pfi) {
      await db.collection("pfis").deleteOne({ did: did });
    } else {
      return NextResponse.json(
        { message: "PFI does not exist" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "PFI deleted!" }, { status: 201 });
  } catch (error) {
    console.log("An error Occured", error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
