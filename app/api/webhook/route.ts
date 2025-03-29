import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { Data } from "@/types";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  console.log("Received webhook request", SIGNING_SECRET);

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console

  const { id } = evt.data;
  const eventType = evt.type;
  const data: Data = payload.data;

  // Process the webhook based on event type
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = data;

    console.log("Data", data);

    // Check if the user already exists in the database

    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (existingUser) {
      console.log("User already exists in the database");
      return new Response("User already exists", { status: 200 });
    }

    // Create a new user in the database
    await prisma.user.create({
      data: {
        id: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || null,
        role: Role.USER, // Default role for new users
        imageUrl: image_url || null,
      },
    });
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = data;

    console.log("Data", data);

    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      console.log("User does not exist in the database");
      return new Response("User does not exist", { status: 200 });
    }

    // Update the user in the database
    await prisma.user.update({
      where: { id: id },
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || null,
      },
    });
  } else if (eventType === "user.deleted") {
    const { id } = data;

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: id },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
