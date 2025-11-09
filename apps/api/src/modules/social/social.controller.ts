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

  @Get("hourly-multi")
  async hourlyMulti(
    @Query("tokens") tokens?: string,
    @Query("from") from?: string,
    @Query("to") to?: string
  ) {
    const list = (tokens || "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
      .slice(0, 20);
    return this.svc.hourlyMulti(list, from, to);
  }
}
