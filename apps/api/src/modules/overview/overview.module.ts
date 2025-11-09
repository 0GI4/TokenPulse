import { Module } from "@nestjs/common";
import { OverviewController } from "./overview.controller.js";
import { OverviewService } from "./overview.service.js";
import { ClickhouseModule } from "../../core/ch/clickhouse.module.js";

@Module({
  imports: [ClickhouseModule],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
