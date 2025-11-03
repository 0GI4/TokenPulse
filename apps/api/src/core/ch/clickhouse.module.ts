import { Module } from "@nestjs/common";
import { ClickhouseService } from "./clickhouse.service.js";
import { ConfigModule } from "../config/config.module.js";

@Module({
  imports: [ConfigModule],
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickhouseModule {}
