import { Module } from "@nestjs/common";
import { ConfigModule } from "./core/config/config.module";
import { ClickhouseModule } from "./core/ch/clickhouse.module";
import { HealthModule } from "./modules/health/health.module";
import { SocialModule } from "./modules/social/social.module";

@Module({
  imports: [ConfigModule, ClickhouseModule, HealthModule, SocialModule],
})
export class AppModule {}
