import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { PFI } from "@/lib/models";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();

  const { name, did, adminDid } = reqBody;

  try {
    const client = await clientPromise;
    const db = client.db();

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
          creator: adminDid,
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

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const pfiDid = url.searchParams.get("pfiDid");
    const pair = url.searchParams.get("pair");
    let pfi;

    if (pfiDid) {
      pfi = await db.collection("pfis").findOne({ did: pfiDid });
    } else if (pair) {
      pfi = await db.collection("pfis").find({ pairs: pair }).toArray();
    } else {
      pfi = await db.collection("pfis").find().toArray();
    }

    return NextResponse.json({ pfi }, { status: 200 });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const reqBody = await req.json();

  const { did, isActive, pair } = reqBody;
  try {
    const client = await clientPromise;
    const db = client.db();

    if (pair) {
      const addPair = await db.collection("pfis").findOneAndUpdate(
        { did: did },
        {
          $addToSet: { pairs: pair },
        },
        { returnDocument: "after" }
      );

      if (addPair) {
        return NextResponse.json(
          { message: "Pair has been added!" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "PFI does not exist" },
          { status: 400 }
        );
      }
    } else {
      const pfi = await db.collection("pfis").findOneAndUpdate(
        { did: did },
        {
          $set: { isActive: isActive },
        },
        { returnDocument: "after" }
      );

      if (pfi) {
        return NextResponse.json(
          { message: "PFI has been updated!" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "PFI does not exist" },
          { status: 400 }
        );
      }
    }
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

  try {
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
    return NextResponse.json({ message: "PFI deleted!" }, { status: 200 });
  } catch (error) {
    console.log("An error Occured", error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
