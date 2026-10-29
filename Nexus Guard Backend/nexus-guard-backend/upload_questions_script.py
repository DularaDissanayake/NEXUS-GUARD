import pymongo

# 1. Define your MongoDB connection string
# Replace with your MongoDB Atlas URI or local connection string (e.g., "mongodb://localhost:27017/")
MONGO_URI = "mongodb+srv://dularasankaa_db_user:NkepOGLpoa8hvoOa@cluster01.sfqlujk.mongodb.net/?retryWrites=true&w=majority"

# 2. Define Database and Collection names
DB_NAME = "nexusguard_db"  # Change to your database name
COLLECTION_NAME = "questions_advanced"  # Change to your collection name

# 3. Your JSON Data
questions_data = [
    {
        "id": 1,
        "difficulty": "Advanced-Easy",
        "question": "What is email spoofing?",
        "options": [
            "Encrypting email attachments.",
            "Forging email sender information to make a message appear to come from another source.",
            "Increasing email storage.",
            "Automatically deleting spam."
        ],
        "correct_answer": "Forging email sender information to make a message appear to come from another source.",
        "explanation": "Attackers can forge sender information to impersonate trusted individuals or organizations."
    },
    {
        "id": 2,
        "difficulty": "Advanced-Easy",
        "question": "Which URL is the strongest warning sign of a phishing attempt targeting example.com?",
        "options": [
            "https://example.com/login",
            "https://www.example.com/account",
            "https://example.com.security-check.invalid/login",
            "https://example.com/contact"
        ],
        "correct_answer": "https://example.com.security-check.invalid/login",
        "explanation": "The hostname ends in security-check.invalid; example.com appears only as part of a subdomain."
    },
    {
        "id": 3,
        "difficulty": "Advanced-Easy",
        "question": "What is the main purpose of a SIEM system?",
        "options": [
            "Collect and correlate security logs to support detection and investigation",
            "Replace all security controls",
            "Design graphics",
            "Store passwords in plain text"
        ],
        "correct_answer": "Collect and correlate security logs to support detection and investigation",
        "explanation": "SIEM platforms centralize and analyze event data."
    },
    {
        "id": 4,
        "difficulty": "Advanced-Easy",
        "question": "What is the difference between vulnerability scanning and penetration testing?",
        "options": [
            "They are identical",
            "Scanning identifies potential weaknesses; penetration testing safely attempts to validate exploitability within scope",
            "Penetration testing only checks spelling",
            "Scanning always causes damage"
        ],
        "correct_answer": "Scanning identifies potential weaknesses; penetration testing safely attempts to validate exploitability within scope",
        "explanation": "Both can help assess security, but they have different depth and methods."
    },
    {
        "id": 5,
        "difficulty": "Advanced-Easy",
        "question": "What is an indicator of compromise (IoC)?",
        "options": [
            "An observable artifact associated with possible malicious activity",
            "A normal project deadline",
            "A password policy document only",
            "A backup schedule"
        ],
        "correct_answer": "An observable artifact associated with possible malicious activity",
        "explanation": "Examples include suspicious hashes, domains, IP addresses or file paths."
    },
    {
        "id": 6,
        "difficulty": "Advanced-Easy",
        "question": "A browser displays a certificate warning on a website requesting banking credentials. What should you do?",
        "options": [
            "Ignore the warning.",
            "Disable certificate validation.",
            "Stop and access the bank through its independently verified official website or app.",
            "Enter your password to test the page."
        ],
        "correct_answer": "Stop and access the bank through its independently verified official website or app.",
        "explanation": "Certificate warnings may indicate that a website's identity or secure connection cannot be verified."
    },
    {
        "id": 7,
        "difficulty": "Advanced-Easy",
        "question": "A website uses paypal.example where the character after paypa is a capital letter 'I' instead of a lowercase 'l'. What is the main concern?",
        "options": [
            "The website must be official.",
            "The domain may use a visually similar character to mislead visitors.",
            "The website is automatically encrypted.",
            "The domain guarantees safe payments."
        ],
        "correct_answer": "The domain may use a visually similar character to mislead visitors.",
        "explanation": "Lookalike characters can make fraudulent domains appear similar to legitimate ones."
    },
    {
        "id": 8,
        "difficulty": "Advanced-Easy",
        "question": "A browser extension requests permission to read and modify data on every website you visit. What should you do?",
        "options": [
            "Grant permission without checking.",
            "Review the extension's source, reputation, and necessity before installing or authorizing it.",
            "Share your passwords with the developer.",
            "Disable all browser security features."
        ],
        "correct_answer": "Review the extension's source, reputation, and necessity before installing or authorizing it.",
        "explanation": "Excessive permissions can expose browsing activity or sensitive information if an extension is malicious or compromised."
    },
    {
        "id": 9,
        "difficulty": "Advanced-Easy",
        "question": "What distinguishes ethical security testing from illegal hacking?",
        "options": [
            "Ethical testing never needs permission",
            "Ethical testing is authorized and stays within the agreed scope; unauthorized access is not",
            "Both always have identical authorization",
            "Permission does not matter"
        ],
        "correct_answer": "Ethical testing is authorized and stays within the agreed scope; unauthorized access is not",
        "explanation": "Written authorization and a defined scope distinguish legitimate security testing from unauthorized activity."
    },
    {
        "id": 10,
        "difficulty": "Advanced-Easy",
        "question": "A company leaves a database accessible to unauthorized people. Which control would help prevent this?",
        "options": [
            "Give every employee administrator access",
            "Restrict network exposure, enforce least privilege, secure configuration, and monitor access",
            "Publish database credentials",
            "Disable logging"
        ],
        "correct_answer": "Restrict network exposure, enforce least privilege, secure configuration, and monitor access",
        "explanation": "Databases should not be exposed unnecessarily. Strong access controls, network restrictions, patching, and monitoring reduce risk."
    },
    {
        "id": 11,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: An employee receives a personalized email mentioning their role, manager, and current project. The email requests confidential files urgently. What type of attack might this be?",
        "options": [
            "Spear phishing.",
            "Routine software updating.",
            "Data compression.",
            "Secure authentication."
        ],
        "correct_answer": "Spear phishing.",
        "explanation": "Spear phishing targets specific individuals using tailored information to make fraudulent messages more convincing."
    },
    {
        "id": 12,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: An employee receives an email apparently from the company director requesting an urgent bank transfer to a new account. What should the employee do?",
        "options": [
            "Transfer the money immediately.",
            "Verify the request through an independently established contact method and follow payment approval procedures.",
            "Reply to the email and trust the response.",
            "Send the director the company's login credentials."
        ],
        "correct_answer": "Verify the request through an independently established contact method and follow payment approval procedures.",
        "explanation": "Business email compromise attacks use impersonation or compromised accounts to deceive employees into transferring money."
    },
    {
        "id": 13,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: A user receives repeated multi-factor authentication approval requests despite not attempting to log in. What should the user do?",
        "options": [
            "Approve one request to stop the notifications.",
            "Deny the requests, secure the account, and report the activity.",
            "Share the authentication code.",
            "Disable all security features."
        ],
        "correct_answer": "Deny the requests, secure the account, and report the activity.",
        "explanation": "Attackers may bombard users with authentication prompts (MFA Fatigue), hoping someone will approve an unauthorized login."
    },
    {
        "id": 14,
        "difficulty": "Advanced-Medium",
        "question": "Which principle best supports a zero-trust approach?",
        "options": [
            "Trust every device inside the network",
            "Continuously verify access using identity, context and least privilege",
            "Allow shared accounts",
            "Disable authentication internally"
        ],
        "correct_answer": "Continuously verify access using identity, context and least privilege",
        "explanation": "Zero trust avoids assuming that network location alone makes a user trustworthy."
    },
    {
        "id": 15,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: A suspicious application asks for permission to read a user's email and access files. The application does not request the user's password directly. What is the main risk?",
        "options": [
            "The application automatically improves security.",
            "The user may grant an untrusted application access to sensitive information.",
            "The email account becomes impossible to compromise.",
            "The permissions guarantee that the application is genuine."
        ],
        "correct_answer": "The user may grant an untrusted application access to sensitive information.",
        "explanation": "OAuth consent phishing can trick users into granting malicious applications access to their accounts or data."
    },
    {
        "id": 16,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: An attacker uses usernames and passwords leaked from one website to attempt logins on other services. What is this attack called?",
        "options": [
            "Credential stuffing.",
            "File encryption.",
            "Secure browsing.",
            "Data backup."
        ],
        "correct_answer": "Credential stuffing.",
        "explanation": "Credential stuffing exploits password reuse across multiple websites."
    },
    {
        "id": 17,
        "difficulty": "Advanced-Medium",
        "question": "Which control most directly reduces risk from stolen passwords?",
        "options": [
            "Disabling audit logs",
            "Phishing-resistant MFA where feasible",
            "Using shared accounts",
            "Reusing passwords"
        ],
        "correct_answer": "Phishing-resistant MFA where feasible",
        "explanation": "Strong MFA adds protection even when a password is compromised."
    },
    {
        "id": 18,
        "difficulty": "Advanced-Medium",
        "question": "What does the principle of separation of duties help prevent?",
        "options": [
            "One person controlling every step of a sensitive process without oversight",
            "All software updates",
            "Secure backups",
            "Encryption"
        ],
        "correct_answer": "One person controlling every step of a sensitive process without oversight",
        "explanation": "Dividing critical tasks reduces fraud and error risk."
    },
    {
        "id": 19,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: A cryptocurrency platform guarantees unusually high profits and pressures you to recruit friends. What should you do?",
        "options": [
            "Invest quickly before the offer ends",
            "Treat these as warning signs and independently verify the platform before risking money",
            "Borrow money to maximize returns",
            "Trust testimonials alone"
        ],
        "correct_answer": "Treat these as warning signs and independently verify the platform before risking money",
        "explanation": "Guaranteed returns and recruitment pressure are common fraud indicators."
    },
    {
        "id": 20,
        "difficulty": "Advanced-Medium",
        "question": "Scenario: You receive an email with a link to a login page that looks exactly like your university's official LMS. After entering your credentials, the page displays an error. What is the most appropriate response?",
        "options": [
            "Try entering the password repeatedly",
            "Assume the website is safe because it looks genuine",
            "Access the official LMS independently, change the compromised password, and report the suspicious page",
            "Share your credentials with classmates to test the page"
        ],
        "correct_answer": "Access the official LMS independently, change the compromised password, and report the suspicious page",
        "explanation": "A fake login page can collect credentials and display an error afterward. If you entered your password, secure your account promptly."
    },
    {
        "id": 21,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: A user has enabled multi-factor authentication, but an attacker steals an active authenticated session token. Why can this still be dangerous?",
        "options": [
            "Session tokens contain no security information.",
            "A valid stolen session token may allow the attacker to access the account without repeating the original login process.",
            "Multi-factor authentication prevents all session attacks.",
            "Session tokens are always public."
        ],
        "correct_answer": "A valid stolen session token may allow the attacker to access the account without repeating the original login process.",
        "explanation": "Session hijacking can bypass the need to repeat authentication while a stolen session remains valid."
    },
    {
        "id": 22,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: A user types a familiar website address but is redirected to an unexpected destination because of malicious DNS settings. Which type of attack could explain this?",
        "options": [
            "DNS hijacking.",
            "Password hashing.",
            "File compression.",
            "Secure backup."
        ],
        "correct_answer": "DNS hijacking.",
        "explanation": "DNS hijacking can redirect users to unintended destinations by manipulating domain-name resolution."
    },
    {
        "id": 23,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: Employees regularly visit a trusted industry website. Attackers compromise the website to target those visitors. What type of attack is this?",
        "options": [
            "Watering-hole attack.",
            "Password recovery.",
            "Secure email authentication.",
            "Routine software patching."
        ],
        "correct_answer": "Watering-hole attack.",
        "explanation": "Watering-hole attacks compromise websites that members of a target group are likely to visit."
    },
    {
        "id": 24,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: A website repeatedly redirects users to unfamiliar pages without their consent. What is the safest initial action?",
        "options": [
            "Enter login details on the redirected pages.",
            "Stop interacting with the suspicious pages, report the behavior, and investigate using approved security tools.",
            "Disable antivirus software.",
            "Download every suggested application."
        ],
        "correct_answer": "Stop interacting with the suspicious pages, report the behavior, and investigate using approved security tools.",
        "explanation": "Unexpected redirects may indicate malicious advertising, browser compromise, or website compromise."
    },
    {
        "id": 25,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: A phishing email directs an employee to a website that exploits a previously unknown software vulnerability. What is the key concern?",
        "options": [
            "The attack may exploit a vulnerability for which no patch was available when the attack occurred.",
            "All websites are automatically safe.",
            "Strong passwords eliminate every software vulnerability.",
            "HTTPS prevents all browser exploitation."
        ],
        "correct_answer": "The attack may exploit a vulnerability for which no patch was available when the attack occurred.",
        "explanation": "A zero-day vulnerability is a vulnerability that is exploited before an effective fix is available."
    },
    {
        "id": 26,
        "difficulty": "Advanced-Hard",
        "question": "What is a supply-chain attack?",
        "options": [
            "Compromising a trusted vendor, component or update path to reach targets",
            "An ordinary delivery delay",
            "A backup rotation method",
            "A type of screen lock"
        ],
        "correct_answer": "Compromising a trusted vendor, component or update path to reach targets",
        "explanation": "Attackers may exploit trusted suppliers or software distribution channels."
    },
    {
        "id": 27,
        "difficulty": "Advanced-Hard",
        "question": "Scenario: During a suspected ransomware incident, why might responders isolate affected systems from the network?",
        "options": [
            "To limit spread and further communication",
            "To help ransomware spread",
            "To delete backups",
            "To publish private data"
        ],
        "correct_answer": "To limit spread and further communication",
        "explanation": "Isolation can help contain an incident while responders investigate."
    },
    {
        "id": 28,
        "difficulty": "Advanced-Hard",
        "question": "What does an EDR tool primarily provide?",
        "options": [
            "Endpoint monitoring, detection and response capabilities",
            "Guaranteed prevention of every attack",
            "Website hosting only",
            "Password sharing"
        ],
        "correct_answer": "Endpoint monitoring, detection and response capabilities",
        "explanation": "EDR helps detect and investigate suspicious endpoint behaviour."
    },
    {
        "id": 29,
        "difficulty": "Advanced-Hard",
        "question": "Why is hashing useful for checking file integrity?",
        "options": [
            "A changed file generally produces a different hash",
            "Hashes decrypt every file",
            "Hashes prove a file is harmless",
            "Hashing replaces access control"
        ],
        "correct_answer": "A changed file generally produces a different hash",
        "explanation": "A matching cryptographic hash can help verify that file contents have not changed."
    },
    {
        "id": 30,
        "difficulty": "Advanced-Hard",
        "question": "What is the primary purpose of a threat model?",
        "options": [
            "Identify assets, threats, attack paths and suitable mitigations",
            "Guarantee that no threat exists",
            "Replace all testing",
            "Generate user passwords"
        ],
        "correct_answer": "Identify assets, threats, attack paths and suitable mitigations",
        "explanation": "Threat modeling helps teams reason about risks during design."
    },
    {
        "id": 31,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: An attacker gains access to an employee's cloud account and creates a new forwarding rule that sends incoming emails to an external address. What is the primary risk?",
        "options": [
            "Improved email organization.",
            "Continued unauthorized access to sensitive email information.",
            "Automatic protection against phishing.",
            "Faster internet access."
        ],
        "correct_answer": "Continued unauthorized access to sensitive email information.",
        "explanation": "Malicious forwarding rules can expose confidential communications and help attackers maintain visibility into an account."
    },
    {
        "id": 32,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: An employee receives a phone call that sounds exactly like the company's director, requesting an urgent confidential transfer. What is the safest response?",
        "options": [
            "Transfer the money because the voice sounds familiar.",
            "Verify the request through an established independent channel and follow financial approval procedures.",
            "Share the company's banking credentials.",
            "Skip all approval checks."
        ],
        "correct_answer": "Verify the request through an established independent channel and follow financial approval procedures.",
        "explanation": "AI-generated voice impersonation (Deepfakes) can make fraudulent requests sound convincing. Voice recognition alone is not sufficient verification."
    },
    {
        "id": 33,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: After a phishing incident, security monitoring detects unexpected large uploads of company files to an unfamiliar external service. What is the main concern?",
        "options": [
            "Faster software installation.",
            "Potential unauthorized data exfiltration.",
            "Improved backup performance.",
            "Normal password expiration."
        ],
        "correct_answer": "Potential unauthorized data exfiltration.",
        "explanation": "Unexpected outbound data transfers may indicate that sensitive information is being transferred outside the organization."
    },
    {
        "id": 34,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: An alert flags unusual outbound data transfer. Which evidence is especially relevant to analyze first?",
        "options": [
            "Network flow, proxy/DNS logs and endpoint telemetry",
            "Only the desktop wallpaper",
            "The user's favourite app colour",
            "A printer's paper size"
        ],
        "correct_answer": "Network flow, proxy/DNS logs and endpoint telemetry",
        "explanation": "Multiple data sources help determine whether the transfer is expected or exfiltration."
    },
    {
        "id": 35,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: Several students receive similar emails claiming their university accounts will be suspended. Each email uses a different sender address, but all contain links to the same unfamiliar login page. What is the best response for the university?",
        "options": [
            "Tell students to open the links to investigate",
            "Ignore the emails because the sender addresses are different",
            "Warn affected users, report and investigate the campaign, and coordinate with the IT/security team to block the malicious destination where appropriate",
            "Ask students to send their passwords to IT support"
        ],
        "correct_answer": "Warn affected users, report and investigate the campaign, and coordinate with the IT/security team to block the malicious destination where appropriate",
        "explanation": "Repeated messages leading to the same suspicious page may indicate a coordinated phishing campaign."
    },
    {
        "id": 36,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: Security staff discover that a malicious email has reached hundreds of employees. What is an appropriate containment action?",
        "options": [
            "Leave the email in every inbox.",
            "Use approved security tools to identify and remove or quarantine the message, investigate affected accounts, and communicate appropriate warnings.",
            "Ask employees to open the email to confirm the threat.",
            "Publish employees' passwords."
        ],
        "correct_answer": "Use approved security tools to identify and remove or quarantine the message, investigate affected accounts, and communicate appropriate warnings.",
        "explanation": "Coordinated containment can reduce additional clicks and help identify users who may already have interacted with the message."
    },
    {
        "id": 37,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: An organisation detects repeated logins from unfamiliar locations. What should analysts do first?",
        "options": [
            "Assume it is harmless",
            "Correlate authentication logs, verify the user and follow incident procedures",
            "Delete all logs",
            "Publish credentials"
        ],
        "correct_answer": "Correlate authentication logs, verify the user and follow incident procedures",
        "explanation": "Investigate context and evidence before deciding whether activity is malicious."
    },
    {
        "id": 38,
        "difficulty": "Advanced-Expert",
        "question": "Why should an organization preserve relevant logs and email evidence after a phishing incident?",
        "options": [
            "To make the email look more professional.",
            "To support investigation, determine the scope, and understand how the attack occurred.",
            "To increase the attacker's access.",
            "To avoid securing compromised accounts."
        ],
        "correct_answer": "To support investigation, determine the scope, and understand how the attack occurred.",
        "explanation": "Properly preserved evidence helps investigators reconstruct events and identify affected systems."
    },
    {
        "id": 39,
        "difficulty": "Advanced-Expert",
        "question": "What is the goal of a tabletop incident-response exercise?",
        "options": [
            "Practice roles and decisions through a simulated scenario",
            "Exploit a real target without permission",
            "Replace all incident plans",
            "Disable monitoring"
        ],
        "correct_answer": "Practice roles and decisions through a simulated scenario",
        "explanation": "Tabletop exercises help teams test coordination and identify gaps."
    },
    {
        "id": 40,
        "difficulty": "Advanced-Expert",
        "question": "Scenario: An organization discovers a phishing email, several unauthorized logins, and unusual data transfers. What is the most appropriate overall response?",
        "options": [
            "Change one password and close the investigation.",
            "Delete the suspicious email and take no further action.",
            "Coordinate incident response, contain affected systems, secure accounts, preserve evidence, assess possible data exposure, and follow applicable reporting requirements.",
            "Assume the incident is harmless because the website used HTTPS."
        ],
        "correct_answer": "Coordinate incident response, contain affected systems, secure accounts, preserve evidence, assess possible data exposure, and follow applicable reporting requirements.",
        "explanation": "Multiple indicators may point to a broader security incident. A coordinated investigation is necessary to understand its impact and prevent further harm."
    }
]

def upload_questions():
    try:
        # Connect to MongoDB client
        client = pymongo.MongoClient(MONGO_URI)
        
        # Access database and collection
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Insert or update data using 'id' as the unique key
        upserted_count = 0
        for question in questions_data:
            # Upsert will update if the document with the same 'id' exists, or insert if it doesn't
            result = collection.update_one(
                {"id": question["id"]}, 
                {"$set": question}, 
                upsert=True
            )
            if result.upserted_id or result.modified_count > 0:
                upserted_count += 1

        print(f"Successfully processed {len(questions_data)} questions into collection '{COLLECTION_NAME}'.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the connection
        client.close()

if __name__ == "__main__":
    upload_questions()