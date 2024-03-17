import { TOKENS, Token } from "./token";

export type Node = {
  tokenLiteral(): string;
};

export interface Statement extends Node {
  statementNode(): Node;
}

export interface Expression extends Node {
  expressionNode(): Node;
}

export type TLetStatement = {
  token: Token;
  name: Identifier;
  value: Expression;
};

export type Identifier = {
  token: TOKENS.IDENT;
  value: string;
};

type TProgram = {
  statements: Statement[];
};

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
}

export class LetStatement implements TLetStatement, Node {
  token: Token;
  name: Identifier;
  value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode() {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}
