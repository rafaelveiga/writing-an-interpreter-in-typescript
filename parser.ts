import {
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  LetStatement,
  Program,
  ReturnStatement,
} from "./ast";
import Lexer from "./lexer";
import { TOKENS, Token } from "./token";

enum PRECEDENCE {
  LOWEST = 0,
  EQUALS = 1, // ==
  LESSGREATER = 2, // > or <
  SUM = 3, // +
  PRODUCT = 4, // *
  PREFIX = 5, // -X or !X
  CALL = 6, // myFunction(X)
}

export class Parser {
  l: Lexer;
  errors: string[] = [];

  curToken: Token | null = null;
  peekToken: Token | null = null;

  prefixParseFns: { [key: string]: Function } = {};
  infixParseFns: { [key: string]: Function } = {};

  constructor(l: Lexer, errors: string[] = []) {
    this.l = l;
    this.errors = errors;

    this.nextToken();
    this.nextToken();

    this.registerPrefix(TOKENS.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TOKENS.INT, this.parseIntegerLiteral.bind(this));
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram(): Program {
    const program = new Program([]);

    while (!this.curTokenIs(TOKENS.EOF)) {
      const statement = this.parseStatement();

      if (statement) {
        program.statements.push(statement);
      }

      this.nextToken();
    }

    return program;
  }

  parseStatement():
    | LetStatement
    | ReturnStatement
    | ExpressionStatement
    | null {
    switch (this.curToken?.type) {
      case TOKENS.LET:
        return this.parseLetStatement();
      case TOKENS.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  /**
   * 1. We construct a letStatement if the current token matches the LET token in the switch above, which means that
   * the current token that we are sitting (this.curToken) is a LET token.
   * 2. We then keep advancing through tokens until we find an IDENT token sitting at the next position (this.peekToken).
   * `let x` = `<LET_TOKEN> <IDENT_TOKEN>`
   * 3. If we find a IDENT token in the next position, we construct a Identifier and assign to the `name` key in LetStatement.
   * 4. We then keep advancing through tokens until we find an ASSIGN token sitting at the next position (this.peekToken).
   * 5. This means that right after the assign token, comes the Expression that we want to assign to the value of the LetStatement
   */
  parseLetStatement(): LetStatement | null {
    const stmt = new LetStatement(this.curToken as Token);

    if (!this.expectPeek(TOKENS.IDENT)) {
      return null;
    }

    stmt.name = new Identifier(
      this.curToken as Token,
      this.curToken?.literal as string
    );

    if (!this.expectPeek(TOKENS.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TOKENS.SEMICOLON)) {
      stmt.value = this.parseExpression(PRECEDENCE.LOWEST);
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement | null {
    const stmt = new ReturnStatement(this.curToken as Token);

    this.nextToken();

    while (!this.curTokenIs(TOKENS.SEMICOLON)) {
      stmt.value = this.parseExpression(PRECEDENCE.LOWEST);
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken as Token);

    stmt.value = this.parseExpression(PRECEDENCE.LOWEST);

    if (this.peekTokenIs(TOKENS.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence: number): any {
    if (!this.curToken) return;

    const prefix = this.prefixParseFns[this.curToken?.type];

    if (!prefix) {
      return null;
    }

    let leftExp = prefix();

    return leftExp;
  }

  parseIdentifier(): Identifier {
    return new Identifier(
      this.curToken as Token,
      this.curToken?.literal as string
    );
  }

  parseIntegerLiteral(): IntegerLiteral | null {
    const lit = new IntegerLiteral(this.curToken as Token, 0);

    const value = parseInt(this.curToken?.literal as string);

    if (isNaN(value)) {
      this.errors.push(`could not parse ${this.curToken?.literal} as integer`);
      return null;
    }

    lit.value = value;

    return lit;
  }

  // ==========================================
  // ============ HELPER METHODS =============
  // ==========================================
  curTokenIs(t: TOKENS): boolean {
    return this.curToken?.type === t;
  }

  peekTokenIs(t: TOKENS): boolean {
    return this.peekToken?.type === t;
  }

  expectPeek(t: TOKENS): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t: TOKENS) {
    const msg = `expected next token to be ${t}, got ${this.peekToken?.type} instead`;
    this.errors.push(msg);
  }

  getErrors(): string[] {
    return this.errors;
  }

  registerPrefix(tokenType: TOKENS, fn: Function) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TOKENS, fn: Function) {
    this.infixParseFns[tokenType] = fn;
  }
}

const l = new Lexer(`
let foobar = 5;
foobar;
return foobar;
5;
`);

const p = new Parser(l);

const program = p.parseProgram();
console.log(program.string());

console.log(program.statements);
