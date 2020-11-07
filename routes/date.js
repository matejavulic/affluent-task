var express = require('express');
const puppeteer = require('puppeteer');
const { exec } = require("child_process");
const Mysqldb = require('../models/mysqldb');

var router = express.Router();

var crateFetchCookie = function(cookies) {
    if (cookies) {
        let fetchCookie = 'cookie:'
        for (let key in cookies) {
            fetchCookie = fetchCookie + ' ' + cookies[key].name + '=' + cookies[key].value + ';'
        }
        return fetchCookie
    } else return null

}

var remapToList = function(data) {

    let dateTable = []
    let atr = []

    try {
        for (let key in data) {
            atr.push(data[key].origin_date)
            atr.push(data[key].totalComm)
            atr.push(data[key].netSaleCount)
            atr.push(data[key].netLeadCount)
            atr.push(data[key].clickCount)
            atr.push(data[key].EPC)
            atr.push(data[key].impCount)
            atr.push(data[key].CR)
            dateTable.push(atr)
            atr = []
        }
        return dateTable

    } catch (error) {
        console.log(error)
        throw error
    }
}

var saveDateTableDb = function(fetchedData) {

    return new Promise(function(resolve, reject) {
        dateTable = fetchedData

        let query = `INSERT INTO report (date, total_commissions, net_sales, net_leads, click_count, epc, impressions, cr) VALUES ?`;
        Mysqldb.query(query, [dateTable], (err, results, fields) => {

            if (err) {
                reject(err);
            }
            resolve(1)
        });
    })
}

var getDateTableDb = function() {

    return new Promise(function(resolve, reject) {

        let query = `SELECT * FROM report ORDER BY date`;
        Mysqldb.query(query, (err, results, fields) => {

            if (err) {
                reject(err);
            }
            resolve(results)
        });
    })
}

var fetchDateTable = function(fetchCookie) {

    let header = {
        'domain': ' "https://develop.pub.afflu.net/api/query/dates" ^',
        'authority': ' -H "authority: develop.pub.afflu.net" ^',
        'accept': ' -H "accept: application/json, text/javascript, */*; q=0.01" ^',
        'x_request_width': ' -H "x-requested-with: XMLHttpRequest" ^',
        'user_agent': ' -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4272.0 Safari/537.36" ^',
        'charset': ' -H "content-type: application/x-www-form-urlencoded; charset=UTF-8" ^',
        'origin': ' -H "origin: https://develop.pub.afflu.net" ^',
        'sec_fetch_site': ' -H "sec-fetch-site: same-origin" ^',
        'sec_fetch_mode': ' -H "sec-fetch-mode: cors" ^',
        'sec_fetch_dest': ' -H "sec-fetch-dest: empty" ^',
        //'referer': ' -H "referer: https://develop.pub.afflu.net/list?type=dates^&startDate=2019-01-01^&endDate=2020-01-01" ^',
        'referer': ' -H "referer: https://develop.pub.afflu.net/list?type=dates" ^',
        'accept_language': ' -H "accept-language: sr-RS,sr;q=0.9,en-US;q=0.8,en;q=0.7" ^',
        'cookie': ' -H "' + fetchCookie + '" ^ ',
    }

    let dateTable = {
        'startDate': '2019-04-30',
        'endDate': '2020-04-01',
        'resolution': 'day',
        'currency': 'USD'
    }

    let body = {
        'raw_data': ' --data-raw "draw=3^&columns^%^5B0^%^5D^%^5Bdata^%^5D=date^&columns^%^5B0^%^5D^%^5Bname^%^5D=^&columns^%^5B0^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B0^%^5D^%^5Borderable^%^5D=true^&columns^%^5B0^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B0^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B1^%^5D^%^5Bdata^%^5D=totalComm^&columns^%^5B1^%^5D^%^5Bname^%^5D=^&columns^%^5B1^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B1^%^5D^%^5Borderable^%^5D=true^&columns^%^5B1^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B1^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B2^%^5D^%^5Bdata^%^5D=netSaleCount^&columns^%^5B2^%^5D^%^5Bname^%^5D=^&columns^%^5B2^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B2^%^5D^%^5Borderable^%^5D=true^&columns^%^5B2^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B2^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B3^%^5D^%^5Bdata^%^5D=netLeadCount^&columns^%^5B3^%^5D^%^5Bname^%^5D=^&columns^%^5B3^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B3^%^5D^%^5Borderable^%^5D=true^&columns^%^5B3^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B3^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B4^%^5D^%^5Bdata^%^5D=clickCount^&columns^%^5B4^%^5D^%^5Bname^%^5D=^&columns^%^5B4^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B4^%^5D^%^5Borderable^%^5D=true^&columns^%^5B4^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B4^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B5^%^5D^%^5Bdata^%^5D=EPC^&columns^%^5B5^%^5D^%^5Bname^%^5D=^&columns^%^5B5^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B5^%^5D^%^5Borderable^%^5D=true^&columns^%^5B5^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B5^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B6^%^5D^%^5Bdata^%^5D=impCount^&columns^%^5B6^%^5D^%^5Bname^%^5D=^&columns^%^5B6^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B6^%^5D^%^5Borderable^%^5D=true^&columns^%^5B6^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B6^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&columns^%^5B7^%^5D^%^5Bdata^%^5D=CR^&columns^%^5B7^%^5D^%^5Bname^%^5D=^&columns^%^5B7^%^5D^%^5Bsearchable^%^5D=true^&columns^%^5B7^%^5D^%^5Borderable^%^5D=true^&columns^%^5B7^%^5D^%^5Bsearch^%^5D^%^5Bvalue^%^5D=^&columns^%^5B7^%^5D^%^5Bsearch^%^5D^%^5Bregex^%^5D=false^&order^%^5B0^%^5D^%^5Bcolumn^%^5D=0^&order^%^5B0^%^5D^%^5Bdir^%^5D=desc^&start=0^&length=-1^&search^%^5Bvalue^%^5D=^&search^%^5Bregex^%^5D=false^&startDate=' + dateTable.startDate +
            '^&endDate=' + dateTable.endDate +
            '^&dateResolution=' + dateTable.resolution +
            '^&currency=' + dateTable.currency + '"',
        'compressed': ' --compressed '
    }

    const instruction =
        `curl` +
        header.domain +
        header.authority +
        header.accept +
        header.x_request_width +
        header.user_agent +
        header.charset +
        header.origin +
        header.sec_fetch_site +
        header.sec_fetch_mode +
        header.sec_fetch_dest +
        header.referer +
        header.accept_language +
        header.cookie +
        body.raw_data +
        body.compressed

    return new Promise(function(resolve, reject) {

        exec(instruction, (error, stdout, stderr) => {
            console.log(instruction)
            try {
                let parse = String(stdout)
                let result = JSON.parse(parse)
                let fetchedData = remapToList(result.data)
                resolve(fetchedData)

            } catch (error) {
                reject(error)
            }
        })
    })
}

router.get('/', function(req, res, next) {

    let cookies;
    let isFetched = false;
    let isSaved = false;
    let status = 'success';

    (async() => {

        const browser = await puppeteer.launch({ headless: false, devtools: false });

        try {
            const page = await browser.newPage();

            await page.goto('https://develop.pub.afflu.net/login');
            await page.type('[name = "username"]', 'developertest@affluent.io')
            await page.type('[name = "password"]', 'SOpcR^37')
            await page.click('[class="btn green uppercase"]')

            await page.waitForNavigation({ waitUntil: 'networkidle2' })
            cookies = await page.cookies()

            let fetchCookie = crateFetchCookie(cookies)

            fetchDateTable(fetchCookie).then((fetchedTableData, err) => {

                if (err)
                    throw err

                isFetched = true;

                saveDateTableDb(fetchedTableData).then((succes, error) => {

                    if (error)
                        throw error

                    isSaved = true

                    res.render('date', {
                        isFetched: isFetched,
                        isSaved: isSaved,
                        status: status,
                    })

                }).catch(err => {

                    isSaved = false
                    status = 'error'

                    res.render('date', {
                        isFetched: isFetched,
                        isSaved: isSaved,
                        error: err
                    })
                })

            }).catch(err => {

                res.render('date', {
                    isFetched: isFetched,
                    isSaved: isSaved,
                    status: err.state,
                    error: err
                })
            })

        } catch (error) {

            res.render('date', {
                puppetError: true,
                status: error,
                error: error
            })

        } finally {
            await browser.close()
        }
    })()
})


router.get('/get', function(req, res, next) {

    getDateTableDb().then((results, error) => {

        res.json({ 'status': 'success', 'data': results, 'rows': results.length })

    }).catch(err => {

        console.log("Get DB error", err)
        res.json({ 'status': 'error', 'data': { err } })

    })
})

module.exports = router;