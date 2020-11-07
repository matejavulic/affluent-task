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
    return (dateRet)
}