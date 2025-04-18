import { evaluateCondition } from './condition-evaluator';

describe('evaluateCondition', () => {
  const context = {
    account: {
      tenantId: 'tenant-001',
      username: 'john.doe',
    },
  };

  it('should pass stringEquals condition', () => {
    const condition = {
      stringEquals: {
        'account:tenantId': 'tenant-001',
      },
    };

    expect(evaluateCondition(condition, context)).toBe(true);
  });

  it('should fail stringEquals condition', () => {
    const condition = {
      stringEquals: {
        'account:tenantId': 'wrong-tenant',
      },
    };

    expect(evaluateCondition(condition, context)).toBe(false);
  });

  it('should pass stringLike condition', () => {
    const condition = {
      stringLike: {
        'account:username': 'john*',
      },
    };

    expect(evaluateCondition(condition, context)).toBe(true);
  });

  it('should fail stringLike condition', () => {
    const condition = {
      stringLike: {
        'account:username': 'admin*',
      },
    };

    expect(evaluateCondition(condition, context)).toBe(false);
  });

  it('should return false if operator is unknown', () => {
    const condition = {
      unknownOp: {
        'account:username': 'value',
      },
    };

    expect(evaluateCondition(condition, context)).toBe(false);
  });

  it('should return true for empty condition', () => {
    expect(evaluateCondition({}, context)).toBe(true);
  });
});
