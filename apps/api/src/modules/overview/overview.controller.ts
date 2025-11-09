import { Controller, Get, Query } from "@nestjs/common";
import { OverviewService } from "./overview.service.js";

@Controller("api/overview")
export class OverviewController {
  constructor(private svc: OverviewService) {}

  @Get()
  async get(@Query("limit") limit?: string) {
    const n = Math.max(1, Math.min(Number(limit) || 10, 100));
    return this.svc.overview(n);
  }
}
