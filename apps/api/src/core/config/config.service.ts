import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  get clickhouseUrl(): string {
    return process.env.CLICKHOUSE_URL ?? "http://localhost:8123";
  }
  get apiPort(): number {
    return Number(process.env.API_PORT ?? "3001");
  }
}
