import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async health(): Promise<string> {
    return 'I\'m Health';
  }
}
