from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from concurrent.futures import ThreadPoolExecutor, as_completed
from googlesearch import search
from urllib.parse import urlparse, parse_qs
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CrackRequest(BaseModel):
    nama: str
    jumlah: int
    jeda: Optional[int] = 2 

def fetch_data(url: str) -> Optional[dict]:
    try:
        parsed_url = urlparse(url)
        query = parse_qs(parsed_url.query)
        profile_id = query.get("id", [None])[0]
        if profile_id:
            return {
                "id": profile_id,
                "name": "" 
            }
        return None
    except Exception:
        return None

@app.post("/api/dump-facebook")
async def dump_facebook(req: CrackRequest):
    nama = req.nama
    jumlah = req.jumlah
    jeda = req.jeda

    dork = f'site:facebook.com/profile.php?id= "{nama}"'
    os.makedirs("Result", exist_ok=True)
    file_path = "Result/Profile_IDs.txt"

    urls = list(search(dork, num_results=jumlah, sleep_interval=jeda))

    results_list: List[dict] = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetch_data, url) for url in urls]
        with open(file_path, "a", encoding="utf-8") as file:
            for future in as_completed(futures):
                result = future.result()
                if result:
                    results_list.append(result)
                    file.write(result["id"] + "\n")

    return {
        "status": "success",
        "dork": dork,
        "data": results_list
    }
