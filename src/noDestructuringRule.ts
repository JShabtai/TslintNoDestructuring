import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'No destructuring in function signatures';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDestructuringWalker(sourceFile, this.getOptions()));
    }
}

/**
 * Add a failure anywhere destructuring is used
 *
 * Currently only checks arrow function and regular function parameters
 */
class NoDestructuringWalker extends Lint.RuleWalker {
    protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.checkFunction(node);

        super.visitFunctionDeclaration(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction) {
        this.checkFunction(node);

        super.visitArrowFunction(node);
    }

    /**
     * Check a function to see if destructuring was used in the parameter list
     */
    private checkFunction(node: ts.ArrowFunction | ts.FunctionDeclaration) {
        for (let parameter of node.parameters) {
            if (parameter.name.kind === ts.SyntaxKind.ObjectBindingPattern ||
                parameter.name.kind === ts.SyntaxKind.ArrayBindingPattern) {
                this.addFailure(
                    this.createFailure(
                        parameter.getStart(),
                        parameter.getWidth(),
                        Rule.FAILURE_STRING
                    )
                );
            }
        }
    }
}

