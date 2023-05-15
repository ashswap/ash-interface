import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:3001/graphql",
    documents: [
        "graphql/**/*.gql",
        // "pages/**/*.gql", "components/**/*.gql", "views/**/*.gql"
    ],
    generates: {
        // "./generated/gql/": {
        //     preset: "client",
        // },
        "./generated/gql/schema.graphql": {
            plugins: ["schema-ast"],
        },
        "./generated/gql/fragmentMetadata.json": {
            plugins: ["fragment-matcher"],
        },
        "./generated/gql/operations.ts": {
            plugins: ["typescript-document-nodes"],
        },
        "./generated/gql/graphql-codegen-generated.ts": {
            plugins: [
                {
                    add: {
                        content: "/* tslint:disable */",
                    },
                },
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
            ],
            config: {
                declarationKind: "interface",
                enumsAsTypes: true,
                nonOptionalTypename: true,
                preResolveTypes: true,
                scalars: {
                    BigInt: "string",
                    BigDecimal: "string",
                    Bytes: "string",
                    AmountHumanReadable: "string",
                },
            },
        },
    },
};
export default config;
