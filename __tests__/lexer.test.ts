import Lexer from "../lexer";
import { TOKENS } from "../token";

test("nextToken()", () => {
  const input = "=+(){},;-!*/<>";
  const lexer = new Lexer(input);

  const tokens = [
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.PLUS, literal: "+" },
    { type: TOKENS.LPAREN, literal: "(" },
    { type: TOKENS.RPAREN, literal: ")" },
    { type: TOKENS.LBRACE, literal: "{" },
    { type: TOKENS.RBRACE, literal: "}" },
    { type: TOKENS.COMMA, literal: "," },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.MINUS, literal: "-" },
    { type: TOKENS.BANG, literal: "!" },
    { type: TOKENS.ASTERISK, literal: "*" },
    { type: TOKENS.SLASH, literal: "/" },
    { type: TOKENS.LT, literal: "<" },
    { type: TOKENS.GT, literal: ">" },
  ];

  for (const token of tokens) {
    const nextToken = lexer.nextToken();
    expect(nextToken).toEqual(token);
  }
});

test("nextToken() with keywords", () => {
  const input = "let five = 5;";
  const lexer = new Lexer(input);

  const tokens = [
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "five" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.SEMICOLON, literal: ";" },
  ];

  for (const token of tokens) {
    const nextToken = lexer.nextToken();
    expect(nextToken).toEqual(token);
  }
});

test("nextToken() with keywords and whitespace", () => {
  const input = "let five = 5; let ten = 10;";

  const lexer = new Lexer(input);

  const tokens = [
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "five" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "ten" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.SEMICOLON, literal: ";" },
  ];

  for (const token of tokens) {
    const nextToken = lexer.nextToken();

    expect(nextToken).toEqual(token);
  }
});

test("nextToken() with keywords and whitespace 2", () => {
  const input = `let five = 5;
  let ten = 10;

  let add = fn(x, y) {
    x + y;
  };

  let result = add(five, ten);

  !-/*5;

  5 < 10 > 5

  if (5 < 10) {
    return true;
  } else {
    return false;
  }

  10 == 10
  10 != 10
  `;

  const lexer = new Lexer(input);

  const tokens = [
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "five" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "ten" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "add" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.FUNCTION, literal: "fn" },
    { type: TOKENS.LPAREN, literal: "(" },
    { type: TOKENS.IDENT, literal: "x" },
    { type: TOKENS.COMMA, literal: "," },
    { type: TOKENS.IDENT, literal: "y" },
    { type: TOKENS.RPAREN, literal: ")" },
    { type: TOKENS.LBRACE, literal: "{" },
    { type: TOKENS.IDENT, literal: "x" },
    { type: TOKENS.PLUS, literal: "+" },
    { type: TOKENS.IDENT, literal: "y" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.RBRACE, literal: "}" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.LET, literal: "let" },
    { type: TOKENS.IDENT, literal: "result" },
    { type: TOKENS.ASSIGN, literal: "=" },
    { type: TOKENS.IDENT, literal: "add" },
    { type: TOKENS.LPAREN, literal: "(" },
    { type: TOKENS.IDENT, literal: "five" },
    { type: TOKENS.COMMA, literal: "," },
    { type: TOKENS.IDENT, literal: "ten" },
    { type: TOKENS.RPAREN, literal: ")" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.BANG, literal: "!" },
    { type: TOKENS.MINUS, literal: "-" },
    { type: TOKENS.SLASH, literal: "/" },
    { type: TOKENS.ASTERISK, literal: "*" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.LT, literal: "<" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.GT, literal: ">" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.IF, literal: "if" },
    { type: TOKENS.LPAREN, literal: "(" },
    { type: TOKENS.INT, literal: "5" },
    { type: TOKENS.LT, literal: "<" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.RPAREN, literal: ")" },
    { type: TOKENS.LBRACE, literal: "{" },
    { type: TOKENS.RETURN, literal: "return" },
    { type: TOKENS.TRUE, literal: "true" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.RBRACE, literal: "}" },
    { type: TOKENS.ELSE, literal: "else" },
    { type: TOKENS.LBRACE, literal: "{" },
    { type: TOKENS.RETURN, literal: "return" },
    { type: TOKENS.FALSE, literal: "false" },
    { type: TOKENS.SEMICOLON, literal: ";" },
    { type: TOKENS.RBRACE, literal: "}" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.EQ, literal: "==" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.INT, literal: "10" },
    { type: TOKENS.NOT_EQ, literal: "!=" },
    { type: TOKENS.INT, literal: "10" },
  ];

  for (const token of tokens) {
    const nextToken = lexer.nextToken();
    expect(nextToken).toEqual(token);
  }
});
