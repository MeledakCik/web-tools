import { NextResponse } from "next/server";
function parseCookie(cookieStr: string) {
    const cookies: Record<string, string> = {};
    cookieStr.split("; ").forEach((c) => {
        const [k, v] = c.split("=");
        if (k && v) cookies[k.trim()] = v;
    });
    return cookies;
}
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const cookiesStr = formData.get("cookies") as string;
        const caption = formData.get("caption") as string;
        const image = formData.get("image") as File;

        if (!cookiesStr || !caption || !image) {
            return NextResponse.json(
                { error: "Data tidak lengkap" },
                { status: 400 }
            );
        }

        const cookies = parseCookie(cookiesStr);
        const uploadId = Date.now().toString();
        const buffer = Buffer.from(await image.arrayBuffer());

        // Upload ke endpoint private IG
        const uploadUrl = `https://www.instagram.com/rupload_igphoto/${uploadId}_0_${image.name}`;
        const uploadHeaders = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
            "X-IG-App-ID": "936619743392459",
            "X-Entity-Type": "image/jpeg",
            "X-Entity-Name": `${uploadId}_0_${image.name}`,
            "X-Entity-Length": buffer.length.toString(),
            "X-Instagram-Rupload-Params": JSON.stringify({
                upload_id: uploadId,
                media_type: 1,
                retry_context:
                    '{"num_step_auto_retry":0,"num_reupload":0,"num_step_manual_retry":0}',
                image_compression:
                    '{"lib_name":"moz","lib_version":"3.1.m","quality":"92"}',
            }),
            "Content-Type": "application/octet-stream",
            "X-CSRFToken": cookies["csrftoken"] || "",
            Cookie: cookiesStr,
        };

        const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            headers: uploadHeaders,
            body: buffer,
        });

        if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            return NextResponse.json(
                { error: "Upload gagal", detail: errorText },
                { status: uploadRes.status }
            );
        }
        const configureUrl = "https://www.instagram.com/create/configure/";
        const configureHeaders = {
            "User-Agent": uploadHeaders["User-Agent"],
            "X-IG-App-ID": "936619743392459",
            "X-CSRFToken": cookies["csrftoken"] || "",
            Cookie: cookiesStr,
            "Content-Type": "application/x-www-form-urlencoded",
        };

        const configureBody = new URLSearchParams({
            upload_id: uploadId,
            caption,
            disable_comments: "0",
            like_and_view_counts_disabled: "0",
        });

        const configureRes = await fetch(configureUrl, {
            method: "POST",
            headers: configureHeaders,
            body: configureBody,
        });

        if (!configureRes.ok) {
            const errorText = await configureRes.text();
            return NextResponse.json(
                { error: "Gagal posting", detail: errorText },
                { status: configureRes.status }
            );
        }

        const result = await configureRes.json();
        return NextResponse.json({ success: true, result });
    } catch (err: unknown) {
        let message = "Unknown error";
        if (err instanceof Error) {
            message = err.message;
        } else if (typeof err === "string") {
            message = err;
        } else if (err && typeof err === "object" && "toString" in err) {
            message = String(err);
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
