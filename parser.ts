import newIdentifier, { LetStatement, Program, Statement } from "./ast";
import Lexer from "./lexer";
import { TOKENS, Token } from "./token";

export class Parser {
  l: Lexer;
  curToken: Token | null = null;
  peekToken: Token | null = null;

  constructor(l: Lexer) {
    this.l = l;

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram(): Program {
    const program = new Program([]);

    while (this.curToken?.type !== TOKENS.EOF) {
      const statement = this.parseStatement();

      if (statement) {
        program.statements.push(statement);
      }

      this.nextToken();
    }

    return program;
  }

  parseStatement(): LetStatement | null {
    switch (this.curToken?.type) {
      case TOKENS.LET:
        console.log("let");
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): LetStatement | null {
    // Init a new LetStatement with the current token
    const stmt = new LetStatement(this.curToken as Token);

    // Check if the next token is an identifier
    // If its not, return null
    if (!this.expectPeek(TOKENS.IDENT)) {
      return null;
    }

    // Set the name of the LetStatement to the current token
    // which should be an identifier (x, y, foobar, etc.)
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
      return false;
    }
  }
}

// const l = new Lexer(`
// let x = 5;
// let y = 10;
// let foobar = 838383;
// `);

// const p = new Parser(l);

// const program = p.parseProgram();

// console.log(program.statements);
