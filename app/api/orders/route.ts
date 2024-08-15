import { Order } from "@/lib/models";
import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();

  const { userDid, pfiDid, status, rating, review } = reqBody;

  try {
    const client = await clientPromise;
    const db = client.db();
    const newOrder = new Order({
      userDid,
      pfiDid,
      status,
      rating,
      review,
    });

    const pfi = await db.collection("pfis").findOneAndUpdate(
      { did: pfiDid },
      {
        $push: { orders: newOrder },
      },
      { returnDocument: "after" }
    );

    if (!pfi) {
      throw new Error("PFI not found");
    }

    await db.collection("orders").insertOne(newOrder);

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    console.log("An error occured!", error);
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
    let orders;

    if (pfiDid) {
      orders = await db.collection("orders").find({ pfiDid: pfiDid }).toArray();
    } else {
      orders = await db.collection("orders").find().toArray();
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.log("An error occured!", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
