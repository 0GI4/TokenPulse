import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";
import { HealthService } from "./health.service.js";
import { ClickhouseModule } from "../../core/ch/clickhouse.module.js";

@Module({
  imports: [ClickhouseModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
