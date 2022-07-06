import {
    Address,
    ArgSerializer,
    EndpointParameterDefinition,
    TypeExpressionParser,
    TypeMapper,
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { ElrondStruct, ElrondType } from "interface/elrond";

export const queryContractParser = (data: string, typeStr: string) => {
    if (!data || !data.length) return [];
    let resultHex = Buffer.from(data, "base64").toString("hex");
    let parser = new TypeExpressionParser();
    let mapper = new TypeMapper();
    let serializer = new ArgSerializer();

    let type = parser.parse(typeStr);
    let mappedType = mapper.mapType(type);

    let endpointDefinitions = [
        new EndpointParameterDefinition("foo", "bar", mappedType),
    ];

    let values = serializer.stringToValues(resultHex, endpointDefinitions);
    return values;
};

export const contractArgsDeserialize = (
    encodedHex: string,
    typeExpressions: string[]
) => {
    let typeParser = new TypeExpressionParser();
    let typeMapper = new TypeMapper();
    let serializer = new ArgSerializer();
    let types = typeExpressions
        .map((expression) => typeParser.parse(expression))
        .map((type) => typeMapper.mapType(type));
    let endpointDefinitions = types.map(
        (type) => new EndpointParameterDefinition("foo", "bar", type)
    );

    // joined string => values
    let decodedValues = serializer.stringToValues(
        encodedHex,
        endpointDefinitions
    );
    return decodedValues;
};



export const decodeNestedStringHex = <T>(data: string, data_structure: ElrondStruct<T>) => {
    const getArbitraryWidthHexString: (
        data: string,
        index: number
    ) => [string, number] = (data: string, index: number) => {

        const length_encoded = Number.parseInt(
            data.slice(index, index + 8),
            16
        );
        if (length_encoded === 0) {
            return ["", index + 8];
        }
        return [
            data.slice(index + 8, index + 8 + length_encoded * 2),
            index + 8 + length_encoded * 2,
        ];
    };
    const getFixedWidthHexString: (
        data: string,
        index: number,
        num_of_byte: number
    ) => [string, number] = (
        data: string,
        index: number,
        num_of_byte: number
    ) => {
        return [
            data.slice(index, index + num_of_byte * 2),
            index + num_of_byte * 2,
        ];
    };

    const hex_value = data;
    let index = 0;
    const result: Record<string, any> = {};
    Object.entries(data_structure).map(([attribute_name, type_elem]) => {
        let value;
        if (type_elem === ElrondType.BIG_UINT) {
            const [encoded_str, newIndex] = getArbitraryWidthHexString(
                hex_value,
                index
            );
            index = newIndex;
            if (encoded_str === "") {
                value = new BigNumber(0);
            } else value = new BigNumber(encoded_str, 16);
        } else if (type_elem === ElrondType.U_64) {
            const [encoded_str, newIndex] = getFixedWidthHexString(
                hex_value,
                index,
                8
            );
            index = newIndex;
            if (encoded_str == "") {
                value = 0;
            } else value = Number.parseInt(encoded_str, 16);
        } else if (type_elem === ElrondType.MANAGED_ADDRESS) {
            const [encoded_str, newIndex] = getFixedWidthHexString(
                hex_value,
                index,
                32
            );
            index = newIndex;
            console.log(index, encoded_str);
            value = new Address(encoded_str).bech32();
        } else if (type_elem === ElrondType.TOKEN_IDENTIFIER) {
            const [encoded_str, newIndex] = getArbitraryWidthHexString(
                hex_value,
                index
            );
            index = newIndex;
            value = Buffer.from(encoded_str, "base64").toString("ascii");
        } else if (type_elem === ElrondType.BOOLEAN) {
            const [encoded_str, newIndex] = getFixedWidthHexString(
                hex_value,
                index,
                1
            );
            index = newIndex;
            value = !!Number.parseInt(encoded_str);
        }

        result[attribute_name.split("_").slice(1).join("_")] = value;
    });

    return result as T;
};

export const decodeNestedStringBase64 = <T>(data: string, data_structure: ElrondStruct<T>) => {
    return decodeNestedStringHex(Buffer.from(data, "base64").toString("hex"), data_structure);
}