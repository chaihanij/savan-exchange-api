import { evaluateCondition } from './condition-evaluator';
import { PolicyDto } from '../account/dto';

export function evaluatePolicies(
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
      if (evaluateCondition(stmt.condition, context)) return true;
    }
  }

  return false;
}
