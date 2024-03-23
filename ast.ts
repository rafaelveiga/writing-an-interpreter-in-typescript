import { Token } from "./token";

// ==================================================================
// Types
// ==================================================================
// Shared properties of all nodes of our AST tree
export type Node = {
  tokenLiteral(): string;
  string(): string;
  expressionNode?(): Expression;
  statementNode?(): Statement;
};

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export type Expression =
  | IntegerLiteral
  | Identifier
  | PrefixExpression
  | InfixExpression;

// Statements
export type TLetStatement = {
  token: Token;
  name?: TIdentifier;
  value?: Expression;
} & Node;

export type TReturnStatement = {
  token: Token;
  value?: Expression;
} & Node;

export type TExpressionStatement = {
  token: Token;
  value?: Expression;
} & Node;

export type TBlockStatement = {
  token: Token;
  statements: Statement[];
} & Node;

// Expressions
export type TIdentifier = {
  token: Token; // The TOKENS.IDENT token
  value: string;
} & Node;

export type TIntegerLiteral = {
  token: Token; // The TOKENS.INT token
  value: number;
} & Node;

export type TPrefixExpression = {
  token: Token; // The prefix token, e.g. TOKENS.BANG or TOKENS.MINUS
  operator: string;
  right?: Expression;
} & Node;

export type TInfixExpression = {
  token: Token; // The infix token, e.g. TOKENS.PLUS, TOKENS.MINUS, etc.
  left?: Expression;
  operator?: string;
  right?: Expression;
} & Node;

export type TBooleanExpression = {
  token: Token;
  value: boolean;
} & Node;

export type TIfExpression = {
  token: Token;
  condition?: Expression;
  consequence?: TBlockStatement;
  alternative?: TBlockStatement;
} & Node;

// Program
type TProgram = {
  statements: Statement[];
} & Node;

// ==================================================================
// Program
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

// ==================================================================
// Statements
// ==================================================================
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

export class BlockStatement implements TBlockStatement {
  token: Token;
  statements: Statement[];

  constructor(token: Token, statements: Statement[]) {
    this.token = token;
    this.statements = statements;
  }

  statementNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return this.statements.map((s) => s.string()).join("");
  }
}

// ==================================================================
// Expressions
// ==================================================================
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

export class PrefixExpression implements TPrefixExpression {
  token: Token;
  operator: string;
  right?: Expression;

  constructor(token: Token, operator: string, right?: Expression) {
    this.token = token;
    this.operator = operator;
  }

  expressionNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return `(${this.operator}${this.right?.string()})`;
  }
}

export class InfixExpression implements TInfixExpression {
  token: Token;
  left?: Expression;
  operator?: string;
  right?: Expression;

  constructor(
    token: Token,
    left?: Expression,
    operator?: string,
    right?: Expression
  ) {
    this.token = token;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return `(${this.left?.string()} ${this.operator} ${this.right?.string()})`;
  }
}

export class BooleanExpression implements TBooleanExpression {
  token: Token;
  value: boolean;

  constructor(token: Token, value: boolean) {
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

export class IfExpression implements TIfExpression {
  token: Token;
  condition?: Expression;
  consequence?: TBlockStatement;
  alternative?: TBlockStatement;

  constructor(
    token: Token,
    condition?: Expression,
    consequence?: TBlockStatement,
    alternative?: TBlockStatement
  ) {
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  expressionNode() {
    return this;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  string(): string {
    return `if ${this.condition?.string()} ${this.consequence?.string()} ${
      this.alternative ? `else ${this.alternative.string()}` : ""
    }`;
  }
}
