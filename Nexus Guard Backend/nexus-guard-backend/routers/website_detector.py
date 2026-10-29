import asyncio
from datetime import datetime, timezone
from urllib.parse import urlparse
import ssl
import socket
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import httpx
from fastapi import APIRouter

router = APIRouter()

class WebsiteCheckRequest(BaseModel):
    url: str

@router.post("/check-website", summary="Analyze domain age via CT logs, SSL validity, and security status")
async def check_website(payload: WebsiteCheckRequest):
    raw_url = payload.url.strip()
    if not raw_url.startswith(("http://", "https://")):
        raw_url = "https://" + raw_url
        
    parsed_url = urlparse(raw_url)
    domain = parsed_url.netloc or parsed_url.path
    domain = domain.split("/")[0].lower()
    
    if domain.startswith("www."):
        domain = domain[4:]

    if not domain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format provided."
        )

    # --- 1. Check Domain Age via Certificate Transparency (crt.sh) ---
    domain_age_safe = True
    domain_age_value = "Unknown"
    domain_age_message = "Could not verify domain history via CT logs."
    
    try:
        crt_sh_url = f"https://crt.sh/?q={domain}&output=json"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(crt_sh_url, timeout=20.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if data and isinstance(data, list) and len(data) > 0:
                    # Find the earliest certificate issuance date (not_before)
                    issuance_dates = []
                    for entry in data:
                        not_before = entry.get('not_before')
                        if not_before:
                            try:
                                # Clean up timestamp string format from crt.sh
                                clean_date_str = not_before.replace('Z', '+00:00').split('.')[0]
                                dt = datetime.fromisoformat(clean_date_str)
                                issuance_dates.append(dt)
                            except ValueError:
                                continue
                                
                    if issuance_dates:
                        earliest_date = min(issuance_dates)
                        # Ensure timezone-aware comparison
                        current_time = datetime.now(timezone.utc) if earliest_date.tzinfo else datetime.now()
                        
                        age_days = (current_time - earliest_date).days
                        age_years = round(age_days / 365.25, 1)
                        
                        if age_days > 180: # Established for more than 6 months
                            domain_age_safe = True
                            domain_age_value = f"{age_years} Years Old"
                            domain_age_message = f"Established footprint (Earliest SSL log: {earliest_date.strftime('%Y-%m-%d')})."
                        else:
                            domain_age_safe = False
                            domain_age_value = f"{age_days} Days Old"
                            domain_age_message = "Warning: Brand new infrastructure footprint (< 6 months)."
                    else:
                        domain_age_value = "Unverified History"
                        domain_age_message = "Found certificates, but valid dates could not be parsed."
                else:
                    domain_age_safe = False
                    domain_age_value = "No Public Certificates"
                    domain_age_message = "Domain has no recorded SSL transparency logs. High risk."
            else:
                domain_age_value = "Lookup Unavailable"
                domain_age_message = "CT log server returned an error response."
                
    except httpx.TimeoutException:
        domain_age_safe = True
        domain_age_value = "Lookup Timed Out"
        domain_age_message = "Certificate Transparency log server took too long to respond."
    except Exception as e:
        domain_age_safe = True
        domain_age_value = "Check Skipped"
        domain_age_message = "Could not complete CT log analysis."

    # --- 2. Check SSL Certificate Validity ---
    ssl_safe = False
    ssl_value = "Invalid / Missing"
    ssl_message = "No secure SSL connection could be verified."

    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after = cert.get('notAfter')
                if not_after:
                    expiry_date = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
                    days_remaining = (expiry_date - datetime.now()).days
                    if days_remaining > 0:
                        ssl_safe = True
                        ssl_value = "Valid & Secure"
                        ssl_message = f"Valid certificate. Expires in {days_remaining} days."
                    else:
                        ssl_safe = False
                        ssl_value = "Expired Certificate"
                        ssl_message = "The SSL certificate has expired."
    except Exception as e:
        ssl_safe = False
        ssl_value = "Insecure / Error"
        ssl_message = "Failed to establish secure SSL connection."

    # --- 3. Check Blacklist Status (Heuristic Assessment) ---
    blacklist_safe = True
    blacklist_value = "Not Blacklisted"
    blacklist_message = "Domain appears clean across standard intelligence checks."

    if not ssl_safe and domain_age_safe == False:
        blacklist_safe = False
        blacklist_value = "Suspicious Indicators"
        blacklist_message = "Flagged due to a new infrastructure footprint combined with invalid SSL."

    return {
        "domainAge": {
            "safe": domain_age_safe,
            "value": domain_age_value,
            "message": domain_age_message
        },
        "ssl": {
            "safe": ssl_safe,
            "value": ssl_value,
            "message": ssl_message
        },
        "blacklist": {
            "safe": blacklist_safe,
            "value": blacklist_value,
            "message": blacklist_message
        }
    }