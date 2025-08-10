import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data } = body;

        const saveDir = path.join(process.cwd(), "Result");
        if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

        const filePath = path.join(saveDir, "Profile_IDs.txt");
        const fileStream = fs.createWriteStream(filePath, { flags: "a", encoding: "utf-8" });

        data.forEach((item: { profile_id: string; nama_fb: string }) => {
            fileStream.write(`${item.profile_id}|${item.nama_fb}\n`);
        });

        fileStream.end();

        return NextResponse.json({
            status: "success",
            message: "Data berhasil disimpan",
            file: filePath,
        });
    } catch (e) {
        return NextResponse.json(
            { status: "error", message: (e as Error).message },
            { status: 500 }
        );
    }
}
