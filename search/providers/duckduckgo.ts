import fetch from "cross-fetch"
import axios from "axios";
import brotli from "brotli";
import { parse } from 'node-html-parser';
import nodeUrl from 'url';

export const ddgSearch = async(query: string) => {
    const url = `https://html.duckduckgo.com/html/?q=${query}`;

    const response = await axios.get(url, {
        decompress: false,
        responseType: "arraybuffer"
    })
    
    const data = Buffer.from(
        brotli.decompress(response.data)
    ).toString("utf-8");

    
    const root = parse(data);
    const results = root.querySelector(".results")?.childNodes.map((result) => {
        const parsedElem = parse(result.toString());

        const title = parsedElem.querySelector(".result__title")?.innerText.trim();
        const link = nodeUrl.parse(parsedElem.querySelector(".result__url") ? `https://${parsedElem.querySelector(".result__url")!.innerText.trim()}` : "https://ceccun.com");
        const description = parsedElem.querySelector(".result__snippet")?.innerText.trim();

        if (title) {
            return {
                title,
                link,
                description
            }
        }

    }).filter((result) => result !== undefined);

    return results
}