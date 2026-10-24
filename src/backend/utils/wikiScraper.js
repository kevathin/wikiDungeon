export async function wikiScraper(){

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
            
            const htmlCode = results[0].result;
            console.log(htmlCode);
        });
    });
    

    
}