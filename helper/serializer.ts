import { ArgSerializer, EndpointParameterDefinition, TypeExpressionParser, TypeMapper } from "@elrondnetwork/erdjs/out";

export const queryContractParser = (data: string, typeStr: string) => {
    if(!data || !data.length) return [];
    let resultHex = Buffer.from(data, "base64").toString(
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

export const contractArgsDeserialize = (encodedHex: string, typeExpressions: string[]) => {
    let typeParser = new TypeExpressionParser();
    let typeMapper = new TypeMapper();
    let serializer = new ArgSerializer();
    let types = typeExpressions
        .map((expression) => typeParser.parse(expression))
        .map((type) => typeMapper.mapType(type));
    let endpointDefinitions = types.map((type) => new EndpointParameterDefinition("foo", "bar", type));

    // joined string => values
    let decodedValues = serializer.stringToValues(encodedHex, endpointDefinitions);
    return decodedValues;
}