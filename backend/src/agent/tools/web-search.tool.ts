import { tool } from "langchain";
import {tavily} from "@tavily/core";
import * as z from "zod";


const API_KEY = process.env.TAVILY_API_KEY;
if(!API_KEY){
  throw new Error("TAVILY_API_KEY is not defined in the env file");
}

const tvly = tavily({
  apiKey: API_KEY,
})



const webSearch = tool(
  async ({query, site})=> {

    const finalSite = site?.trim()
                        .replace(/^site:\s*/i, "")   // remove site: if site has
                        .replace(/^https?:\/\//, "") // remove https://
                        .replace(/^www\./, "")       // remove www.
                        .replace(/\/$/, "");

    const finalQuery = finalSite ? `site:${finalSite} ${query}` : query;
    // console.log("Tavily query:", finalQuery);

    const response = await tvly.search(finalQuery, {
      searchDepth: "advanced",
      maxResults: 5,
      topic: "general",
    });

    console.log("WebSearchResult:", response.results);
    return response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    }));
  },
  {
    name: "web_search",
    description: "Search the web for current information, recent developments, news, technical documentation, and factual questions.",
    schema: z.object({ 
      query: z.string().min(1).describe("A specific web search query. Include relevant keywords when useful."),
      site: z.string().optional().describe("Optional website/domain or URL to restrict the search, for example 'docs.langchain.com'")
    })
  }
)

export default webSearch;
