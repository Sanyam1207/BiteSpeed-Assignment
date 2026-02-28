import { prisma } from "../lib/prisma";
import { Contact, LinkPrecedence } from "../../generated/prisma/client";

export class ContactRepository {
  async findByEmailOrPhone(
    email?: string,
    phoneNumber?: string,
  ): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [
          email ? { email } : undefined,
          phoneNumber ? { phoneNumber } : undefined,
        ].filter(Boolean) as any,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
    });
  }

  async createPrimary(email?: string, phoneNumber?: string): Promise<Contact> {
    return prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: LinkPrecedence.primary,
      },
    });
  }

  async createSecondary(
    primaryId: number,
    email?: string,
    phoneNumber?: string,
  ): Promise<Contact> {
    return prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryId,
        linkPrecedence: LinkPrecedence.secondary,
      },
    });
  }

  async updateToSecondary(
    contactId: number,
    primaryId: number,
  ): Promise<Contact> {
    return prisma.contact.update({
      where: { id: contactId },
      data: {
        linkedId: primaryId,
        linkPrecedence: LinkPrecedence.secondary,
      },
    });
  }

  async getAllLinkedContacts(primaryId: number): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [{ id: primaryId }, { linkedId: primaryId }],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findByLinkedId(linkedId: number): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        linkedId,
        deletedAt: null,
      },
    });
  }
}
