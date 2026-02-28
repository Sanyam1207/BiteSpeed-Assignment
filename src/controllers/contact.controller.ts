import { Request, Response, NextFunction } from "express";
import { ContactService } from "../service/contact.service";

export class ContactController {
  private contactService = new ContactService();

  identify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, phoneNumber } = req.body;

      // At least one should exist
      if (!email && !phoneNumber) {
        return res.status(400).json({
          message: "Either email or phoneNumber must be provided"
        });
      }

      const result = await this.contactService.identify(
        email,
        phoneNumber
      );

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  };
}