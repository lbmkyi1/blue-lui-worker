// Blue Lui Personal Website - Cloudflare Worker with D1 Database
// Serves portfolio site + handles contact form submissions

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// HTML Content
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Blue Lui (LUI Ying Lam) - PhD Researcher in Neurodevelopment at CUHK. CRISPR & Stem Cell Biologist | Scientific Illustrator">
    <meta name="keywords" content="Blue Lui, LUI Ying Lam, CUHK, PhD, Neurodevelopment, CRISPR, Stem Cell, Scientific Illustration">
    <meta name="author" content="Blue Lui">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Blue Lui | PhD Researcher in Neurodevelopment">
    <meta property="og:description" content="PhD Candidate at CUHK studying cerebellar ataxia and Purkinje cell development. Scientific illustrator & designer.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Blue Lui | PhD Researcher in Neurodevelopment">
    <meta name="twitter:description" content="PhD Candidate at CUHK studying cerebellar ataxia and Purkinje cell development.">
    <title>Blue Lui | PhD Researcher in Neurodevelopment</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>/* ============================================
   Blue Lui Personal Website - Style Guide
   Design System: Professional yet Warm
   ============================================ */

/* CSS Variables */
:root {
    --primary: #2B5B84;
    --primary-light: #3d7ab0;
    --secondary: #5D9CEC;
    --bg-main: #F8F9FA;
    --bg-alt: #FFFFFF;
    --text-primary: #2C3E50;
    --text-secondary: #7F8C8D;
    --shadow: rgba(43, 91, 132, 0.08);
    --shadow-hover: rgba(43, 91, 132, 0.15);
    --transition: all 0.3s ease;
    --radius: 12px;
    --radius-lg: 20px;
    --container-max: 1100px;
}

/* Reset & Base */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-main);
    color: var(--text-primary);
    line-height: 1.7;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 600;
    line-height: 1.3;
}

a {
    color: var(--primary);
    text-decoration: none;
    transition: var(--transition);
}

a:hover {
    color: var(--secondary);
}

img {
    max-width: 100%;
    height: auto;
}

/* Container */
.container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 2rem;
}

/* ============================================
   Navigation
   ============================================ */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 1000;
    transition: var(--transition);
}

.nav-container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

.nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--secondary);
    transition: var(--transition);
}

.nav-link:hover::after {
    width: 100%;
}

.lang-toggle {
    background: var(--bg-main);
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.lang-toggle:hover {
    background: var(--primary);
    color: white;
}

.nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--primary);
    cursor: pointer;
}

/* ============================================
   Buttons
   ============================================ */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: var(--transition);
    border: none;
}

.btn-primary {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 15px rgba(43, 91, 132, 0.3);
}

.btn-primary:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(43, 91, 132, 0.4);
}

.btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.btn-secondary:hover {
    background: var(--primary);
    color: white;
}

/* ============================================
   Hero Section
   ============================================ */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e8f0f8 50%, #f0f4f8 100%);
    padding-top: 70px;
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(93, 156, 236, 0.1) 0%, transparent 70%);
    border-radius: 50%;
}

.hero-container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
}

.hero-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-greeting {
    font-size: 1.1rem;
    color: var(--secondary);
    font-weight: 500;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
}

.hero-title {
    font-size: 4.5rem;
    color: var(--primary);
    margin-bottom: 0.3rem;
    line-height: 1.1;
}

.hero-subtitle {
    font-size: 1.3rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
}

.hero-tagline {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: var(--primary);
    font-style: italic;
    margin-bottom: 1rem;
}

.hero-role {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.8;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-image-wrapper {
    position: relative;
    width: 320px;
    height: 320px;
}

.hero-image-wrapper::before {
    content: '';
    position: absolute;
    inset: -10px;
    border: 3px solid var(--secondary);
    border-radius: 50%;
    opacity: 0.3;
}

.hero-image-wrapper::after {
    content: '';
    position: absolute;
    inset: -20px;
    border: 2px dashed var(--primary);
    border-radius: 50%;
    opacity: 0.15;
    animation: spin 60s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.hero-image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;
    position: relative;
    z-index: 1;
}

.hero-image-placeholder p {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-family: 'Inter', sans-serif;
    opacity: 0.9;
}

.hero-scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
}

.scroll-indicator {
    color: var(--primary);
    font-size: 1.5rem;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

/* ============================================
   Sections General
   ============================================ */
.section {
    padding: 5rem 0;
}

.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-title {
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 0.8rem;
}

.section-line {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    margin: 0 auto;
    border-radius: 2px;
}

/* ============================================
   About Section
   ============================================ */
.about {
    background: var(--bg-alt);
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.about-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.7rem;
    margin-top: 2rem;
}

.tag {
    background: linear-gradient(135deg, rgba(43, 91, 132, 0.08), rgba(93, 156, 236, 0.08));
    color: var(--primary);
    padding: 0.5rem 1.2rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(43, 91, 132, 0.15);
}

/* ============================================
   Research & Skills
   ============================================ */
.research {
    background: var(--bg-main);
}

.research-focus {
    background: var(--bg-alt);
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px var(--shadow);
}

.research-focus h3 {
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
}

.research-focus ul {
    list-style: none;
    padding: 0;
}

.research-focus li {
    padding: 0.7rem 0;
    padding-left: 1.8rem;
    position: relative;
    color: var(--text-secondary);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.research-focus li:last-child {
    border-bottom: none;
}

.research-focus li::before {
    content: '\\f0a4';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    left: 0;
    color: var(--secondary);
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.skill-category {
    background: var(--bg-alt);
    padding: 2rem;
    border-radius: var(--radius);
    box-shadow: 0 4px 15px var(--shadow);
    transition: var(--transition);
}

.skill-category:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px var(--shadow-hover);
}

.skill-category h4 {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: var(--primary);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.skill-category h4 i {
    color: var(--secondary);
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: rgba(93, 156, 236, 0.12);
    color: var(--primary);
    padding: 0.35rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 500;
}

/* ============================================
   Publications
   ============================================ */
.publications {
    background: var(--bg-alt);
}

.publications-list {
    max-width: 900px;
    margin: 0 auto;
}

.publication-card {
    display: flex;
    gap: 1.5rem;
    background: var(--bg-main);
    padding: 1.8rem;
    border-radius: var(--radius);
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 15px var(--shadow);
    transition: var(--transition);
}

.publication-card:hover {
    transform: translateX(5px);
    box-shadow: 0 6px 20px var(--shadow-hover);
}

.pub-year {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--secondary);
    min-width: 70px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pub-content h4 {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.pub-content h4 strong {
    color: var(--primary);
}

.pub-journal {
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: 0.8rem;
    font-size: 0.9rem;
}

.pub-link {
    font-size: 0.85rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.publication-note {
    background: linear-gradient(135deg, rgba(93, 156, 236, 0.1), rgba(43, 91, 132, 0.05));
    padding: 1.2rem 1.8rem;
    border-radius: var(--radius);
    color: var(--primary);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    border-left: 4px solid var(--secondary);
}

/* ============================================
   Awards & Teaching
   ============================================ */
.awards {
    background: var(--bg-main);
}

.awards-timeline {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.awards-timeline::before {
    content: '';
    position: absolute;
    left: 60px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--secondary), var(--primary));
}

.timeline-item {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
    position: relative;
}

.timeline-year {
    min-width: 100px;
    text-align: right;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);
    padding-top: 0.3rem;
}

.timeline-content {
    background: var(--bg-alt);
    padding: 1.5rem 2rem;
    border-radius: var(--radius);
    box-shadow: 0 4px 15px var(--shadow);
    flex: 1;
    position: relative;
}

.timeline-content::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 20px;
    width: 16px;
    height: 16px;
    background: var(--secondary);
    border-radius: 50%;
    border: 3px solid var(--bg-alt);
}

.timeline-content h4 {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.timeline-content p {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

/* ============================================
   Beyond the Lab
   ============================================ */
.beyond {
    background: var(--bg-alt);
}

.beyond-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.beyond-card {
    background: var(--bg-main);
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: 0 4px 20px var(--shadow);
    transition: var(--transition);
}

.beyond-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px var(--shadow-hover);
}

.beyond-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 1.8rem;
    color: white;
}

.beyond-card h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 1rem;
}

.beyond-card p {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

/* ============================================
   Contact Section
   ============================================ */
.contact {
    background: linear-gradient(135deg, var(--bg-main) 0%, #e8f0f8 100%);
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
}

.contact-intro {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 2rem;
    line-height: 1.7;
}

.contact-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--bg-alt);
    border-radius: var(--radius);
    box-shadow: 0 2px 10px var(--shadow);
    transition: var(--transition);
}

.contact-link:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px var(--shadow-hover);
    color: var(--primary);
}

.contact-link i {
    font-size: 1.3rem;
    color: var(--secondary);
    width: 30px;
    text-align: center;
}

.contact-form-wrapper {
    background: var(--bg-alt);
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 30px var(--shadow);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.9rem 1.2rem;
    border: 2px solid #e2e8f0;
    border-radius: var(--radius);
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: var(--text-primary);
    transition: var(--transition);
    background: var(--bg-main);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(93, 156, 236, 0.15);
}

.contact-form .btn {
    width: 100%;
    justify-content: center;
}

/* ============================================
   Footer
   ============================================ */
.footer {
    background: var(--primary);
    color: rgba(255, 255, 255, 0.85);
    padding: 2.5rem 0;
    text-align: center;
}

.footer-text {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.footer-text strong {
    color: white;
}

.footer-affiliation {
    font-size: 0.85rem;
    opacity: 0.7;
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

/* ============================================
   Responsive Design
   ============================================ */
@media (max-width: 992px) {
    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }

    .hero-title {
        font-size: 3.5rem;
    }

    .hero-buttons {
        justify-content: center;
    }

    .hero-visual {
        order: -1;
    }

    .hero-image-wrapper {
        width: 250px;
        height: 250px;
    }

    .skills-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}

@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background: white;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        gap: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transform: translateY(-150%);
        transition: transform 0.3s ease;
        z-index: 999;
    }

    .nav-menu.active {
        transform: translateY(0);
    }

    .nav-toggle {
        display: block;
    }

    .hero-title {
        font-size: 2.8rem;
    }

    .hero-tagline {
        font-size: 1.2rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .skills-grid {
        grid-template-columns: 1fr;
    }

    .beyond-grid {
        grid-template-columns: 1fr;
    }

    .publication-card {
        flex-direction: column;
    }

    .pub-year {
        text-align: left;
    }

    .awards-timeline::before {
        left: 20px;
    }

    .timeline-item {
        flex-direction: column;
        gap: 0.5rem;
    }

    .timeline-year {
        text-align: left;
        min-width: auto;
    }

    .timeline-content::before {
        left: -28px;
    }

    .container {
        padding: 0 1.5rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2.2rem;
    }

    .hero-image-wrapper {
        width: 200px;
        height: 200px;
    }

    .btn {
        padding: 0.7rem 1.5rem;
        font-size: 0.9rem;
    }

    .section {
        padding: 3rem 0;
    }
}
</style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="#" class="nav-logo">💙 Blue Lui</a>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="#hero" class="nav-link" data-en="Home" data-zh="首頁">Home</a></li>
                <li><a href="#about" class="nav-link" data-en="About" data-zh="關於我">About</a></li>
                <li><a href="#research" class="nav-link" data-en="Research" data-zh="研究">Research</a></li>
                <li><a href="#publications" class="nav-link" data-en="Publications" data-zh="發表">Publications</a></li>
                <li><a href="#awards" class="nav-link" data-en="Awards" data-zh="榮譽">Awards</a></li>
                <li><a href="#beyond" class="nav-link" data-en="Beyond Lab" data-zh="實驗室之外">Beyond Lab</a></li>
                <li><a href="#contact" class="nav-link" data-en="Contact" data-zh="聯絡">Contact</a></li>
            </ul>
            <button class="lang-toggle" id="langToggle" aria-label="Toggle language">
                <span class="lang-en">EN</span> / <span class="lang-zh">繁中</span>
            </button>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="hero">
        <div class="hero-container">
            <div class="hero-content">
                <div class="hero-text">
                    <p class="hero-greeting" data-en="Hello, I'm" data-zh="你好，我是">Hello, I'm</p>
                    <h1 class="hero-title">Blue Lui</h1>
                    <p class="hero-subtitle" data-en="(LUI Ying Lam)" data-zh="(呂映霖)">(LUI Ying Lam)</p>
                    <p class="hero-tagline" data-en="Decoding the Cerebellum. Designing the Future." data-zh="解碼小腦奧秘，繪畫科學未來。">Decoding the Cerebellum. Designing the Future.</p>
                    <p class="hero-role">
                        <span data-en="PhD Researcher in Neurodevelopment" data-zh="神經發展學博士研究員">PhD Researcher in Neurodevelopment</span> |
                        <span data-en="CRISPR & Stem Cell Biologist" data-zh="CRISPR 與幹細胞生物學家">CRISPR & Stem Cell Biologist</span> |
                        <span data-en="Scientific Illustrator" data-zh="科學插畫師">Scientific Illustrator</span>
                    </p>
                    <div class="hero-buttons">
                        <a href="#research" class="btn btn-primary" data-en="View Research" data-zh="探索我的研究">View Research</a>
                        <a href="Blue_Lui_CV.docx" class="btn btn-secondary" download data-en="Download CV" data-zh="下載履歷">Download CV</a>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-image-wrapper">
                        <div class="hero-image-placeholder">
                            <i class="fas fa-user"></i>
                            <p data-en="Your Photo" data-zh="你的照片">Your Photo</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-scroll">
                <a href="#about" class="scroll-indicator">
                    <i class="fas fa-chevron-down"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section about" id="about">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="About Me" data-zh="關於我">About Me</h2>
                <div class="section-line"></div>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <p data-en="I am a final-year PhD Candidate at The Chinese University of Hong Kong (CUHK), specializing in Cell and Molecular Biology. My research focuses on cerebellar ataxia and Purkinje cell development, utilizing mouse models and CRISPR gene editing technologies." data-zh="我現為香港中文大學（CUHK）細胞與分子生物學博士候選人，正處於畢業前的最後階段。我的研究專注於小腦萎縮症和浦肯野細胞的發育，利用小鼠模型和 CRISPR 基因編輯技術進行探索。">
                        I am a final-year PhD Candidate at The Chinese University of Hong Kong (CUHK), specializing in Cell and Molecular Biology. My research focuses on cerebellar ataxia and Purkinje cell development, utilizing mouse models and CRISPR gene editing technologies.
                    </p>
                    <p data-en="Beyond the lab bench, I am passionate about bridging the gap between complex science and visual communication. I believe that beautiful, accurate scientific illustrations can make research accessible to everyone." data-zh="除了實驗室的工作，我熱衷於搭建複雜科學與視覺傳播之間的橋樑。我相信，精美而準確的科學插畫能讓研究變得人人可及。">
                        Beyond the lab bench, I am passionate about bridging the gap between complex science and visual communication. I believe that beautiful, accurate scientific illustrations can make research accessible to everyone.
                    </p>
                    <div class="about-tags">
                        <span class="tag">Neurodevelopment</span>
                        <span class="tag">Cerebellar Disease</span>
                        <span class="tag">CRISPR</span>
                        <span class="tag">Stem Cell Biology</span>
                        <span class="tag">Scientific Illustration</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Research & Skills Section -->
    <section class="section research" id="research">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="Research & Skills" data-zh="研究與技能">Research & Skills</h2>
                <div class="section-line"></div>
            </div>
            <div class="research-content">
                <div class="research-focus">
                    <h3 data-en="Research Focus" data-zh="研究重點">Research Focus</h3>
                    <ul>
                        <li data-en="Investigating Yy1-regulated molecular pathways in Purkinje cell development" data-zh="探究 Yy1 調控的浦肯野細胞發育分子路徑">Investigating Yy1-regulated molecular pathways in Purkinje cell development</li>
                        <li data-en="In vivo and in vitro neuronal assays" data-zh="活體與離體神經元實驗">In vivo and in vitro neuronal assays</li>
                        <li data-en="CRISPR-mediated gene editing in neuronal systems" data-zh="神經系統中的 CRISPR 基因編輯">CRISPR-mediated gene editing in neuronal systems</li>
                        <li data-en="iPSC-derived neuronal differentiation and disease modeling" data-zh="iPSC 衍生神經元分化與疾病建模">iPSC-derived neuronal differentiation and disease modeling</li>
                    </ul>
                </div>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h4><i class="fas fa-dna"></i> <span data-en="Molecular Biology" data-zh="分子生物學">Molecular Biology</span></h4>
                        <div class="skill-tags">
                            <span class="skill-tag">CRISPR</span>
                            <span class="skill-tag">iPSC Culture</span>
                            <span class="skill-tag">Molecular Cloning</span>
                            <span class="skill-tag">Western Blot</span>
                            <span class="skill-tag">qPCR</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4><i class="fas fa-mouse"></i> <span data-en="Animal Models" data-zh="動物模型">Animal Models</span></h4>
                        <div class="skill-tags">
                            <span class="skill-tag">Mouse Handling</span>
                            <span class="skill-tag">Rodent Surgery</span>
                            <span class="skill-tag">In Vivo Assays</span>
                            <span class="skill-tag">Ex Vivo Assays</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4><i class="fas fa-microscope"></i> <span data-en="Imaging" data-zh="影像技術">Imaging</span></h4>
                        <div class="skill-tags">
                            <span class="skill-tag">Immunofluorescence</span>
                            <span class="skill-tag">Confocal Microscopy</span>
                            <span class="skill-tag">Super-resolution</span>
                            <span class="skill-tag">Cryo-EM/ET</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Publications Section -->
    <section class="section publications" id="publications">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="Publications" data-zh="學術發表">Publications</h2>
                <div class="section-line"></div>
            </div>
            <div class="publications-list">
                <div class="publication-card">
                    <div class="pub-year">2025</div>
                    <div class="pub-content">
                        <h4>Nuermila, Y., ..., <strong>Lui, Y.L.</strong>, et al. (2025). Pathogenicity of Mediator Complex Subunit 27 (MED27) in a Neurodevelopmental Disorder with Cerebellar Atrophy.</h4>
                        <p class="pub-journal"><em>Advanced Science</em></p>
                        <a href="#" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
                    </div>
                </div>
                <div class="publication-card">
                    <div class="pub-year">2025</div>
                    <div class="pub-content">
                        <h4>Lee, L. K. C., ..., <strong>Lui, Y.L.</strong>, et al. (2025). Small gold nanoparticles alleviate Huntington's disease...</h4>
                        <p class="pub-journal"><em>ACS Nano</em></p>
                        <a href="#" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
                    </div>
                </div>
                <div class="publication-card">
                    <div class="pub-year">2023</div>
                    <div class="pub-content">
                        <h4>Chen, Z., ..., <strong>Lui, Y.L.</strong>, et al. (2023). Combination of untargeted and targeted proteomics for secretome analysis of L-WRN cells.</h4>
                        <p class="pub-journal"><em>Analytical and Bioanalytical Chemistry</em></p>
                        <a href="#" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
                    </div>
                </div>
                <div class="publication-note">
                    <i class="fas fa-info-circle"></i>
                    <span data-en="One additional manuscript, as first author, currently under review." data-zh="另有一篇第一作者手稿正在審稿中。">One additional manuscript, as first author, currently under review.</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Awards & Teaching Section -->
    <section class="section awards" id="awards">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="Awards & Teaching" data-zh="榮譽與教學">Awards & Teaching</h2>
                <div class="section-line"></div>
            </div>
            <div class="awards-timeline">
                <div class="timeline-item">
                    <div class="timeline-year">2024/25</div>
                    <div class="timeline-content">
                        <h4 data-en="Winner, CUHK SLS Mascot Design Competition" data-zh="香港中文大學生命科學學院吉祥物設計比賽冠軍">Winner, CUHK SLS Mascot Design Competition</h4>
                        <p data-en="Designed the winning mascot for the School of Life Sciences." data-zh="為生命科學學院設計了獲勝的吉祥物。">Designed the winning mascot for the School of Life Sciences.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">2025</div>
                    <div class="timeline-content">
                        <h4 data-en="Best Poster Award, HK Inter-University Postgraduate Symposium" data-zh="香港跨大學研究生研討會最佳海報獎">Best Poster Award, HK Inter-University Postgraduate Symposium</h4>
                        <p data-en="Recognized for outstanding research presentation." data-zh="因出色的研究演示而獲得嘉獎。">Recognized for outstanding research presentation.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-year">2023–2024</div>
                    <div class="timeline-content">
                        <h4 data-en="Postgraduate Teaching Award, CUHK" data-zh="香港中文大學研究生教學獎">Postgraduate Teaching Award, CUHK</h4>
                        <p data-en="Excellence in mentoring undergraduates and supervising international summer research students." data-zh="在指導本科生和國際暑期研究學生方面表現卓越。">Excellence in mentoring undergraduates and supervising international summer research students.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Beyond the Lab Section -->
    <section class="section beyond" id="beyond">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="Beyond the Lab 💙" data-zh="實驗室之外 💙">Beyond the Lab 💙</h2>
                <div class="section-line"></div>
            </div>
            <div class="beyond-grid">
                <div class="beyond-card">
                    <div class="beyond-icon"><i class="fas fa-palette"></i></div>
                    <h3 data-en="Scientific Illustration" data-zh="科學插畫">Scientific Illustration</h3>
                    <p data-en="Creating visual narratives that make complex science accessible. Award-winning mascot designs and scientific diagrams." data-zh="創作視覺敘事，讓複雜科學變得易懂。獲獎的吉祥物設計和科學圖表。">Creating visual narratives that make complex science accessible. Award-winning mascot designs and scientific diagrams.</p>
                </div>
                <div class="beyond-card">
                    <div class="beyond-icon"><i class="fas fa-plane"></i></div>
                    <h3 data-en="Travel & Culture" data-zh="旅行與文化">Travel & Culture</h3>
                    <p data-en="Exploring new places and immersing in diverse cultures fuels my creativity and broadens my scientific perspective." data-zh="探索新地方、沉浸在多元文化中，激發我的創意並拓寬科學視野。">Exploring new places and immersing in diverse cultures fuels my creativity and broadens my scientific perspective.</p>
                </div>
                <div class="beyond-card">
                    <div class="beyond-icon"><i class="fas fa-heartbeat"></i></div>
                    <h3 data-en="Fitness & Wellness" data-zh="健身與健康">Fitness & Wellness</h3>
                    <p data-en="Maintaining balance through gym, running, and yoga — essential for surviving the PhD journey!" data-zh="透過健身、跑步和瑜伽保持平衡——這是撐過博士旅程的關鍵！">Maintaining balance through gym, running, and yoga — essential for surviving the PhD journey!</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section contact" id="contact">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-en="Contact" data-zh="聯絡我">Contact</h2>
                <div class="section-line"></div>
            </div>
            <div class="contact-content">
                <div class="contact-text">
                    <p class="contact-intro" data-en="Let's connect for research collaborations, career opportunities, or just to chat about science and design!" data-zh="歡迎聯絡我，不論是研究合作、職業機會，或只是想聊聊科學和設計！">Let's connect for research collaborations, career opportunities, or just to chat about science and design!</p>
                    <div class="contact-links">
                        <a href="mailto:blueluiyl@link.cuhk.edu.hk" class="contact-link">
                            <i class="fas fa-envelope"></i>
                            <span>blueluiyl@link.cuhk.edu.hk</span>
                        </a>
                        <a href="https://www.linkedin.com/in/blue-lui-a30b4315a" class="contact-link" target="_blank">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://www.researchgate.net/profile/Ying-Lam-Lui" class="contact-link" target="_blank">
                            <i class="fab fa-researchgate"></i>
                            <span>ResearchGate</span>
                        </a>
                    </div>
                </div>
                <div class="contact-form-wrapper">
                    <form class="contact-form" id="contactForm">
                        <div class="form-group">
                            <label for="name" data-en="Name" data-zh="姓名">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email" data-en="Email" data-zh="電郵">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message" data-en="Message" data-zh="訊息">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" data-en="Send Message" data-zh="發送訊息">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p class="footer-text">&copy; 2025 <strong>Blue Lui</strong> (LUI Ying Lam). <span data-en="All rights reserved." data-zh="版權所有。">All rights reserved.</span></p>
                <p class="footer-affiliation" data-en="PhD Candidate, School of Life Sciences, The Chinese University of Hong Kong" data-zh="香港中文大學生命科學學院博士候選人">PhD Candidate, School of Life Sciences, The Chinese University of Hong Kong</p>
            </div>
        </div>
    </footer>

    <script>/* ============================================
   Blue Lui Personal Website - Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle
    const langToggle = document.getElementById('langToggle');
    const htmlEl = document.documentElement;
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        htmlEl.lang = lang === 'zh' ? 'zh-Hant' : 'en';
        
        // Update all elements with data-en and data-zh attributes
        document.querySelectorAll('[data-en][data-zh]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });

        // Update form labels
        document.querySelectorAll('label[data-en][data-zh]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });

        // Update button text
        document.querySelectorAll('button[data-en][data-zh]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });

        // Update lang toggle visual
        const enSpan = langToggle.querySelector('.lang-en');
        const zhSpan = langToggle.querySelector('.lang-zh');
        if (lang === 'en') {
            enSpan.style.fontWeight = '700';
            enSpan.style.color = 'var(--primary)';
            zhSpan.style.fontWeight = '400';
            zhSpan.style.color = 'var(--text-secondary)';
        } else {
            enSpan.style.fontWeight = '400';
            enSpan.style.color = 'var(--text-secondary)';
            zhSpan.style.fontWeight = '700';
            zhSpan.style.color = 'var(--primary)';
        }

        localStorage.setItem('bluelui-lang', lang);
    }

    // Initialize language from localStorage or default to EN
    const savedLang = localStorage.getItem('bluelui-lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        setLanguage('en');
    }

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'zh' : 'en');
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section-header, .about-content, .research-focus, .skill-category, .publication-card, .timeline-item, .beyond-card, .contact-content');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = currentLang === 'en' ? 'Sending...' : '發送中...';
        btn.disabled = true;
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            
            if (res.ok) {
                contactForm.reset();
                btn.textContent = currentLang === 'en' ? 'Message Sent!' : '訊息已發送！';
                btn.style.background = '#27ae60';
            } else {
                throw new Error('Failed');
            }
        } catch (err) {
            btn.textContent = currentLang === 'en' ? 'Error, try email' : '錯誤，請用電郵';
            btn.style.background = '#e74c3c';
            // Fallback to mailto
            setTimeout(() => {
                const subject = encodeURIComponent('Message from ' + name + ' - Blue Lui Website');
                const body = encodeURIComponent('Name: ' + name + '\\nEmail: ' + email + '\\n\\nMessage:\\n' + message);
                window.location.href = 'mailto:blueluiyl@link.cuhk.edu.hk?subject=' + subject + '&body=' + body;
            }, 1500);
        }
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});
</script>
</body>
</html>
`;

// Initialize D1 table
async function initDB(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Init DB
    await initDB(env.DB);
    
    // API: Submit contact form
    if (path === '/api/contact' && method === 'POST') {
      try {
        const { name, email, message } = await request.json();
        if (!name || !email || !message) {
          return jsonResponse({ error: 'All fields required' }, 400);
        }
        
        await env.DB.prepare(
          'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
        ).bind(name, email, message).run();
        
        return jsonResponse({ success: true, message: 'Message saved' });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }
    
    // API: View all messages (simple admin endpoint)
    if (path === '/api/messages' && method === 'GET') {
      try {
        const messages = await env.DB.prepare(
          'SELECT * FROM contact_messages ORDER BY created_at DESC'
        ).all();
        return jsonResponse(messages.results || []);
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }
    
    // robots.txt
    if (path === '/robots.txt') {
      return new Response(`User-agent: *\nAllow: /\n\nSitemap: https://bluelui.pages.dev/sitemap.xml`, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    // sitemap.xml
    if (path === '/sitemap.xml') {
      const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://bluelui.pages.dev/</loc><lastmod>2026-04-18</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>';
      return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
    }
    
    // Serve HTML for all other paths
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
