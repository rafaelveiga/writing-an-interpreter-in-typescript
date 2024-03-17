import {
  KEYWORDS,
  TOKENS,
  Token,
  createToken,
  lookupIdentifier,
} from "./token";

export default class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private ch: string;
  private input: string;

  constructor(input: string) {
    this.input = input;
    this.ch = input[this.position];

    this.readChar();
  }

  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = "";
    } else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  public nextToken() {
    this.skipWhitespace();

    let token: Token | null = null;

    switch (this.ch) {
      case "=":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = createToken(TOKENS.EQ, literal);
        } else {
          token = createToken(TOKENS.ASSIGN, this.ch);
        }
        break;

      case "+":
        token = createToken(TOKENS.PLUS, this.ch);
        break;

      case "-":
        token = createToken(TOKENS.MINUS, this.ch);
        break;

      case "!":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = createToken(TOKENS.NOT_EQ, literal);
        } else {
          token = createToken(TOKENS.BANG, this.ch);
        }
        break;

      case "*":
        token = createToken(TOKENS.ASTERISK, this.ch);
        break;

      case "/":
        token = createToken(TOKENS.SLASH, this.ch);
        break;

      case "<":
        token = createToken(TOKENS.LT, this.ch);
        break;

      case ">":
        token = createToken(TOKENS.GT, this.ch);
        break;

      case ";":
        token = createToken(TOKENS.SEMICOLON, this.ch);
        break;

      case ",":
        token = createToken(TOKENS.COMMA, this.ch);
        break;

      case "(":
        token = createToken(TOKENS.LPAREN, this.ch);
        break;

      case ")":
        token = createToken(TOKENS.RPAREN, this.ch);
        break;

      case "{":
        token = createToken(TOKENS.LBRACE, this.ch);
        break;

      case "}":
        token = createToken(TOKENS.RBRACE, this.ch);
        break;

      case "":
        token = createToken(TOKENS.EOF, "");
        break;

      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = lookupIdentifier(literal as keyof typeof KEYWORDS);
          return createToken(type, literal);
        } else if (this.isDigit(this.ch)) {
          return createToken(TOKENS.INT, this.readNumber());
        } else {
          return createToken(TOKENS.ILLEGAL, this.ch);
        }
    }

    this.readChar();

    return token;
  }

  private skipWhitespace(): void {
    while (
      this.ch === " " ||
      this.ch === "\n" ||
      this.ch === "\t" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "";
    } else {
      return this.input[this.readPosition];
    }
  }

  private isLetter(ch: string): boolean {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
  }

  private isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }

  private readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.position);
  }

  private readNumber(): string {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.position);
  }
}
