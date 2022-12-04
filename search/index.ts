import { providers } from "./providers"

export const search = async(query: string, type: string) => {
    let results: any = [];
    for (const item of providers) {
        const providerResults = await item(query);
        results = results.concat(providerResults);
    }
    return results
}