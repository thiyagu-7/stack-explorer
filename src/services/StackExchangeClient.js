import axios from "axios";

const BASE_SEARCH_URL = "https://api.stackexchange.com/2.2/search/"

export default {
    async search(site, fromDate, toDate, tags, minVotes, page, pageSize, orderBy = "desc", sortBy = "votes") {
        let params = {
            site: site,
            fromdate: fromDate,
            todate: toDate,
            tagged: tags,
            min: minVotes,
            page: page,
            pagesize: pageSize,
            order: orderBy,
            sort: sortBy,
            filter: "!9Z(-x-Q)8"
        }
        var queryString = Object.keys(params)
            .map(key => key + '=' + params[key])
            .join('&');
        let fullUrl = BASE_SEARCH_URL + "?" + queryString;
        return axios.get(fullUrl);
    }
}