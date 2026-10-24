export async function wikiScraper(){
    function structureSections(){

    }

    function addStructuredSectionsToDB(){
        
    }
    // get the current tab
    await chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
        console.log(tabs);
        if (!tabs || !tabs[0]) {
            throw new Error("tab const in wikiScraper is false");
        }
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id}, // target the current tab (wiki page)
            func: ()=> document.documentElement.outerHTML // run this function
        }, (results)=>{
            if (!results || !results[0]) {
                throw new Error("html fetch script on tab failed");
            }
            
            // html parsing 
            const htmlString = results[0].result; // typeof htmlCode = string
            const cleaned = htmlString.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, ""); // remove all parts of the html code that may flag a warning
            const parser = new DOMParser(); // setup the parser
            const doc = parser.parseFromString(cleaned, 'text/html'); // parse the html string to a usable dom
            let sections = [...doc.querySelectorAll('#mw-content-text > div > section')]; // get all of the main body sections, type = object

            // because we want to exclude some sections of the wiki page that is not useful,
            // I am making a regex patter that looks for these sections in the sections list to remove
            // list of sections to exclude
            const excludedWordList = ['External_links', 'References', 'Further_reading', 'Bibliography', 'See_also']
            // combine them into a regexPattern
            const regexPattern = excludedWordList.map(word => `\\b${word}\\b`).join('|');
            // turn it into a new regex object that is case-insensitive (the 'i' makes it case-insensitive)
            const regex = new RegExp(regexPattern, 'i');

            // exclude the first section as that is always a valid section.
            // the reason to exclude it is because it doesn't have a section header
            sections = sections.filter((section,i) => {
                if (i === 0) return true; // exclude first section
                const label = section.getAttribute("aria-labelledby"); // get the attribute 
                return !label || !regex.test(label);
            });
            console.log(sections);
        });
    });
}

