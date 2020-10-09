const OpenFinPinger = {
    ping: async (urlInfo, goodHandler, badHandler) => {
        try {
            const resp = await fetch(urlInfo.href);
            if (!resp.ok) {
                badHandler(urlInfo, `${resp.statusText} - ${resp.statusText$}`);
                return;
            }

            let v = '';
            const ct = resp.headers.get("content-type");
            if (ct && ct.indexOf("application/json") !== -1) {
                const j = await resp.json();
                if (j.private) {
                    v = `${j.private.version} (${j.private.sha})`;
                } else if (j.projectVersion) {
                    v = j.projectVersion;
                } else if (j.revision) {
                    v = `${j.version} (${j.revision})`
                } else {
                    v = j.version;
                }
            } else {
                v = await resp.text();
            }
            goodHandler(Object.assign(urlInfo, { version: v }));
        } catch(e) {
            badHandler(urlInfo, e);
        }
    },
    pingManifest: async (name, manifest, handler) => {
        const results = [];
        // first test manifest url
        let appURL = '';
        try {
            const purl = new URL(manifest);
            const resp = await fetch(purl.href);
            if (!resp.ok) {
                results[0] = { status: 'error', msg: `error loading manifest, response: ${resp.status}`, url: purl.href};
                handler(results);
                return;
            }
            const j = await resp.json();    
            if (j.startup_app && j.startup_app.url) {
                appURL = j.startup_app.url;
                results[0] = { status: 'ok', msg: `App manifest ${name}`, url: purl.href};
            // } else if (j.platform) {
            } else {
                results[0] = { status: 'error', msg: `error loading manifest contents, could not find start url`, url: purl.href};
                handler(results);
                return;
            }
        } catch(e) {
            results[0] = { status: 'error', msg: `error loading manifest, response: ${e}`, url: manifest};
            handler(results);
            return;
        }

        // now test start url
        try {
            const surl = new URL(appURL);
            const resp = await fetch(surl.href, {mode: 'no-cors'});
            results[1] = { status: 'ok', msg: `App startup url`, url: surl.href };
        } catch(e) {
            results[1] = { status: 'error', msg: `startup url error: ${e}`, url: appURL };
        }
        handler(results);
    }
}