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
    <meta name="description" content="Blue Lui (LUI Ying Lam) - PhD Researcher in Neurodevelopment at CUHK. Mouse Disease Model | Scientific Illustrator">
    <meta name="keywords" content="Blue Lui, LUI Ying Lam, CUHK, PhD, Neurodevelopment, Mouse Disease Model, Scientific Illustration">
    <meta name="author" content="Blue Lui">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Blue Lui | PhD Researcher in Neurodevelopment">
    <meta property="og:description" content="PhD Candidate at CUHK studying cerebellar ataxia and Purkinje cell development. Scientific illustrator & designer.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Blue Lui | PhD Researcher in Neurodevelopment">
    <meta name="twitter:description" content="PhD Candidate at CUHK studying cerebellar ataxia and Purkinje cell development.">
    <title>Blue Lui | PhD Researcher in Neurodevelopment</title>
    <link rel="shortcut icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABH0lEQVR4nGPUjm5hoCVgoqnpDKMWEAFG42AEBBELVtG1bSnqcuJw7s/ff24/fjVx1YHjV+5DRJY1JjAwMETVLyDTAgYGhkMX7mT1rAT5kZFRTIi3Jt5jWkm4b9mMJ68+UDmI/v3//+Ltp4mrD7CyMNsbqNIqDliYQSq//fhFqgUshJ3AyCglyl8U4fTszcddp65TzQI7A5UrS6qRRToW7/5KRR/AI5mBgYGfh9PHSqc81pWFmXHBtpPUj4OPX74v3XV6z+kbsR5mNMxoz15/FBXgZWSkmQVqcmJ3n735/58GFnBzsMV5mlvqKM1Yf5gmqejHr9+3H78umrR29+kbcAV6ytJoyWzVvnNN87ajmcM42qoY/hUO06gFhMDQDyIAeUxjzjMX+aUAAAAASUVORK5CYII=">
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABH0lEQVR4nGPUjm5hoCVgoqnpDKMWEAFG42AEBBELVtG1bSnqcuJw7s/ff24/fjVx1YHjV+5DRJY1JjAwMETVLyDTAgYGhkMX7mT1rAT5kZFRTIi3Jt5jWkm4b9mMJ68+UDmI/v3//+Ltp4mrD7CyMNsbqNIqDliYQSq//fhFqgUshJ3AyCglyl8U4fTszcddp65TzQI7A5UrS6qRRToW7/5KRR/AI5mBgYGfh9PHSqc81pWFmXHBtpPUj4OPX74v3XV6z+kbsR5mNMxoz15/FBXgZWSkmQVqcmJ3n735/58GFnBzsMV5mlvqKM1Yf5gmqejHr9+3H78umrR29+kbcAV6ytJoyWzVvnNN87ajmcM42qoY/hUO06gFhMDQDyIAeUxjzjMX+aUAAAAASUVORK5CYII=">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
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
    padding: 0.5rem;
    position: relative;
    z-index: 1001;
    min-width: 44px;
    min-height: 44px;
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

.hero-profile-carousel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.hero-profile-carousel img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    z-index: 0;
    pointer-events: none;
}

.hero-profile-carousel img.active {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
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
        z-index: 1001;
        pointer-events: none;
    }

    .nav-menu.active {
        transform: translateY(0);
        pointer-events: auto;
        display: flex !important;
        visibility: visible;
        opacity: 1;
    }

    .nav-toggle {
        display: block;
        padding: 0.5rem;
        position: relative;
        z-index: 1001;
        min-width: 44px;
        min-height: 44px;
        -webkit-tap-highlight-color: transparent;
    }
    
    .nav-toggle i {
        pointer-events: none;
    }

    .hero-title {
        font-size: 2.8rem;
    }

    .hero {
        padding-bottom: 6rem;
    }

    .hero-scroll {
        bottom: 1rem;
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
                        <span data-en="Mouse Disease Model" data-zh="小鼠疾病模型">Mouse Disease Model</span> |
                        <span data-en="Scientific Illustrator" data-zh="科學插畫師">Scientific Illustrator</span>
                    </p>
                    <div class="hero-buttons">
                        <a href="#research" class="btn btn-primary" data-en="View Research" data-zh="探索我的研究">View Research</a>
                        <a href="Blue_Lui_CV.docx" class="btn btn-secondary" download data-en="Download CV" data-zh="下載履歷">Download CV</a>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-image-wrapper">
                        <div class="hero-profile-carousel" id="profileCarousel">
                            <img src="data:image/jpeg;base64,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" alt="Blue Lui Profile 1" class="active">
                            <img src="data:image/jpeg;base64,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" alt="Blue Lui Profile 2">
                            <img src="data:image/jpeg;base64,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" alt="Blue Lui Profile 3">
                            <img src="data:image/jpeg;base64,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" alt="Blue Lui Profile 4">
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
                    <p data-en="I am a final-year PhD Candidate at The Chinese University of Hong Kong (CUHK), specializing in Cell and Molecular Biology. My research focuses on cerebellar ataxia and Purkinje cell development, utilizing mouse models to study disease mechanisms." data-zh="我現為香港中文大學（CUHK）細胞與分子生物學博士候選人，正處於畢業前的最後階段。我的研究專注於小腦萎縮症和浦肯野細胞的發育，利用小鼠模型研究疾病機制。">
                        I am a final-year PhD Candidate at The Chinese University of Hong Kong (CUHK), specializing in Cell and Molecular Biology. My research focuses on cerebellar ataxia and Purkinje cell development, utilizing mouse models to study disease mechanisms.
                    </p>
                    <p data-en="Beyond the lab bench, I am passionate about bridging the gap between complex science and visual communication. I believe that beautiful, accurate scientific illustrations can make research accessible to everyone." data-zh="除了實驗室的工作，我熱衷於搭建複雜科學與視覺傳播之間的橋樑。我相信，精美而準確的科學插畫能讓研究變得人人可及。">
                        Beyond the lab bench, I am passionate about bridging the gap between complex science and visual communication. I believe that beautiful, accurate scientific illustrations can make research accessible to everyone.
                    </p>
                    <div class="about-tags">
                        <span class="tag">Neurodevelopment</span>
                        <span class="tag">Cerebellar Disease</span>
                        <span class="tag">Mouse Models</span>
                        <span class="tag">Disease Modeling</span>
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
                        <li data-en="Mouse disease model generation and phenotyping" data-zh="小鼠疾病模型建立與表型分析">Mouse disease model generation and phenotyping</li>
                        <li data-en="iPSC-derived neuronal differentiation and disease modeling" data-zh="iPSC 衍生神經元分化與疾病建模">iPSC-derived neuronal differentiation and disease modeling</li>
                    </ul>
                </div>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h4><i class="fas fa-dna"></i> <span data-en="Molecular Biology" data-zh="分子生物學">Molecular Biology</span></h4>
                        <div class="skill-tags">
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
                        <a href="https://pubmed.ncbi.nlm.nih.gov/41017421/" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
                    </div>
                </div>
                <div class="publication-card">
                    <div class="pub-year">2025</div>
                    <div class="pub-content">
                        <h4>Lee, L. K. C., ..., <strong>Lui, Y.L.</strong>, et al. (2025). Small Gold Nanoparticles Alleviate Huntington's Disease via Modulating p38α Mitogen-Activated Protein Kinase and Pyruvate Dehydrogenase Kinase 1</h4>
                        <p class="pub-journal"><em>ACS Nano</em></p>
                        <a href="https://pubmed.ncbi.nlm.nih.gov/41429604/" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
                    </div>
                </div>
                <div class="publication-card">
                    <div class="pub-year">2023</div>
                    <div class="pub-content">
                        <h4>Chen, Z., ..., <strong>Lui, Y.L.</strong>, et al. (2023). Combination of untargeted and targeted proteomics for secretome analysis of L-WRN cells.</h4>
                        <p class="pub-journal"><em>Analytical and Bioanalytical Chemistry</em></p>
                        <a href="https://pubmed.ncbi.nlm.nih.gov/36656349/" class="pub-link" target="_blank"><i class="fas fa-external-link-alt"></i> <span data-en="View Article" data-zh="查看文章">View Article</span></a>
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

        try {
            localStorage.setItem('bluelui-lang', lang);
        } catch (e) {
            console.log('localStorage not available');
        }
    }

    // Initialize language from localStorage or default to EN
    let savedLang = 'en';
    try {
        savedLang = localStorage.getItem('bluelui-lang') || 'en';
    } catch (e) {
        console.log('localStorage not available');
    }
    setLanguage(savedLang);

    langToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLanguage(currentLang === 'en' ? 'zh' : 'en');
    });
    
    langToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLanguage(currentLang === 'en' ? 'zh' : 'en');
    }, { passive: false });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    function toggleMenu() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    navToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    }, { passive: false });

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

    // Profile Photo Carousel
    const carouselImages = document.querySelectorAll('#profileCarousel img');
    let currentImage = 0;
    if (carouselImages.length > 1) {
        setInterval(() => {
            carouselImages[currentImage].classList.remove('active');
            currentImage = (currentImage + 1) % carouselImages.length;
            carouselImages[currentImage].classList.add('active');
        }, 3000);
    }

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
            btn.textContent = curr        } catch (err) {
            btn.textContent = currentLang === 'en' ? 'Error, please try again' : '錯誤，請重試';
            btn.style.background = '#e74c3c';
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

// Send email via Resend
async function sendEmail(name, email, message) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer re_emuqc6GX_DemNSWptQFwmooqA4orNQgTJ'
      },
      body: JSON.stringify({
        from: 'Blue Lui Website <onboarding@resend.dev>',
        to: ['lbmkyi1@gmail.com'],
        subject: 'New Contact Form Message from ' + name,
        text: 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message
      })
    });
    const responseBody = await res.json().catch(() => ({}));
    console.log('Resend response:', JSON.stringify(responseBody));
    return res.ok && responseBody.id ? responseBody.id : false;
  } catch (e) {
    console.error('Email send failed:', e);
    return false;
  }
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
        
        // Send email notification
        const emailSent = await sendEmail(name, email, message);
        
        return jsonResponse({ success: true, message: 'Message saved', emailSent });
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
    
    // favicon.ico - Safari requires real ICO format
    if (path === '/favicon.ico') {
      const faviconIco = Uint8Array.from(atob('AAABAAIAEBAAAAAAIABqAgAAJgAAACAgAAAAACAAwAEAAJACAACJUE5HDQoaCgAAAA1JSERSAAAAEAAAABAIBgAAAB/z/2EAAAIxSURBVHichVO/a1RBEP5mdu/e/UggKWIlWIjgeUWwCahooRCRoEkTSLTQSuythCAiwX/AP0FQQRAVRC1E0MIoilgkwRAQVIKJF3PJ5X6+tzsyq7mcRuPA7tt9O983szPfEgDsG7t6ykTRHe8SAxGD7YzIsbHONZujM7cvP6DC6clhY80tiGTE++CyLQEgxKxEDZe4cWsM34MXiHcCUuvwlF9Bdd2RgzgnxCarWBuiigSwfuLEw3mBYUI6ZcOR7pk7mIOvEwiRbf8AkLIGO3q7kcukUak18HV5DVHahn2zFXdmEUA6s06GGWvVOkaP7sels8cxUNiFi+PHMHKkX7lx7cJJ5LIRnPdbCsQbC02zKxvh2ds5XLl+Fzcev8bgwN5Ans2k/llZ22YioNFKMDhQgDWMoQNFPHw5jWYch2LK/whEAGMIc58W8fTNByx+r2DoYBHP380jSRwsM4xhMFHIdssV1DTy56UypqY/4sX7efT1dCGfScOLoLxew8paDZVaE3+/AhOq9RYO9+/GxLkT2LOzD09ezeLLt3KozfnhQ+GKpfI6Hk3NtAmoeGYy5BPaaBi93bnQNiVbKJWRshbd+Qg9+WzoSDNOsLRS+SMDEVENxonDQmm1LaQonQpCWq3UsbxaDVE0U9XLz6oR2aBrAamUlSSd2nxLCg5RLMN2lEu8qJRJe8vO+REw1ckEYMBsjE2i34YEX6a6Ynn25sR934rHiE0MovActzUir76KUewPDWwF9KCMKosAAAAASUVORK5CYIKJUE5HDQoaCgAAAA1JSERSAAAAIAAAACAIBgAAAHN6evQAAAGHSURBVHicY2RAA9rRLf8ZaAiuLq1hROYz0dNybHYw0dNybHYx0dtydEcwDoTlONPAQACmAbF11AGDKQpY8EmubUthUJcTRxH7+fsPw+3HrxgmrjrAcPzKfbj4ssYEMB1Vv4B6DgCBQxfuMGT1rASzmRgZGcSEeBlq4j0YppWEM/iWzWB48uoDA92i4N///wwv3n5imLj6AAMrCzODvYEqRZaT7AAYYGGGaPv24xfFDmAhRTEoCqRE+RmKIpwYnr35yLDr1HXaO8DOQIXhypJqDPGOxbsZvtIjBA4hJUIQ4OfhZPCx0mEoj3VlYGFmZFiw7SR908DHL98Zlu46zbDn9A2GWA8ziiwnywEw8Oz1RwZRAV4GRsYBcoCanBjD3WdvGP7/p7MDuDnYGOI8zRksdZQYZqw/TP9c8OPXb4bbj18zFE1ay7D79A0UtXrK0lhzzKp95xia5m3Haj7jaIuIYYAB06gDGAY6Cq6i9dXoCUB2g0NgIBwBs5MJXYCelqM4gF6OQLcDANbthblQt59fAAAAAElFTkSuQmCC'), c => c.charCodeAt(0));
      return new Response(faviconIco, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'no-cache, max-age=0'
        }
      });
    }
    
    // Apple touch icon
    if (path === '/apple-touch-icon.png') {
      const appleIcon = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAHgUlEQVR4nO3da1BUZRzH8WeXPbvcXOWigBAkiWDgSKCmhuWtoqhIS22iizqWSbepmS5TOVNoZU32ol440qRTzTSl3TDFrMZRR5IuYoikyCCEroKorMhl2YXdptmZXtT+1iw5l31+n5f7nF3+L77D2XM452DKLlktiAIxB3yViHFQMPzNQRDjIIhxEMQ4CGIcBDEOghgHQYyDIMZBEOMgiHEQxDgIYhwEMQ6CGAdBjIMgxkEQ4yCIcRDEOAhiHAQxDoIYB0GMgyDGQRDjIIhxEMQ4CGIcBDEOghgHQYyDIMZBEOMgiHEQxDgIYhwEMQ6CGAdBjIMgxkEQ4yCIcRDEOAhiHAQxDoIYB0GMgyDGQRDjIIhxEMQ4CGIcBDEOghgHQYyDIMZBEOMgyCK0c9t1OWtWFF/ez/T6fP3uAVe/x9nd5zjjPHHaWdd08sDR463tnZfl81MTYirXlgZc2rSzpmzDdhFCtIxjKJhNpgibEmFTYuyRY0bHCSHumZsvhGhpO1f5Q/0Xu39tO9ul9YyGIctu5crE2NL5M7avLV25uDBmWKTW4xiDLHH4KZawRXPzK954eFbeOK1nMQC54vCLtUe989SC+wunaD2I3skYhxDCZBLP3Xcj+whO0jj8nrl37vQJ6VpPoV9Sx2E2m8qWFYVbFa0H0SmdHsouWrmhvvnUv9/eEma2Khab1RJvj4ofET0mKS4rLWHahPSkOHvwNybG2R+6Y/q7n+3+3yOHIJ3GcakGBr0Dg+5el7uzq7fxRMe+Q83+1ydmJC8vLrg+d2yQ95bcNPm9LT+43B61hjWMEN+t1DY6St/69Pl1FW7PINomOtJWOHW8unMZQ4jH4be16tDT737u88EN5k7KUnUgg5AiDiHErprGzTtr0OrEscnqjmMMssQhhCjfUoV+ecTYIy/61VVCEsXRdrar7pgDrcbao9QdxwAkikMIUX8MHh4Pj45QdxYDkCuODme31iMYiVxxuAfgAa2zu0/dWQxArjiiI2xoyXmhV91ZDECuONISYgO+3t3X33aOV4jJHUdeZkrA12sajnu9+ByZrCSKY8rVaQmxgU9mVNe3qD6OAcgSh9lkemLBzIBLff2er/bUqj6RAcgSx5MLZ+VmBN6nfL7rQFePS/WJDCBE/mQfhFUJe7bkRv8NCv/Ufq5r3Zd7VR/KGEI5jshw683Xjl9eXJAyakTADbw+33PrKs7zDEdox2E2m2yKJdymjBwRPTp++NjkkdeMS5k8Pi0y3Ire4vOJVRu3/3K4Vd1JjUSncXy6aumQfr7L7Xlx/dc7fjw8pD/F6HQax5CqbXS8WP51y6mzWg+id3LF0d3X/+oHO7ZW1QW5KoykO5T1i46wPXjLtfNuyLUqYVrPYgByxSGEyEpLKFtWVPlW6V0zc81mk9bj6Jp0cfglxtlfWVb08cuLM1JGaj2Lfkkah19O+uhPVi29dVq21oPolNRxCCFsiuXNR+9cODtP60H0KERuh/SzKRarYomOsI6KHZYYa89KS8xJT8rPTL3o18+XlhQeP935131ypOs4/pt+z0C/Z+BCr+vU2a5a4fCf44oKt86ZlLmkaGrGFaPQG80m0+sr7rj9mfUXevkXOJl2Kz0u95a9dfNfeK9sw/YelxttFj88+pF5BeqOpnehH4efz/fn0/4eKPvwzHl4AfqiOXn2qHB159I1WeLwa2htf/ztzeim6nCrUjQ9R/Wh9EuuOIQQdU0nP/rmJ7Q6O58PkpM4DiHExm37Bga9AZdyM1J42lTqOJzdfdX1gY9aI2xKWmLg2xckJGMc/p0LWkqOD3zZmIQkjePkmfNoKcbO5xvLHUdPHzzhEcGHC0oeRxS+trTfM6DuLPolaRxB9h2dvKNa8jiyxyShJecFPotB4jjCwsyTslIDLnl9vmZeeCxzHHPyM+OGB34C2JHf2/mHWXnjsISZV8yfgVZ/Pvy7uuPomnRxrJg3I8h1o9uqDqk7jq7JFcfds65Zfie8aGN/w/HfWtrUnUjXQupKsCBsiuWxu29YUjQ1yDYfVFarOJEBhH4cNsVy67Tsh4qvS02ICbLZ3oNNO/cfVXEuAwi1OMxmU7hViRkWmRRvz0xNyBt3RcHEq4KcD/Xrdblfeb9SrRkNQ9K77P/mtQ93nPrf/2924ey8ob7F4dG1m3YfaBRqkesLaUDlFVVf7Tmo9RR6JHscG7dVv7N5l9ZT6JROdysqcHsG13z07Sb8T1hI0jgONjlWlm9tcpzRehBdky6Oo62n11fs/e6nI14+wOViZInjXFfP9z83VO6r39/QyiokjWNw0Nvn9rjcns6uXkfHeUeH80hr+6+NJ5pP8glgl8yUXbL60t9FUpD9UJaCYBwEMQ6CGAdBjIMgxkEQ4yCIcRDEOAhiHAQxDoIYB0GMgyDGQRDjIIhxEMQ4CGIcBDEOghgHQYyDIMZBEOMgiHEQxDgIYhwEMQ6CGAdBjIMgxkEQ4yCIcRDEOAhiHAQxDoIYB0GMgyDGQRDjIIhxEMQ4CGIcBDEOghgHQYyDIMZBEOMgiHEQxDgIYhwEMQ6CGAdBjIME8gccA8qZbf/hLAAAAABJRU5ErkJggg=='), c => c.charCodeAt(0));
      return new Response(appleIcon, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, max-age=0'
        }
      });
    }
    
    // Serve HTML for all other paths
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
