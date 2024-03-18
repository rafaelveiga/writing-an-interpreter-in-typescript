import { Token } from "./token";

// ==================================================================
// Types
// ==================================================================
export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export type Expression = IntegerLiteral | Identifier;

export type TLetStatement = {
  token: Token;
  name?: TIdentifier;
  value?: Expression;
};

export type TReturnStatement = {
  token: Token;
  value?: Expression;
};

export type TExpressionStatement = {
  token: Token;
  value?: Expression;
};

export type TIdentifier = {
  token: Token;
  value: string;
  string(): string;
};

export type TIntegerLiteral = {
  token: Token;
  value: number;
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

export class LetStatement implements TLetStatement {
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

export class ReturnStatement implements TReturnStatement {
  token: Token;
  value: Expression | undefined;

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
    return `${this.tokenLiteral()} ${this.value?.string()};`;
  }
}

export class ExpressionStatement implements TExpressionStatement {
  token: Token;
  value?: Expression;

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
    return this.value?.string() || "undefined";
  }
}

export class IntegerLiteral implements TIntegerLiteral {
  token: Token;
  value: number;

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return this.token.literal;
  }
}

export class Identifier implements TIdentifier {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  string(): string {
    return this.value;
  }
}
