import CypherPrimitive, {
    Clause,
    Expr,
    ProjectionColumn,
    Variable,
} from "@neo4j/cypher-builder";
import { MatchClausePattern } from "node_modules/@neo4j/cypher-builder/dist/clauses/Match";
import { WithProjection } from "node_modules/@neo4j/cypher-builder/dist/clauses/With";
import { PropertyConstraint } from "@/types";

/**
 * # Facade for building Cypher queries.
 */
export class Cypher {
    /**
     * Builds a Cypher query using the provided callback.
     * @param callback A function that receives the Cypher builder and returns a Cypher query.
     * @returns The constructed Cypher query.
     */
    builder(callback: (cypher: typeof CypherPrimitive) => Clause): Clause {
        const cypher = CypherPrimitive;
        return callback(cypher);
    }

    /**
     * Creates a new Cypher Node instance.
     * @returns A new Cypher Node instance.
     */
    Node() {
        return new CypherPrimitive.Node();
    }

    /**
     * Creates a new Cypher Named Node instance with the specified name.
     * @param name The name of the node.
     * @returns A new Cypher Named Node instance.
     */
    NamedNode(name: string) {
        return new CypherPrimitive.NamedNode(name);
    }

    /**
     * Creates a new Cypher Relationship instance.
     * @returns A new Cypher Relationship instance.
     */
    Relationship() {
        return new CypherPrimitive.Relationship();
    }

    /**
     * Wraps a value as a Cypher parameter.
     * @param value The value to be wrapped as a Cypher parameter.
     * @returns A Cypher parameter representing the value.
     */
    Param(value: unknown) {
        return new CypherPrimitive.Param(value);
    }

    /**
     * Creates a new Cypher Variable instance.
     * @returns A new Cypher Variable instance.
     */
    Variable() {
        return new CypherPrimitive.Variable();
    }

    /**
     * Creates a new Cypher Literal instance with the specified value.
     * @param value The value to be wrapped as a Cypher literal.
     * @returns A new Cypher Literal instance.
     */
    Literal(value: CypherPrimitive.LiteralValue) {
        return new CypherPrimitive.Literal(value);
    }

    /**
     * Creates a new Cypher Named Variable instance with the specified name.
     * @param name The name of the variable.
     * @returns A new Cypher Named Variable instance.
     */
    NamedVariable(name: string) {
        return new CypherPrimitive.NamedVariable(name);
    }

    /**
     * Creates a new Cypher Return clause with the specified expressions.
     * @param expressions The expressions to be included in the Return clause.
     * @returns A new Cypher Return clause.
     */
    Return(
        ...expressions: Array<"*" | ProjectionColumn>
    ): CypherPrimitive.Return {
        return new CypherPrimitive.Return(...expressions);
    }

    /**
     * Creates a Cypher UUID instance.
     * @returns A new Cypher UUID instance.
     */
    Uuid() {
        return CypherPrimitive.randomUUID();
    }

    /**
     * Creates a Cypher Timestamp instance.
     * @returns A new Cypher Timestamp instance.
     */
    Timestamp() {
        return CypherPrimitive.timestamp();
    }

    /**
     * Concatenates multiple Cypher clauses into a single clause.
     * @param args The Cypher clauses to concatenate.
     * This method allows you to concatenate multiple Cypher clauses into a single clause.
     * It is useful for building complex queries by combining different parts of the query.
     * @returns A new Cypher clause representing the concatenated result.
     */
    concat(...args: CypherPrimitive.Clause[]) {
        return CypherPrimitive.utils.concat(...args);
    }

    /**
     * Creates a Cypher expression that checks if the given expression is null.
     * @param expr The expression to check for null.
     * @returns A Cypher expression that evaluates to true if the input is null.
     */
    notNull(expr: Expr) {
        return CypherPrimitive.isNotNull(expr);
    }

    /**
     * Creates a new Cypher Named Relationship instance with the specified name.
     * @param name The name of the relationship.
     * @returns A new Cypher Named Relationship instance.
     */
    NamedRelationship(name: string) {
        return new CypherPrimitive.NamedRelationship(name);
    }

    /**
     * Creates a new Cypher Pattern instance with the specified node configuration.
     * @param nodeConfig Optional configuration for the node pattern.
     * @returns A new Cypher Pattern instance.
     */
    Pattern(
        variable: Variable,
        nodeConfig?: CypherPrimitive.NodePatternOptions,
    ) {
        return new CypherPrimitive.Pattern(variable, nodeConfig);
    }

    /**
     * Creates a new Cypher Create clause with the specified pattern.
     * @param pattern The pattern to create in the Cypher query.
     * @returns A new Cypher Create clause.
     */
    Create(
        pattern:
            | CypherPrimitive.Pattern
            | CypherPrimitive.PathAssign<CypherPrimitive.Pattern>,
    ) {
        return new CypherPrimitive.Create(pattern);
    }

    /**
     * Creates a new Cypher Match clause with the specified pattern.
     * @param pattern The pattern to match in the Cypher query.
     * @returns A new Cypher Match clause.
     */
    Match(pattern: MatchClausePattern) {
        return new CypherPrimitive.Match(pattern);
    }

    /**
     * Creates a new Cypher Optional Match clause with the specified pattern.
     * @param pattern The pattern to match in the Cypher query.
     * @returns A new Cypher Optional Match clause.
     */
    OptionalMatch(pattern: MatchClausePattern): CypherPrimitive.OptionalMatch {
        return new CypherPrimitive.OptionalMatch(pattern);
    }

    /**
     * Creates a new Cypher With clause with the specified columns.
     * @param columns An array of columns to include in the With clause.
     * The columns can be either a wildcard `"*"` or a `WithProjection` object.
     * @returns A new Cypher With clause.
     */
    With(...columns: Array<"*" | WithProjection>): CypherPrimitive.With {
        return new CypherPrimitive.With(...columns);
    }

    /**
     * Creates a new Cypher Foreach clause with the specified variable.
     * @param variable The variable to iterate over in the Foreach clause.
     * The Foreach clause is used to execute a set of Cypher statements for each element
     * in a collection. It is often used to perform operations on each element of a list
     * or to apply a transformation to each item in a collection.
     * @returns A new Cypher Foreach clause.
     */
    Foreach(variable: Variable): CypherPrimitive.Foreach {
        return new CypherPrimitive.Foreach(variable);
    }

    /**
     * Creates a new Cypher Case clause with the specified comparator.
     * @param comparator The expression to compare in the Case clause.
     * @returns A new Cypher Case clause.
     */
    Case(comparator?: Expr): CypherPrimitive.Case {
        return new CypherPrimitive.Case(comparator);
    }

    /**
     * Creates a new Cypher Merge clause with the specified pattern.
     * @param pattern The pattern to merge in the Cypher query.
     * @returns A new Cypher Merge clause.
     */
    Merge(
        pattern:
            | CypherPrimitive.Pattern
            | CypherPrimitive.PathAssign<CypherPrimitive.Pattern>,
    ) {
        return new CypherPrimitive.Merge(pattern);
    }

    /**
     * Creates a new Cypher Property Constraint clause with the specified parameters.
     * @param param The parameters for the Property Constraint clause.
     * @returns A new Cypher Property Constraint clause.
     */
    PropertyConstraint({
        name,
        labels,
        prop,
    }: PropertyConstraint): CypherPrimitive.Raw {
        return new CypherPrimitive.Raw(() => {
            return `CREATE CONSTRAINT ${name} IF NOT EXISTS FOR (n:${labels.join(":")}) REQUIRE n.${prop} IS UNIQUE`;
        });
    }
}
