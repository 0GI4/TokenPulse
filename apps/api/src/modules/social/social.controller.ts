import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { SocialService } from "./social.service.js";
import { HourlyQuerySchema } from "./dto/hourly.query.js";
import { ZodValidationPipe } from "../../core/zod/zod-validation.pipe.js";

@Controller("/api/social")
export class SocialController {
  constructor(private readonly svc: SocialService) {}

  @Get("hourly")
  @UsePipes(new ZodValidationPipe(HourlyQuerySchema))
  async hourly(@Query() q: unknown) {
    return this.svc.hourly(q as any);
  }
}
