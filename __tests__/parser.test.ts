import { LetStatement, Statement } from "../ast";
import Lexer from "../lexer";
import { Parser } from "../parser";

test("Let Statements", () => {
  const input = "let x = 5; let y = 10; let foobar = 838383;";

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  const program = parser.parseProgram();

  const errors = parser.getErrors();

  expect(program).not.toBeNull();

  if (errors.length > 0) {
    console.log("parser has errors");
    errors.forEach((err) => console.log(err));
  }

  expect(errors.length).toBe(0);

  if (program !== null) {
    expect(program.statements.length).toBe(3);
  }

  const expected = ["x", "y", "foobar"];

  if (program !== null) {
    program.statements.forEach((stmt: Statement, i: number) => {
      expect(stmt.tokenLiteral()).toBe("let");

      const stmtNode = stmt.statementNode() as LetStatement;
      expect(stmtNode.name?.value).toBe(expected[i]);
    });
  }
});

test("Return Statements", () => {
  const input = `
  return 5;
  return 10;
  return 993322;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  const program = parser.parseProgram();

  const errors = parser.getErrors();

  expect(program).not.toBeNull();

  if (errors.length > 0) {
    console.log("parser has errors");
    errors.forEach((err) => console.log(err));
  }

  expect(errors.length).toBe(0);

  if (program !== null) {
    expect(program.statements.length).toBe(3);
  }

  if (program !== null) {
    program.statements.forEach((stmt: Statement) => {
      expect(stmt.tokenLiteral()).toBe("return");
    });
  }
});
