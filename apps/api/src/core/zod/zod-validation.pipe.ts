import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const res = this.schema.safeParse(value);
    if (!res.success) {
      throw new BadRequestException(res.error.flatten());
    }
    return res.data;
  }
}
