import { Module } from "@nestjs/common";
import { ConfigModule } from "./core/config/config.module.js";
import { ClickhouseModule } from "./core/ch/clickhouse.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { SocialModule } from "./modules/social/social.module.js";
import { OverviewModule } from "./modules/overview/overview.module.js";

@Module({
  imports: [
    ConfigModule,
    ClickhouseModule,
    HealthModule,
    SocialModule,
    OverviewModule,
  ],
})
export class AppModule {}
