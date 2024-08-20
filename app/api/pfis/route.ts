import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { PFI, Pair } from "@/lib/models";

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

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const pfiDid = url.searchParams.get("pfiDid");
    let pfi;

    if (pfiDid) {
      pfi = await db.collection("pfis").findOne({ did: pfiDid });
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
  const session = await getServerSession(authOptions);

  const reqBody = await req.json();

  const { did, isActive, newPair } = reqBody;

  try {
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();

    if (newPair) {
      const pair = new Pair(newPair);
      const pfi = await db.collection("pfis").findOne({ did: did });
      const pairExists = pfi?.pairs.some(
        (pair: any) => pair.offering === newPair.offering
      );

      if (pairExists) {
        return NextResponse.json(
          { message: "Pair already exist" },
          { status: 400 }
        );
      } else {
        const updatedPfi = await db.collection("pfis").findOneAndUpdate(
          { did: did },
          {
            $push: { pairs: pair },
          },
          { returnDocument: "after" }
        );
        if (updatedPfi) {
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
    } else if (isActive) {
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
    return NextResponse.json({ message: "PFI deleted!" }, { status: 200 });
  } catch (error) {
    console.log("An error Occured", error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
