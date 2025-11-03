import { Injectable } from "@nestjs/common";
import { ClickhouseService } from "../../core/ch/clickhouse.service";

@Injectable()
export class HealthService {
  constructor(private chs: ClickhouseService) {}

  async check() {
    const pong = await this.chs.ch.ping();
    return { ok: true, clickhouse: pong.success };
  }
}
