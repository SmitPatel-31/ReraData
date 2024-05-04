const puppeteer = require('puppeteer');
const fs = require('fs');

async function selectOptionWithValue(page, selector, value) {
    await page.select(selector, value);
}
(async () => {
    masterJson = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    // Navigate to the website
    await page.goto('https://anyror.gujarat.gov.in/emilkat/GeneralReport_IDB.aspx');

    await page.waitForSelector('#ContentPlaceHolder1_ddl_app');

    await selectOptionWithValue(page, '#ContentPlaceHolder1_ddl_app', '0');

    fs.readFile('ward.json', 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
            console.log('JSON data:', jsonData);
            console.log('Type of jsonData:', typeof jsonData);
            for (let option of jsonData) {
                await page.waitForSelector('#ContentPlaceHolder1_ddldistrict');
    
    
                await selectOptionWithValue(page, '#ContentPlaceHolder1_ddldistrict', option.dvalue);

                await page.waitForSelector('#ContentPlaceHolder1_ddlcsoffice');
                await selectOptionWithValue(page, '#ContentPlaceHolder1_ddlcsoffice', option.cvalue);

                await page.waitForSelector('#ContentPlaceHolder1_ddlward');
                await selectOptionWithValue(page, '#ContentPlaceHolder1_ddlward', option.wvalue);


                await page.waitForSelector('#ContentPlaceHolder1_ddlsurvey');
                const optionsJson = await page.evaluate((option) => {
                    console.log(option)
                    const select = document.querySelector('#ContentPlaceHolder1_ddlsurvey');
                    const options = Array.from(select.options);
                    return JSON.stringify(options.map(survey => ({
                        cvalue: option.value,
                        cname: option.vname,
                        dvalue: option.dvalue,
                        dname: option.dname,
                        wvalue: option.wvalue,
                        wname: option.wname,
                        svalue:survey.value,
                        sname:survey.textContent.trim()
                    })))
                    
                },option)
              
                let data = JSON.parse(optionsJson)
                for (k of data) {
                    if(k.svalue != "00"){
                        masterJson.push(k)
                    }
                }
                console.log("working7", typeof(data));
                
                console.log("working5");
            }
            console.log(masterJson);
            masterJson = JSON.stringify(masterJson, 4);
            fs.writeFileSync('surveynumber.json', masterJson);

        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    
})();





