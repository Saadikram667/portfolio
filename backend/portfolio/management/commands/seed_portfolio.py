from django.core.management.base import BaseCommand
from portfolio.models import Certificate, Profile, Project, Skill, TimelineEntry

# Paste your public LinkedIn (/in/...) and Credly (/users/...) URLs below (or add in Admin)
YOUR_LINKS = {
    "email": "saadikramansari@gmail.com",
    "github_url": "https://github.com/Saadikram667",
    "linkedin_url": "https://www.linkedin.com/public-profile/settings/?trk=d_flagship3_profile_self_view_public_profile&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BlqYhGECWSuSF3egpnB%2F%2FZA%3D%3D",
    "credly_url": "https://www.credly.com/users/saad-ikram.3a64e354/badges/credly",
}


class Command(BaseCommand):
    help = "Seeds Saad Ikram (Crimson Nova) complete real portfolio data."

    def handle(self, *args, **options):
        # Clean rebuild of seeded collections so zero old placeholders remain
        Project.objects.all().delete()
        Skill.objects.all().delete()
        TimelineEntry.objects.all().delete()
        Certificate.objects.all().delete()

        Profile.objects.update_or_create(
            id=1,
            defaults={
                "full_name": "Saad Ikram",
                "brand_name": "Crimson Nova",
                "monogram": "CN.",
                "headline": "AI & Cybersecurity Software Engineer",
                "subheadline": (
                    "5th-semester CS student (3.86 CGPA) building deep-learning diagnostics, "
                    "automated Django AI pipelines, computer-vision camera controllers, and "
                    "security-conscious full-stack systems."
                ),
                "bio": (
                    "I am Saad Ikram Ansari, a Computer Science student at DHA Suffa University "
                    "and President of the Tech Visionary Computer Science Society (TVCSS), building "
                    "under the studio identity Crimson Nova. My work sits at the intersection of "
                    "applied AI, MLOps data engineering, embedded hardware, and cybersecurity—"
                    "turning complex ideas into documented, shippable systems."
                ),
                "status_text": "Open to AI & Cybersecurity Roles",
                "is_available": True,
                "location": "Karachi, Pakistan · Remote Worldwide",
                "email": YOUR_LINKS["email"],
                "github_url": YOUR_LINKS["github_url"],
                "linkedin_url": YOUR_LINKS["linkedin_url"],
                "credly_url": YOUR_LINKS["credly_url"],
                "brand_logo_url": "/assets/crimson-nova.png",
                "avatar_url": "/assets/saad-portrait.jpg",
                "resume_url": "",
                "hero_stats": [
                    {"value": "3.86", "label": "CS CGPA · 5th Sem"},
                    {"value": "3 yrs", "label": "Coding Experience"},
                    {"value": "2", "label": "Hackathon Builds"},
                ],
                "work_style_note": (
                    "I validate data flows, system boundaries, and security assumptions before "
                    "writing production code. Whether I am shipping a Django + Celery pipeline, "
                    "an interactive React + TypeScript interface, or an embedded hardware controller, "
                    "expect clear documentation, rapid vertical slices, and reliable execution."
                ),
            },
        )

        projects = [
            {
                "slug": "minutes-of-meeting-doc",
                "title": "Minutes of Meeting (MoM) Automation",
                "domain": "ai_ml",
                "tagline": "Automated Microsoft Teams meeting bot, template-driven MoM generator, and participant email dispatcher.",
                "outcome": "Eliminated manual meeting note-taking by scheduling or joining Teams calls via bot link, rendering user-defined DOCX templates, and emailing minutes automatically.",
                "overview": (
                    "A full-stack Django & AI productivity platform that lets teams create meetings "
                    "directly or invite a recording bot via link. Once Fireflies processes the transcript, "
                    "asynchronous Celery/Redis workers extract structured decisions and action items, "
                    "populate the user's custom document template, and email the finished MoM to attendees."
                ),
                "architecture_notes": (
                    "Teams Meeting / Bot Invite -> Fireflies Webhook -> Django API -> Celery + Redis Worker "
                    "-> Structured LLM Extraction -> User Template Synthesis -> Automated Participant Email."
                ),
                "metrics": [
                    {"value": "Celery", "label": "Async Redis Workers"},
                    {"value": "Teams", "label": "Auto Bot + Email Flow"},
                ],
                "code_filename": "mom_tasks.py",
                "code_language": "python",
                "code_snippet": (
                    "@shared_task(bind=True, max_retries=3)\n"
                    "def generate_and_dispatch_mom(self, meeting_id: str, template_id: int) -> dict:\n"
                    "    transcript = fireflies.fetch_transcript(meeting_id)\n"
                    "    minutes = extract_structured_mom(transcript)\n"
                    "    doc_path = render_user_template(template_id, minutes)\n"
                    "    sent = email_participants(minutes['attendees'], attachment=doc_path)\n"
                    "    return {'meeting_id': meeting_id, 'emailed': sent}"
                ),
                "tech_stack": [
                    "Python",
                    "Django",
                    "Celery",
                    "Redis",
                    "Fireflies.ai",
                    "Microsoft Teams",
                    "HTML5",
                    "CSS3",
                ],
                "live_url": "",
                "github_url": "",
                "has_case_study": True,
                "case_study_problem": (
                    "Engineering and operations teams repeatedly lost hours turning raw Teams recordings "
                    "into standardized company MoM documents and manually distributing follow-up emails."
                ),
                "case_study_solution": (
                    "Built a Django web app supporting both native meeting creation and on-demand bot "
                    "invites. Background Celery workers backed by Redis ingest Fireflies webhooks, map "
                    "key points into each user's custom template, and trigger verified email delivery."
                ),
                "case_study_tradeoffs": [
                    "Moved transcript parsing, template rendering, and SMTP dispatch into Celery workers so webhooks reply immediately without timing out.",
                    "Separated template schemas from LLM extraction so organizations can swap DOCX formats without changing AI prompts.",
                    "Added idempotent job keys per meeting ID to prevent duplicate emails on webhook retries.",
                ],
                "order": 1,
            },
            {
                "slug": "vms-ai-onvif-ptz",
                "title": "VMS AI — ONVIF PTZ & Multi-ROI",
                "domain": "systems",
                "tagline": "Web video management system controlling ONVIF cameras, tracking coordinates, saving preset locations, and mapping YOLO AI detection ROIs.",
                "outcome": "Unified live ONVIF PTZ steering, saved coordinate presets, and interactive multi-ROI YOLO detection zones inside one responsive control interface.",
                "overview": (
                    "Full-stack video management and computer-vision control platform built for live "
                    "camera fleets. Operators steer Pan-Tilt-Zoom cameras over ONVIF, track real-time "
                    "camera coordinates, bookmark preset positions for one-click return, and draw "
                    "custom Regions of Interest (ROIs) tied directly to YOLO detection pipelines."
                ),
                "architecture_notes": (
                    "TypeScript ROI & PTZ UI -> Control REST/WS API -> Python ONVIF Driver "
                    "-> Preset Coordinate Store -> YOLO Multi-ROI Inference Pipeline."
                ),
                "metrics": [
                    {"value": "ONVIF", "label": "Live PTZ + Presets"},
                    {"value": "YOLO", "label": "Multi-ROI Detection"},
                ],
                "code_filename": "ptz_roi_controller.ts",
                "code_language": "typescript",
                "code_snippet": (
                    "export async function savePresetAndSyncROI(\n"
                    "  cameraId: string,\n"
                    "  preset: { name: string; pan: number; tilt: number; zoom: number },\n"
                    "  rois: Array<{ id: string; points: [number, number][] }>\n"
                    ") {\n"
                    "  return fetch(`/api/vms/${cameraId}/presets`, {\n"
                    "    method: 'POST',\n"
                    "    headers: { 'Content-Type': 'application/json' },\n"
                    "    body: JSON.stringify({ preset, rois, engine: 'yolo' }),\n"
                    "  });\n"
                    "}"
                ),
                "tech_stack": [
                    "TypeScript",
                    "Python",
                    "YOLO",
                    "ONVIF",
                    "OpenCV",
                    "React",
                    "CSS3",
                ],
                "live_url": "",
                "github_url": "",
                "has_case_study": True,
                "case_study_problem": (
                    "Security operators had to juggle disconnected camera controllers and static AI "
                    "detection zones—moving a PTZ camera broke bounding regions unless operators manually recalibrated."
                ),
                "case_study_solution": (
                    "Engineered an interactive TypeScript UI paired with a Python ONVIF and YOLO backend. "
                    "Camera pan/tilt/zoom coordinates are persisted as named presets, automatically "
                    "binding each location to its corresponding multi-ROI detection polygons."
                ),
                "case_study_tradeoffs": [
                    "Normalized ROI polygon coordinates to [0..1] viewport space so overlays stay aligned across differing camera stream resolutions.",
                    "Throttled continuous PTZ move commands on the client to avoid flooding ONVIF SOAP endpoints.",
                ],
                "order": 2,
            },
            {
                "slug": "lumina-neuro",
                "title": "LuminaNeuro",
                "domain": "ai_ml",
                "tagline": "AI-powered neuro-diagnostic platform using TensorFlow to classify brain tumor types alongside interactive patient risk screening.",
                "outcome": "Combined multi-class MRI tumor classification with structured symptom screening in a fast Flask web interface built during CODE-STORM '26.",
                "overview": (
                    "LuminaNeuro pairs a trained TensorFlow convolutional neural network for MRI brain "
                    "tumor classification (glioma, meningioma, pituitary, and no-tumor) with an interactive "
                    "screening workflow that contextualizes model confidence for preliminary triage."
                ),
                "architecture_notes": (
                    "MRI Upload & Screening Form -> Flask API -> Image Normalization (224x224) "
                    "-> TensorFlow CNN Inference -> Class Probability & Risk Summary UI."
                ),
                "metrics": [
                    {"value": "4-Class", "label": "MRI Tumor Triage"},
                    {"value": "TensorFlow", "label": "Deep Learning Core"},
                ],
                "code_filename": "inference.py",
                "code_language": "python",
                "code_snippet": (
                    "CLASSES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']\n\n"
                    "@app.route('/api/predict', methods=['POST'])\n"
                    "def predict_mri():\n"
                    "    img = preprocess_mri(request.files['scan'], size=(224, 224))\n"
                    "    probs = model.predict(img, verbose=0)[0]\n"
                    "    idx = int(np.argmax(probs))\n"
                    "    return jsonify({'class': CLASSES[idx], 'confidence': round(float(probs[idx]), 4)})"
                ),
                "tech_stack": ["Python", "TensorFlow", "Flask", "HTML5", "CSS3", "JavaScript"],
                "live_url": "",
                "github_url": "",
                "has_case_study": True,
                "case_study_problem": (
                    "Preliminary MRI screening tools often return opaque raw predictions without "
                    "combining structured patient symptom context or clear confidence indicators."
                ),
                "case_study_solution": (
                    "Built a Flask-backed TensorFlow diagnostic web app that preprocesses uploaded "
                    "MRI scans, outputs multi-class probability distributions, and combines them with "
                    "an interactive risk-screening questionnaire."
                ),
                "case_study_tradeoffs": [
                    "Loaded the TensorFlow model once at Flask boot rather than per-request to keep inference latency responsive.",
                    "Displayed full class probability breakdowns alongside clear non-clinical disclaimer boundaries.",
                ],
                "order": 3,
            },
            {
                "slug": "data-refine-platform",
                "title": "DataRefine Platform",
                "domain": "data",
                "tagline": "MLOps data preparation workbench to clean, visualize, label, and split datasets for machine learning pipelines.",
                "outcome": "Turned repetitive Pandas and Scikit-learn cleaning notebooks into a guided, visual MLOps studio for ML-ready dataset exports.",
                "overview": (
                    "Built under Crimson Nova as an end-to-end MLOps data preparation platform. Users "
                    "inspect distributions via Seaborn plots, handle missing values and outliers, apply "
                    "labels and encodings, and export leakage-free train/validation/test splits."
                ),
                "architecture_notes": (
                    "Raw CSV / Dataset Upload -> Pandas Profiler -> Visual EDA (Seaborn) "
                    "-> Cleaning & Labeling Pipeline -> Scikit-learn Stratified Split Export."
                ),
                "metrics": [
                    {"value": "MLOps", "label": "End-to-End Prep"},
                    {"value": "Leak-Free", "label": "Stratified Splits"},
                ],
                "code_filename": "refine_pipeline.py",
                "code_language": "python",
                "code_snippet": (
                    "def refine_and_split(df: pd.DataFrame, target: str, test_size: float = 0.2):\n"
                    "    df = df.drop_duplicates().copy()\n"
                    "    num_cols = df.select_dtypes(include='number').columns\n"
                    "    df[num_cols] = df[num_cols].fillna(df[num_cols].median())\n"
                    "    X, y = df.drop(columns=[target]), df[target]\n"
                    "    return train_test_split(X, y, test_size=test_size, stratify=y, random_state=42)"
                ),
                "tech_stack": [
                    "Python",
                    "Pandas",
                    "Scikit-learn",
                    "Seaborn",
                    "HTML5",
                    "CSS3",
                    "JavaScript",
                ],
                "live_url": "",
                "github_url": "",
                "has_case_study": False,
                "order": 4,
            },
            {
                "slug": "encoder-based-robotic-arm",
                "title": "Encoder-Based Robotic Arm",
                "domain": "hardware",
                "tagline": "Wireless Receiver robotic hand driven by servos and strings, controlled via a custom flex-sensor & potentiometer Transmitter glove.",
                "outcome": "Achieved real-time wireless finger mimicry between a wearable dual-sensor Transmitter controller and a 5-finger servo Receiver arm.",
                "overview": (
                    "Designed and wired both halves of a custom robotic hand system using dual Arduino "
                    "Nano microcontrollers. The Transmitter reads potentiometers and flex sensors to "
                    "encode finger positions over wireless telemetry, while the Receiver translates "
                    "incoming angles into synchronized servo-driven string actuation."
                ),
                "architecture_notes": (
                    "Flex Sensors & Potentiometers -> Arduino Nano (Transmitter) -> Wireless Packet Link "
                    "-> Arduino Nano (Receiver) -> PWM Servo Motors -> String-Actuated Fingers."
                ),
                "metrics": [
                    {"value": "2x Nano", "label": "TX / RX Architecture"},
                    {"value": "Real-Time", "label": "Servo Mimicry"},
                ],
                "code_filename": "receiver_arm.ino",
                "code_language": "cpp",
                "code_snippet": (
                    "#include <Servo.h>\n"
                    "Servo fingers[5];\n"
                    "const int PINS[5] = {3, 5, 6, 9, 10};\n\n"
                    "void applyTelemetry(const int angles[5]) {\n"
                    "  for (int i = 0; i < 5; i++) {\n"
                    "    int safeAngle = constrain(angles[i], 10, 170);\n"
                    "    fingers[i].write(safeAngle);\n"
                    "  }\n"
                    "}"
                ),
                "tech_stack": ["C++", "Arduino IDE", "Arduino Nano", "Servo Motors", "Flex Sensors", "Electronics"],
                "live_url": "",
                "github_url": "",
                "has_case_study": False,
                "order": 5,
            },
        ]

        for proj in projects:
            Project.objects.create(**proj)

        skills = [
            # Languages & Core
            ("Python", "languages", "daily", ["LuminaNeuro", "DataRefine", "MoM Automation", "VMS AI"], 1),
            ("TypeScript & JavaScript", "languages", "daily", ["VMS AI", "Portfolio v2", "DataRefine"], 2),
            ("C / C++ / C#", "languages", "comfortable", ["Encoder Robotic Arm", "University Systems"], 3),
            ("SQL & Database Management", "languages", "comfortable", ["CarePoint", "Portfolio CMS"], 4),
            # AI, Data & Backend
            ("Django & Django Ninja", "backend_ai", "daily", ["MoM Automation", "Portfolio v2"], 1),
            ("AI / ML (TensorFlow, YOLO, Scikit-learn)", "backend_ai", "daily", ["LuminaNeuro", "VMS AI", "DataRefine"], 2),
            ("Pandas, NumPy & Seaborn", "backend_ai", "daily", ["DataRefine", "Elevvo Internship"], 3),
            ("Supabase & PostgreSQL", "backend_ai", "daily", ["Portfolio v2", "Cloud Storage"], 4),
            ("Celery, Redis & Flask", "backend_ai", "comfortable", ["MoM Automation", "LuminaNeuro"], 5),
            # Frontend & Tooling
            ("React & UI Development", "frontend", "daily", ["Portfolio v2", "VMS AI"], 1),
            ("HTML5, CSS3 & Tailwind CSS", "frontend", "daily", ["Portfolio v2", "LuminaNeuro", "DataRefine"], 2),
            ("VS Code, Git & GitHub", "frontend", "daily", ["All Repositories"], 3),
            ("Proteus & phpMyAdmin", "frontend", "comfortable", ["Hardware Simulation", "DBMS Labs"], 4),
            # Cybersecurity, Systems & Hardware
            ("Cybersecurity & Network Packet Analysis", "hardware_sec", "comfortable", ["OPSWAT OCFA", "Cisco NetAcad", "Python Packet Sniffer"], 1),
            ("Cloud Cameras & ONVIF / RTSP", "hardware_sec", "familiar", ["VMS AI"], 2),
            ("Arduino & Raspberry Pi", "hardware_sec", "familiar", ["Encoder Robotic Arm", "Smart Car"], 3),
            ("Computer Hardware & Troubleshooting", "hardware_sec", "familiar", ["Workstation & Embedded Builds"], 4),
        ]

        for name, category, tier, used_in, order in skills:
            Skill.objects.create(
                name=name,
                category=category,
                tier=tier,
                used_in=used_in,
                order=order,
            )

        timeline = [
            {
                "slug": "leap-ai-developer-intern",
                "title": "AI Developer Intern",
                "organization": "LEAP",
                "category": "experience",
                "date_range": "Oct 15, 2026 – Dec 15, 2026",
                "summary": "Engineering production AI automation pipelines and real-time computer-vision camera modules across Python, Django, and TypeScript.",
                "highlights": [
                    "Built the Minutes of Meeting (MoM) Automation app with Django, Celery, Redis, Fireflies, and Teams bot integration",
                    "Co-developed the VMS AI web platform with ONVIF PTZ control, saved camera presets, and YOLO multi-ROI detection",
                ],
                "order": 1,
            },
            {
                "slug": "elevvo-data-scientist-intern",
                "title": "Data Scientist Intern",
                "organization": "Elevvo",
                "category": "experience",
                "date_range": "Oct 19, 2026 – Nov 19, 2026",
                "summary": "Applied exploratory data analysis, feature preprocessing, and predictive modeling workflows on real-world datasets.",
                "highlights": [
                    "Cleaned, visualized, and engineered features using Pandas, Seaborn, and Scikit-learn",
                    "Evaluated supervised machine learning models with reproducible validation splits",
                ],
                "order": 2,
            },
            {
                "slug": "tvcss-president",
                "title": "President",
                "organization": "Tech Visionary Computer Science Society (TVCSS · DSU)",
                "category": "leadership",
                "date_range": "2026 – Present",
                "summary": "Leading the flagship student computer science society at DHA Suffa University—directing technical workshops, hackathons, and community outreach.",
                "highlights": [
                    "Spearheading society vision, executive coordination, and technical event strategy",
                    "Driving campus-wide workshops, Vibe Coding hackathons, and student engineering initiatives",
                ],
                "order": 3,
            },
            {
                "slug": "cybersecurity-network-data-flow",
                "title": "Cybersecurity & Network Data Flow Track",
                "organization": "Applied Security Training",
                "category": "certification",
                "date_range": "Oct 2026 – Present",
                "summary": "Hands-on study of packet flows, network attacks, phishing defense, and intrusion detection.",
                "highlights": [
                    "Building a Python packet-capture tool to inspect live network traffic",
                    "Configuring and testing a network-based intrusion detection system (NIDS)",
                ],
                "order": 4,
            },
            {
                "slug": "dsu-bs-computer-science",
                "title": "BS Computer Science (CGPA: 3.86)",
                "organization": "DHA Suffa University · Karachi, Pakistan",
                "category": "education",
                "date_range": "2024 – Ongoing (5th Semester)",
                "summary": "Undergraduate Computer Science program focused on AI/ML, data pipelines, database systems, microcontrollers, and cybersecurity.",
                "highlights": [
                    "Maintaining a 3.86 CGPA currently in the 5th semester",
                    "Research interests: Machine Learning, Data Pipelines, Microcontrollers, Ethical Hacking & Security Compliance",
                ],
                "order": 5,
            },
            {
                "slug": "intermediate-science",
                "title": "Intermediate (74%)",
                "organization": "Govt. Degree Science and Commerce College · Karachi",
                "category": "education",
                "date_range": "2024",
                "summary": "Pre-engineering / science foundation prior to Computer Science degree.",
                "highlights": ["Matriculation (87%) completed at Al-Eman Education System, Karachi (2022)"],
                "order": 6,
            },
        ]

        for item in timeline:
            TimelineEntry.objects.create(**item)

        certificates = [
            {
                "slug": "opswat-ocfa",
                "title": "OPSWAT Cybersecurity Fundamentals Associate (OCFA)",
                "issuer": "OPSWAT Academy",
                "issued_date": "Sep 25, 2026",
                "credential_id": "Rau8z7T0NQ",
                "verify_url": "https://learn.opswatacademy.com/certificate/Rau8z7T0NQ",
                "image_url": "/assets/cert-ocfa.png",
                "order": 1,
            },
            {
                "slug": "cisco-intro-cybersecurity",
                "title": "Introduction to Cybersecurity",
                "issuer": "Cisco Networking Academy · ITU-DTC Pakistan (VU)",
                "issued_date": "Oct 01, 2026",
                "credential_id": "b4dd8b76-bb5f-4629-b5b1-279b865e9059",
                "verify_url": "",
                "image_url": "/assets/cert-intro-cyber.png",
                "order": 2,
            },
            {
                "slug": "cisco-python-essentials-2",
                "title": "Python Essentials 2",
                "issuer": "Cisco Networking Academy · Python Institute",
                "issued_date": "Oct 13, 2026",
                "credential_id": "7fd4c724-74d3-47f9-8436-597349dca6f4",
                "verify_url": "",
                "image_url": "/assets/cert-python2.jpg",
                "order": 3,
            },
            {
                "slug": "code-storm-26",
                "title": "CODE-STORM '26 Hackathon (Vibe Coding)",
                "issuer": "TVCSS · DHA Suffa University",
                "issued_date": "2026",
                "credential_id": "",
                "verify_url": "",
                "image_url": "/assets/cert-codestorm.jpg",
                "order": 4,
            },
            {
                "slug": "code-connect-26-crimson-nova",
                "title": "Code//Connect '26 — Team Crimson Nova",
                "issuer": "UBIT Career Connect '26 · University of Karachi",
                "issued_date": "2026",
                "credential_id": "",
                "verify_url": "",
                "image_url": "/assets/cert-codeconnect.jpg",
                "order": 5,
            },
        ]

        for cert in certificates:
            Certificate.objects.create(**cert)

        self.stdout.write(
            self.style.SUCCESS("Seeded Saad Ikram (Crimson Nova) profile, 5 projects, skills, timeline & 5 certificates.")
        )