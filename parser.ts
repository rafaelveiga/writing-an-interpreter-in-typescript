import { LetStatement, Program, ReturnStatement, newIdentifier } from "./ast";
import Lexer from "./lexer";
import { TOKENS, Token } from "./token";

export class Parser {
  l: Lexer;
  curToken: Token | null = null;
  peekToken: Token | null = null;
  errors: string[] = [];

  constructor(l: Lexer, errors: string[] = []) {
    this.l = l;
    this.errors = errors;

    this.nextToken();
    this.nextToken();
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

  parseStatement(): LetStatement | ReturnStatement | null {
    switch (this.curToken?.type) {
      case TOKENS.LET:
        return this.parseLetStatement();
      case TOKENS.RETURN:
        return this.parseReturnStatement();
      default:
        return null;
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

    stmt.name = newIdentifier(
      this.curToken as Token,
      this.curToken?.literal as string
    );

    if (!this.expectPeek(TOKENS.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TOKENS.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement | null {
    const stmt = new ReturnStatement(this.curToken as Token);

    this.nextToken();

    while (!this.curTokenIs(TOKENS.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

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
}

// const l = new Lexer(`
// let x = 5;
// let y = 10;
// let foobar = 838383;
// return 5;
// return 10;
// `);

// const p = new Parser(l);

// const program = p.parseProgram();
// console.log(program.string());

// console.log(program);
