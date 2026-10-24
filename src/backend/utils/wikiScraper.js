export async function wikiScraper(){
    /**
     * [ 
     *      {
     *          name: section 1 header, content:[
     *              {name: sub-section 1 header, content: [
     *              
     *              ]}
     *          ]
     *      },
     *      {
     *          name: section 2 header, content:[
     *              "paragraph 1",
     *              "paragraph 2"
     *          ]
     *      }
     * ]
     * 
     * @param {*} sections List of sections with content
     */
    function structureSections(sections){
        let output = [];
        // for each section
        for(let i = 0; i < sections.length; i++){
            // get the name of the header
            const headerName = sections[i].getAttribute("aria-labelledby") || "overview"; 
            // get all subsections
            let subSections = sections[i].querySelectorAll(":scope > section");
            // if there are more than 0 subsections
            if(subSections && subSections.length != 0){
                // get the structured output of the subSections
                let subSectionOutput = structureSections(subSections);
                // push the record into the output list
                output.push({name:headerName, content:subSectionOutput});
                continue;
            }
            // get all of the paragraph elements
            let paragraphs = [...sections[i].querySelectorAll(":scope > p")];
            for(let x = 0; x < paragraphs.length; x++){
                // turn all the elements into their textContent
                paragraphs[x] = paragraphs[x].textContent;
            }
            // push the record into the output list
            output.push({name: headerName, content:paragraphs});
        }
        // return the output list
        return output;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
        throw new Error("tab const in wikiScraper is false");
    }

    const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML
    });

    if (!result) {
        throw new Error("html fetch script on tab failed");
    }

    // html parsing
    const htmlString = result.result; // typeof htmlString = string
    const cleaned = htmlString.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, ""); // remove inline handlers that may flag a warning
    const parser = new DOMParser(); // initiate parser
    const doc = parser.parseFromString(cleaned, "text/html"); // parse the cleaned html string to dom
    let sections = [...doc.querySelectorAll("#mw-content-text > div > section")]; // turn

    // sections to exclude
    const excludedWordList = ["External_links", "References", "Further_reading", "Bibliography", "See_also"]; // excluded section words
    const regexPattern = excludedWordList.map(word => `\\b${word}\\b`).join("|"); // combine the excludedWordList into a regex pattern
    const regex = new RegExp(regexPattern, "i"); // 'i' makes it case-insensitive

    // keep the first section (the intro has no header) and any section not matching the exclusion list
    sections = sections.filter((section, i) => {
        if (i === 0) return true; // ignore first section
        const label = section.getAttribute("aria-labelledby"); // get section header attribute
        return !label || !regex.test(label); // add to sections array if label doesn't contain excluded word
    });
    
    return structureSections(sections);
}

export async function addStructuredWikiDataToDB(db, structuredSections){

}