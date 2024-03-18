import { TOKENS, Token } from "./token";

// ==================================================================
// Types
// ==================================================================
export type Node = {
  tokenLiteral(): string;
  string(): string;
};

export interface Statement extends Node {
  statementNode(): Node;
}

export interface Expression extends Node {
  expressionNode(): Node;
}

export type TLetStatement = {
  token: Token;
  name?: Identifier;
  value?: Expression | Identifier | null;
};

export type TReturnStatement = {
  token: Token;
  returnValue?: Expression | null;
};

export type TExpressionStatement = {
  token: Token;
  expression: Expression;
};

export type Identifier = {
  token: TOKENS.IDENT;
  value: string;
  string(): string;
};

type TProgram = {
  statements: Statement[];
};

// ==================================================================
// Creators
// ==================================================================
export class Program implements TProgram {
  statements: Statement[] = [];

  constructor(statements: Statement[]) {
    this.statements = statements;
  }

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  string(): string {
    return this.statements.map((s) => s.string()).join("");
  }
}

export class LetStatement implements TLetStatement, Statement {
  token: Token;
  name: Identifier | undefined;
  value: Identifier | Expression | undefined;

  constructor(
    token: Token,
    name?: Identifier,
    value?: Identifier | Expression
  ) {
    this.token = token;
    if (name) this.name = name;
    if (value) this.value = value;
  }

  statementNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return `${this.tokenLiteral()} ${
      this.name?.value
    } = ${this.value?.string()};`;
  }
}

export class ReturnStatement implements TReturnStatement, Statement {
  token: Token;
  returnValue: Expression | undefined;

  constructor(token: Token) {
    this.token = token;
  }

  statementNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return `${this.tokenLiteral()} ${this.returnValue?.string()};`;
  }
}

export class ExpressionStatement implements TExpressionStatement, Statement {
  token: Token;
  expression: Expression;

  constructor(token: Token, expression: Expression) {
    this.token = token;
    this.expression = expression;
  }

  statementNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return this.expression.string();
  }
}

export function newIdentifier(token: Token, value: string): Identifier {
  return {
    token: token.type as TOKENS.IDENT,
    value,
    string() {
      return this.value;
    },
  };
}
