from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests, re, json,time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class A2FRequest(BaseModel):
    cookies: str

r = requests.session()
def step(cok: str):
    try:
        hed = {
            "host": "accountscenter.instagram.com",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "referer": "https://www.instagram.com/",
            "accept-encoding": "gzip, deflate",
            "accept-language": "id-id,id;q=0.9,en-us;q=0.8,en;q=0.7"
        }
        req = r.get("https://accountscenter.instagram.com/password_and_security/two_factor/",headers=hed,cookies={"cookie":cok}).text 
        ID = re.search('"clientID":"(.*?)"',str(req)).group(1)
        av = re.findall(r'"actorID":"(.*?)"',str(req))[0]
        __hs = re.search('"haste_session":"(.*?)"',str(req)).group(1)
        __hsi = re.search(r'"hsi":"([^"]+)"',str(req)).group(1)
        dtsg = re.search(r'"DTSGInitialData",\[\],{"token":"([^"]+)"}',str(req)).group(1)
        jazoest = re.search(r'&jazoest=([^"]+)"',str(req)).group(1)
        lsd = re.search(r'"LSD",\[\],{"token":"([^"]+)"}',str(req)).group(1)
        spinr = re.search(r'"__spin_r":(\d+)',str(req)).group(1)
        spinb = re.search(r'"__spin_b":"(.*?)"',str(req)).group(1)
        spint = re.search(r'"__spin_t":(.*?),',str(req)).group(1)
        data = {'av':av,"__user":0,"__a":1,"__req":10,"__hs":__hs,"dpr":3,"__ccg":"EXCELLENT","__rev":spinr,"__hsi":__hsi,"__comet_req":24,"fb_dtsg":dtsg,"jazoest":jazoest,"lsd":lsd,"__spin_r":spinr,"__spin_b":spinb,"__spin_t":spint}
        data.update({
            'fb_api_caller_class':'RelayModern',
            'fb_api_req_friendly_name':'useFXSettingsTwoFactorGenerateTOTPKeyMutation',
            'variables': json.dumps({"input":{"client_mutation_id":ID,"actor_id":data['av'],"account_id":data['av'],"account_type":"INSTAGRAM","device_id":"device_id_fetch_ig_did","fdid":"device_id_fetch_ig_did"}}),
            'server_timestamps':True,
            'doc_id':'6282672078501565'
        })
        header = {
            'Host': 'accountscenter.instagram.com',
            'content-length': '1355',
            'sec-ch-ua': '"Android WebView";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'x-ig-app-id': '1217981644879628',
            'sec-ch-ua-mobile': '?1',
            'user-agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
            'x-fb-friendly-name': 'useFXSettingsTwoFactorGenerateTOTPKeyMutation',
            'x-fb-lsd': 'BmZIkyKP1iWrCryVjZ4-xB',
            'sec-ch-ua-platform-version': "",
            'content-type': 'application/x-www-form-urlencoded',
            'x-asbd-id': '129477',
            'sec-ch-ua-full-version-list': '',
            'sec-ch-ua-model': "",
            'sec-ch-prefers-color-scheme': 'light',
            'sec-ch-ua-platform': '"Android"',
            'accept': '*/*',
            'origin': 'https://accountscenter.instagram.com',
            'x-requested-with': 'mark.via.gp',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://accountscenter.instagram.com/password_and_security/two_factor/',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
        }
        res1 = r.post("https://accountscenter.instagram.com/api/graphql/",data=data,headers=header,cookies={"cookie": cok})
        key = re.search('"key_text":"(.*?)"',str(res1.text)).group(1)
        xxx = key.replace(" ","")
        otp = r.get(f"https://2fa.live/tok/{xxx}").json()["token"]
        return Auten(cok, otp, req, key)
    except Exception as e:
        return {"status": "error", "message": str(e)}

def Auten(cok,otp,req,key):
    hed = {
        "host": "accountscenter.instagram.com",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "referer": "https://www.instagram.com/",
        "accept-encoding": "gzip, deflate",
        "accept-language": "id-id,id;q=0.9,en-us;q=0.8,en;q=0.7"
    }
    req1 = r.get("https://accountscenter.instagram.com/password_and_security/two_factor/",headers=hed,cookies={"cookie":cok}).text 
    aid = re.findall('"clientID":"(.*?)"',str(req1))[0]
    av = re.findall(r'"actorID":"(.*?)"',str(req))[0]
    __hs = re.search('"haste_session":"(.*?)"',str(req)).group(1)
    __hsi = re.search(r'"hsi":"([^"]+)"',str(req)).group(1)
    dtsg = re.search(r'"DTSGInitialData",\[\],{"token":"([^"]+)"}',str(req)).group(1)
    jazoest = re.search(r'&jazoest=([^"]+)"',str(req)).group(1)
    lsd = re.search(r'"LSD",\[\],{"token":"([^"]+)"}',str(req)).group(1)
    spinr = re.search(r'"__spin_r":(\d+)',str(req)).group(1)
    spinb = re.search(r'"__spin_b":"(.*?)"',str(req)).group(1)
    spint = re.search(r'"__spin_t":(.*?),',str(req)).group(1)
    data = {'av':av,"__user":0,"__a":'1a',"__req":10,"__hs":__hs,"dpr":3,"__ccg":"EXCELLENT","__rev":spinr,"__hsi":__hsi,"__comet_req":24,"fb_dtsg":dtsg,"jazoest":jazoest,"lsd":lsd,"__spin_r":spinr,"__spin_b":spinb,"__spin_t":spint}
    data.update({
        "fb_api_caller_class":"RelayModern",
        "fb_api_req_friendly_name":"useFXSettingsTwoFactorEnableTOTPMutation",
        "variables": json.dumps({"input":{"client_mutation_id":aid,"actor_id":data["av"],"account_id":data["av"],"account_type":"INSTAGRAM","verification_code":otp,"device_id":"device_id_fetch_ig_did","fdid":"device_id_fetch_ig_did"}}),
        "server_timestamps":True,
        "doc_id":"7032881846733167"
    })
    head ={
        'Host': 'accountscenter.instagram.com',
        'content-length': '1391',
        'sec-ch-ua': '"Android WebView";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'x-ig-app-id': '1217981644879628',
        'sec-ch-ua-mobile': '?1',
        'user-agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        'x-fb-friendly-name': 'useFXSettingsTwoFactorEnableTOTPMutation',
        'x-fb-lsd': 'BmZIkyKP1iWrCryVjZ4-xB',
        'sec-ch-ua-platform-version': "",
        'content-type': 'application/x-www-form-urlencoded',
        'x-asbd-id': '129477',
        'sec-ch-ua-full-version-list':  '',
        'sec-ch-ua-model': "",
        'sec-ch-prefers-color-scheme': 'light',
        'sec-ch-ua-platform': '"Android"',
        'accept': '*/*',
        'origin': 'https://accountscenter.instagram.com',
        'x-requested-with': 'mark.via.gp',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://accountscenter.instagram.com/password_and_security/two_factor/',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    }
    ps = r.post("https://accountscenter.instagram.com/api/graphql/",data=data,headers=head,cookies={"cookie": cok})
    if '"success":true' in str(ps.text):
        return Kode(cok,req1, key, aid)
    else:
        pass
def Kode(cok,req1, key, aid):
    try:
        data = {
            'av':re.findall(r'"actorID":"(.*?)"',str(req1))[0],
            "__user":0,
            "__a":1,
            "__req":15,
            "__hs":re.search(r'"haste_session":"(.*?)"',str(req1)).group(1),
            "dpr":1.5,
            "__ccg":"EXCELLENT",
            "__rev": re.search(r'"__spin_r":(\d+)',str(req1)).group(1),
            "__hsi":re.search(r'"hsi":"([^"]+)"',str(req1)).group(1),
            "__comet_req":24,
            "fb_dtsg":re.search(r'"DTSGInitialData",\[\],{"token":"([^"]+)"}',str(req1)).group(1),
            "jazoest":re.search(r'&jazoest=([^"]+)"',str(req1)).group(1),
            "lsd":re.search(r'"LSD",\[\],{"token":"([^"]+)"}',str(req1)).group(1),
            "__spin_r": re.search(r'"__spin_r":(\d+)',str(req1)).group(1),
            "__spin_b":re.search(r'"__spin_b":"(.*?)"',str(req1)).group(1),
            "__spin_t":re.search(r'"__spin_t":(.*?),',str(req1)).group(1)
        }
        data.update({
            'fb_api_caller_class': 'RelayModern',
            'fb_api_req_friendly_name': 'useFXSettingsTwoFactorFetchRecoveryCodesMutation',
            'variables': json.dumps({"input":{"client_mutation_id":aid,"actor_id":data['av'],"account_id":data['av'],"account_type":"INSTAGRAM","fdid":"device_id_fetch_ig_did"}}),
            'server_timestamps': True,
            'doc_id': '24140213678960162',
        })
        headers = {
            'authority': 'accountscenter.instagram.com',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://accountscenter.instagram.com',
            'referer': 'https://accountscenter.instagram.com/password_and_security/two_factor/',
            'sec-ch-prefers-color-scheme': 'dark',
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'sec-ch-ua-full-version-list': '"Not-A.Brand";v="99.0.0.0", "Chromium";v="124.0.6327.4"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-model': '"SM-J250F"',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua-platform-version': '"7.1.1"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
            'x-asbd-id': '129477',
            'x-fb-friendly-name': 'useFXSettingsTwoFactorFetchRecoveryCodesMutation',
            'x-fb-lsd': 'YZDfCPh7Blp_k7UqlJtLTU',
            'x-ig-app-id': '1217981644879628',
        }
        ps = r.post("https://accountscenter.instagram.com/api/graphql/",data=data,headers=headers,cookies={"cookie":cok})
        js = ps.json()
        if '"success":true' in str(ps.text):
            recovery_codes = js["data"]["xfb_two_factor_fetch_recovery_codes"]["recovery_codes"]
            return {"status": "success", "A2F_key": key, "recovery_codes": recovery_codes}
        else:
            return {"status": "error", "message": "Gagal mengambil recovery codes"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.post("/api/a2fig")
def enable_a2f(req: A2FRequest):
    ig = step(req.cookies)
    return ig
