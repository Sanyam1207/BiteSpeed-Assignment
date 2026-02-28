import { prisma } from "./lib/prisma";

async function test() {
  const allContacts = await prisma.contact.findMany({});
  console.log("Contacts:", allContacts);
  process.exit(0);
}

test();
