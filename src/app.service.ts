import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HealthIndicatorResult,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class AppService {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mongooseHealthIndicator: MongooseHealthIndicator,
  ) {}

  health() {
    return this.healthCheckService.check([
      (): HealthIndicatorResult => ({
        ['app']: { status: 'up' },
      }),
      () => this.mongooseHealthIndicator.pingCheck('database'),
    ]);
  }
}
