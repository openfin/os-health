class OpenFinPinger {
    constructor(urls, goodHandler, badHandler) {
        this.urlInfo = urls;
        this.goodHandler = goodHandler;
        this.badHandler = badHandler;
        this.urlParser = document.createElement('a');
    }

    async run() {
        for (let i=0; i<this.urlInfo.urls.length; i++) {
            const url = this.urlInfo.urls[i];
            await this.ping(url);
        }
    }

    async ping(url) {
        const urlInfo = Object.assign({}, url, { rootURL: this.getRootURL(url.href)});
        try {
            const resp = await fetch(urlInfo.href);
            if (!resp.ok) {
                this.badHandler(urlInfo, `${resp.statusText} - ${resp.statusText$}`);
                return;
            }

            let v = '';
            const ct = resp.headers.get("content-type");
            if (ct && ct.indexOf("application/json") !== -1) {
                const j = await resp.json();
                v = (j.private) ? `${j.private.version} (${j.private.sha})` : (j.projectVersion) ? j.projectVersion : j.version
            } else {
                v = await resp.text();
            }
            this.goodHandler(Object.assign(urlInfo, { version: v }));
        } catch(e) {
            this.badHandler(urlInfo, e);
        }
    }

    getRootURL(url) {
        const purl = this.parseURL(url);
        return `${purl.protocol}//${purl.host}`;
    }

    parseURL(url) {
        console.log(url)
        this.urlParser.href = url;
        console.log(this.urlParser.hostname)
        
        return {
            protocol: this.urlParser.protocol,
            host: this.urlParser.host,
            hostname: this.urlParser.hostname,
            port: this.urlParser.port,
            pathname: this.urlParser.pathname,
            search: this.urlParser.search,
            hash: this.urlParser.hash
        };
    }
}