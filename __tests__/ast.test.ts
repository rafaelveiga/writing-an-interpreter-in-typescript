import { LetStatement, Program } from "../ast";
import Lexer from "../lexer";
import { Parser } from "../parser";
import { TOKENS } from "../token";

test("Test String", () => {
  // const l = new Lexer(`let x = 5;`);
  // const parser = new Parser(l);

  // const program = parser.parseProgram();

  // expect(program.string()).toBe("let x = 5;");

  const program = new Program([
    new LetStatement(
      {
        type: TOKENS.LET,
        literal: "let",
      },
      {
        token: TOKENS.IDENT,
        value: "x",
        string: () => "x",
      },
      {
        token: TOKENS.IDENT,
        value: "5",
        string: () => "5",
      }
    ),
  ]);

  console.log(program.string());
});
