import { Pair } from "@/lib/models";
import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { type, offering } = reqBody;

  try {
    const client = await clientPromise;
    const db = client.db();

    const pairExist = await db
      .collection("pairs")
      .findOne({ type: type, offering: offering });
    if (pairExist) {
      return NextResponse.json(
        { message: "Pair already exist" },
        { status: 400 }
      );
    } else {
      await db.collection("pairs").insertOne(
        new Pair({
          type: type,
          offering: offering,
        })
      );
      return NextResponse.json(
        { message: "Pair registered!" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const pairs = await db.collection("pairs").find().toArray();

    return NextResponse.json({ pairs }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const reqBody = await req.json();
  const { offering } = reqBody;

  try {
    const client = await clientPromise;
    const db = client.db();

    const pairExist = await db
      .collection("pairs")
      .findOne({ offering: offering });
    if (!pairExist) {
      return NextResponse.json(
        { message: "Pair does not exist" },
        { status: 400 }
      );
    } else {
      await db.collection("pairs").deleteOne({
        offering: offering,
      });
      return NextResponse.json({ message: "Pair deleted!" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
