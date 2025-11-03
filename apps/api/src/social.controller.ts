import { Controller, Get, Query } from "@nestjs/common";
import { SocialService } from "./social.service";

@Controller("/api/social")
export class SocialController {
  constructor(private readonly service: SocialService) {}

  @Get("hourly")
  async hourly(@Query() q: Record<string, any>) {
    return this.service.hourly(q);
  }
}
