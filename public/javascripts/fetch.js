window.onload = fetchData();


function dateFromISO8601(isostr) {

    var parts = isostr.match(/\d+/g);
    let date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);

    let YearStr = date.getFullYear().toString();

    let day = date.getDate();
    let dayStr = day.toString();

    let month = date.getMonth() + 1;
    let monthStr = month.toString();

    if (day < 10) {
        dayStr = '0' + day;
    }

    if (month < 10) {
        monthStr = '0' + month;
    }

    let dateRet = String(YearStr + '/' + monthStr + '/' + dayStr)
    if (dateRet == 'NaN-NaN-N')
        return ('Incorrect date format')

    return dateRet

}

async function fetchUserAsync() {

    let response = await fetch(`http://localhost:8080/user/get`);
    let data = await response.json()
    return data;

}

function injectDataUsers(data) {

    let userRows =
        `
    <tr>
    <th>No.</td>
    <th>Avatar</td>
    <th>Fetched ID</th>
    <th>Email</th>
    <th>Name</th>
    <th>Surname</th>
    </tr>
    `

    if (!Array.isArray(data.data) || !data.data.length) {

        userRows = userRows +
            `
        <td colspan = "8">
         <div class="center">
            <p> There is no data. Have you <a style="color: #dddd55;" href="http://localhost:8080/user">fetched it?</a></p>
         </div>
        </td>
        `
    } else {

        for (let i = 0; i <= data.data.length - 1; i++) {

            userRows = userRows +
                `
                <tr>
                    <td data-th="No.">` + (i + 1) + `</td>
                    <td class="avatar-box" data-th="Avatar"><img class="avatar" src=` + data.data[i].avatar + `></td>
                    <td data-th="Name">` + data.data[i].name + `</td>
                    <td data-th="Surname">` + data.data[i].surname + `</td>
                    <td data-th="Email">` + data.data[i].email + `</td>
                    <td data-th="Fetched ID">` + data.data[i].fetched_id + `</td>
                </tr>
                `
        }
    }

    document.getElementById("loading-users")
        .innerHTML = userRows
}

async function fetchDateAsync() {

    let response = await fetch(`http://localhost:8080/date/get`);
    let data = await response.json()
    return data

}


function injectDataDates(data) {

    let dateRows =
        `
    <tr>
    <th>No.</td>
    <th>Date</th>
    <th>Commissions - Total</th>
    <th>Sales - Net</th>
    <th>Leads - Net</th>
    <th>Clicks</th>
    <th>EPC</th>
    <th>Impressions</th>
    <th>CR</th>
    </tr>
    `

    if (!Array.isArray(data.data) || !data.data.length) {

        dateRows = dateRows +
            `
        <td colspan = "8">
         <div class="center">
            <p> There is no data. Have you <a style="color: #dddd55;" href="http://localhost:8080/date">fetched it?</a></p>
         </div>
        </td>
        `
    } else {

        for (let i = 0; i <= data.data.length - 1; i++) {

            dateRows = dateRows +
                `
                <tr>
                    <td data-th="No.">` + (i + 1) + `</td>
                    <td data-th="Date">` + dateFromISO8601(data.data[i].date) + `</td>
                    <td data-th="Commissions - Total">$` + data.data[i].total_commissions + `</td>
                    <td data-th="Sales - Net">` + data.data[i].net_sales + `</td>
                    <td data-th="Leads - Net">` + data.data[i].net_leads + `</td>
                    <td data-th="Clicks">` + data.data[i].click_count + `</td>
                    <td data-th="EPC">$` + data.data[i].epc + `</td>
                    <td data-th="Impressions">` + data.data[i].impressions + `</td>
                    <td data-th="CR">` + data.data[i].cr + `%</td>
                </tr>
                `
        }
    }

    document.getElementById("loading-dates")
        .innerHTML = dateRows
}

function fetchData() {

    fetchUserAsync().then(data => {
        injectDataUsers(data)
    });

    fetchDateAsync().then(data => {
        injectDataDates(data)
    });

}