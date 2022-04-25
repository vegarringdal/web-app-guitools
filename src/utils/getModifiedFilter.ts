import { FilterArgument } from "@simple-html/datasource";

export function getModifiedFilter(
    query: FilterArgument | null,
    modifiedColumn: string | undefined,
    modifiedDate: Date | null
) {
    // if not modified column or modified date, then just return the query back
    if (!modifiedColumn || !modifiedDate) {
        return query as FilterArgument;
    }

    let newQuery: FilterArgument;
    if (!query) {
        newQuery = {
            attribute: modifiedColumn,
            attributeType: "dateTime" as any,
            operator: "GREATER_THAN_OR_EQUAL_TO",
            value: modifiedDate
        };
    } else {
        newQuery = {
            // defaults to OR group
            logicalOperator: "AND",
            filterArguments: [
                {
                    attribute: modifiedColumn,
                    attributeType: "dateTime" as any,
                    operator: "GREATER_THAN_OR_EQUAL_TO",
                    value: modifiedDate
                },
                query
            ]
        };
    }
    return newQuery;
}
