import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountService } from '../../account/account.service';
import { CHECK_POLICY_KEY, PolicyMetadata } from '../../shared/decorators/check-policy.decorator';
import { PolicyDto } from '../../account/dto';

@Injectable()
export class PolicyGuard implements CanActivate {
  logger = new Logger(PolicyGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { action, resource } = this.reflector.get<PolicyMetadata>(CHECK_POLICY_KEY, context.getHandler()) || {
      action: '*',
      resource: '*',
    };

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user?.accountId) throw new ForbiddenException('Unauthorized');

    const account = await this.accountService.getAccountWithDetails(user.accountId);
    if (!account) throw new ForbiddenException('Account not found');

    const allPolicies = [...(account.policies || []), ...account.roles.flatMap(role => role.policies || [])];
    this.logger.log({ policies: allPolicies }, 'Policies');

    const allowed = this.evaluatePolicies(allPolicies, action, resource, {
      user,
      req,
    });

    if (!allowed) throw new ForbiddenException('Access denied by policy');

    return true;
  }

  private evaluatePolicies(
    policies: PolicyDto[],
    action: string,
    resource: string,
    context: Record<string, any> = {},
  ): boolean {
    const statements = policies.flatMap(p => p.statements || []);

    const matchAction = (ruleAction: string) =>
      ruleAction === '*' || action === ruleAction || action.startsWith(ruleAction.replace('*', ''));

    const matchResource = (ruleRes: string) =>
      ruleRes === '*' || resource === ruleRes || resource.startsWith(ruleRes.replace('*', ''));

    for (const stmt of statements) {
      if (stmt.effect === 'deny' && stmt.action.some(matchAction) && stmt.resource.some(matchResource)) {
        return false;
      }
    }

    for (const stmt of statements) {
      if (stmt.effect === 'allow' && stmt.action.some(matchAction) && stmt.resource.some(matchResource)) {
        if (!stmt.condition) return true;
        if (this.evaluateCondition(stmt.condition, context)) return true;
      }
    }

    return false;
  }

  private evaluateCondition(condition: Record<string, Record<string, string>>, context: Record<string, any>): boolean {
    const checks: Record<string, (key: string, value: string) => boolean> = {
      stringEquals: (key, value) => this.getContextValue(context, key) === value,
      stringLike: (key, pattern) =>
        new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(this.getContextValue(context, key)),
    };

    for (const op in condition) {
      const expressions = condition[op];
      for (const key in expressions) {
        const expected = expressions[key];
        const checkFn = checks[op];
        if (!checkFn || !checkFn(key, expected)) {
          return false;
        }
      }
    }

    return true;
  }

  private getContextValue(context: any, path: string): any {
    return path.split(':').reduce((val, part) => val?.[part], context);
  }
}
