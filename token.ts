export enum TOKENS {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  IDENT = "IDENT", // add, foobar, x, y, ...
  INT = "INT", // 123456

  // Operators
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  EQ = "==",
  NOT_EQ = "!=",

  // Delimiters
  COMMA = ",",
  SEMICOLON = ";",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  // Keywords
  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
}

export const KEYWORDS = {
  fn: TOKENS.FUNCTION,
  let: TOKENS.LET,
  true: TOKENS.TRUE,
  false: TOKENS.FALSE,
  if: TOKENS.IF,
  else: TOKENS.ELSE,
  return: TOKENS.RETURN,
} as const;

export type Token = {
  type: TOKENS;
  literal: string;
};

export function createToken(type: TOKENS, literal: string): Token {
  return { type, literal };
}

export function lookupIdentifier(identifier: keyof typeof KEYWORDS): TOKENS {
  return KEYWORDS[identifier] || TOKENS.IDENT;
}
