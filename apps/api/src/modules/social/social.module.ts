import { Module } from "@nestjs/common";
import { SocialController } from "./social.controller.js";
import { SocialService } from "./social.service.js";
import { ClickhouseModule } from "../../core/ch/clickhouse.module.js";

@Module({
  imports: [ClickhouseModule],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
