import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountService } from '../account/account.service';
import { evaluatePolicies } from './policy-evaluator';
import { CHECK_POLICY_KEY, PolicyMetadata } from '../shared/decorators/check-policy.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  logger = new Logger(PoliciesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { action, resource } = this.reflector.get<PolicyMetadata>(CHECK_POLICY_KEY, context.getHandler()) || {
      action: '*',
      resource: '*',
    };

    this.logger.log({ action, resource }, 'Action and Resource');
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user?.accountId) throw new ForbiddenException('Unauthorized');

    const account = await this.accountService.getAccountWithDetails(user.accountId);
    if (!account) throw new ForbiddenException('Account not found');

    const allPolicies = [...(account.policies || []), ...account.roles.flatMap(role => role.policies || [])];
    this.logger.log({ policies: allPolicies }, 'Policies');
    const allowed = evaluatePolicies(allPolicies, action, resource, {
      user,
      req,
    });
    if (!allowed) throw new ForbiddenException('Access denied by policy');

    return true;
  }
}
