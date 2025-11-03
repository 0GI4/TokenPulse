import { Module } from "@nestjs/common";
import { ClickhouseService } from "./clickhouse.service";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule],
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickhouseModule {}
