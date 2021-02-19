import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ValidateDto implements PipeTransform<any> {

  /**
   * validate argument
   */
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  /**
   * transform
   *
   * @param value
   * @param param ArgumentMetadata
   */
  async transform(value, { metatype }: ArgumentMetadata) {
    const list: string[] = [];
    if (!metatype || !this.toValidate(metatype)) return value;

    const validationError = await validate(plainToClass(metatype, value));
    if (!validationError.length) return value;

    validationError.forEach((item) => {
      Object.values(item.constraints).forEach((text) => list.push(text));
    });

    throw new UnprocessableEntityException([...new Set(list)].join(', '));
  }
}
