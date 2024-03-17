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
  name?: Identifier;
  value?: Expression | null;
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

export class LetStatement implements TLetStatement, Statement {
  token: Token;
  name: Identifier | undefined;
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
}

export default function newIdentifier(token: Token, value: string): Identifier {
  return {
    token: token.type as TOKENS.IDENT,
    value,
  };
}
