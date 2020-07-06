class OpenFinPinger {
    constructor(urls, goodHandler, badHandler) {
        this.urlInfo = urls;
        this.goodHandler = goodHandler;
        this.badHandler = badHandler;
    }

    async run() {
        let resp;
        for (let i=0; i<this.urlInfo.urls.length; i++) {
            const url = this.urlInfo.urls[i];
            try {
                resp = await fetch(url.href);
                if (!resp.ok) {
                    this.badHandler(url, resp.status, resp.statusText);
                    continue;
                }
                this.goodHandler(url);
            } catch(e) {
                this.badHandler(url, 0, e);
            }
        }
    }
}