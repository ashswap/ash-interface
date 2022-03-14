import { ArgSerializer, EndpointParameterDefinition, TypeExpressionParser, TypeMapper } from "@elrondnetwork/erdjs/out";

export const queryContractParser = (data: string[], typeStr: string) => {
    let resultHex = Buffer.from(data[0], "base64").toString(
        "hex"
    );
    let parser = new TypeExpressionParser();
    let mapper = new TypeMapper();
    let serializer = new ArgSerializer();

    let type = parser.parse(typeStr);
    let mappedType = mapper.mapType(type);

    let endpointDefinitions = [
        new EndpointParameterDefinition("foo", "bar", mappedType),
    ];
    
    let values = serializer.stringToValues(
        resultHex,
        endpointDefinitions
    );
    return values;
}