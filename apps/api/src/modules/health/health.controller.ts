import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service.js";

@Controller("/api/health")
export class HealthController {
  constructor(private readonly svc: HealthService) {}

  @Get()
  async check() {
    return this.svc.check();
  }
}
