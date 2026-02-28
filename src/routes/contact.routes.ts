import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { validate } from "../middlewares/validate.middleware";
import { identifySchema } from "../validators/contact.validator";
import { identifyRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();
const contactController = new ContactController();

router.post("/identify",identifyRateLimiter, validate(identifySchema), contactController.identify);

export default router;
