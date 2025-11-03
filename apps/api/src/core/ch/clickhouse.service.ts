import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { createClient, ClickHouseClient } from "@clickhouse/client";
import { ConfigService } from "../config/config.service.js";

@Injectable()
export class ClickhouseService implements OnModuleDestroy {
  private client: ClickHouseClient;

  constructor(cfg: ConfigService) {
    this.client = createClient({ url: cfg.clickhouseUrl });
  }

  get ch() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
