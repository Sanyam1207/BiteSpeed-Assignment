import { ContactRepository } from "../repository/contact.repository";
import { Contact } from "../../generated/prisma/client";

export class ContactService {
  private contactRepo = new ContactRepository();

  async identify(email?: string, phoneNumber?: string) {
    const matchedContacts = await this.contactRepo.findByEmailOrPhone(
      email,
      phoneNumber,
    );

    if (matchedContacts.length === 0) {
      const newPrimary = await this.contactRepo.createPrimary(
        email,
        phoneNumber,
      );

      return this.buildResponse([newPrimary]);
    }

    const allRelatedContacts = await this.expandCluster(matchedContacts);

    const primary = this.findTruePrimary(allRelatedContacts);

    await this.mergePrimaries(allRelatedContacts, primary.id);

    const clusterAfterMerge = await this.contactRepo.getAllLinkedContacts(
      primary.id,
    );

    const emails = clusterAfterMerge.map((c) => c.email).filter(Boolean);
    const phones = clusterAfterMerge.map((c) => c.phoneNumber).filter(Boolean);

    const isNewEmail = email && !emails.includes(email);
    const isNewPhone = phoneNumber && !phones.includes(phoneNumber);

    if (isNewEmail || isNewPhone) {
      await this.contactRepo.createSecondary(primary.id, email, phoneNumber);
    }

    const finalCluster = await this.contactRepo.getAllLinkedContacts(
      primary.id,
    );

    return this.buildResponse(finalCluster);
  }

  private async expandCluster(initialContacts: Contact[]): Promise<Contact[]> {
    const visited = new Map<number, Contact>();
    const queue: Contact[] = [...initialContacts];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (visited.has(current.id)) continue;

      visited.set(current.id, current);

      // 1️⃣ Go upward to primary (linkedId)
      if (current.linkedId) {
        const parent = await this.contactRepo.findByIds([current.linkedId]);
        parent.forEach((p) => {
          if (!visited.has(p.id)) queue.push(p);
        });
      }

      // 2️⃣ Go downward to secondaries
      const children = await this.contactRepo.findByLinkedId(current.id);

      children.forEach((child) => {
        if (!visited.has(child.id)) queue.push(child);
      });
    }

    return Array.from(visited.values());
  }

  private findTruePrimary(contacts: Contact[]): Contact {
    const primaries = contacts.filter((c) => c.linkPrecedence === "primary");

    primaries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return primaries[0];
  }

  private async mergePrimaries(contacts: Contact[], truePrimaryId: number) {
    const otherPrimaries = contacts.filter(
      (c) => c.linkPrecedence === "primary" && c.id !== truePrimaryId,
    );

    for (const contact of otherPrimaries) {
      await this.contactRepo.updateToSecondary(contact.id, truePrimaryId);
    }
  }

  private buildResponse(contacts: Contact[]) {
    const primary = contacts.find((c) => c.linkPrecedence === "primary")!;

    const secondaryContacts = contacts.filter(
      (c) => c.linkPrecedence === "secondary",
    );

    const emails = [
      primary.email,
      ...secondaryContacts.map((c) => c.email),
    ].filter(Boolean) as string[];

    const phoneNumbers = [
      primary.phoneNumber,
      ...secondaryContacts.map((c) => c.phoneNumber),
    ].filter(Boolean) as string[];

    return {
      contact: {
        primaryContactId: primary.id,
        emails: [...new Set(emails)],
        phoneNumbers: [...new Set(phoneNumbers)],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };
  }
}
