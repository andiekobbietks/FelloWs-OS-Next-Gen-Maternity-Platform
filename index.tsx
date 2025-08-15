/**
 * FelloWS OS Simulator - Core Logic (Dynamic Content Generation)
 * Version: Full Implementation - Retro Style - Exhaustive Explanations - Corrected Icons & Flow
 * Purpose: Simulate an OS environment exploring the FELLOWS PRD with
 *          dynamic content, exhaustive Italian explanations for all jargon, diagrams,
 *          splash screen, and functional OS elements, using reliable retro icons.
 */

// --- DOM Element References (Usando classi/ID stile Gemini95) ---
const desktop = document.getElementById('desktop')! as HTMLDivElement;
const windows = document.querySelectorAll('.window') as NodeListOf<HTMLDivElement>;
const icons = document.querySelectorAll('.icon') as NodeListOf<HTMLDivElement>;
const startMenu = document.getElementById('start-menu')! as HTMLDivElement;
const startButton = document.getElementById('start-button')! as HTMLButtonElement;
const taskbarAppsContainer = document.getElementById('taskbar-apps')! as HTMLDivElement;
const taskbarClock = document.getElementById('taskbar-clock')! as HTMLSpanElement;
const shutdownOverlay = document.getElementById('shutdown-overlay')! as HTMLDivElement;
const shutdownRestartButton = document.getElementById('shutdown-restart-button')! as HTMLButtonElement;

// --- State Variables ---
let activeWindow: HTMLDivElement | null = null;
let highestZIndex: number = 20; // Z-index base Gemini95
const openApps = new Map<string, { windowEl: HTMLDivElement; taskbarButton: HTMLDivElement; initialized: boolean }>();
let dragOffsetX: number = 0;
let dragOffsetY: number = 0;
let isDragging: boolean = false;
let draggedWindow: HTMLDivElement | null = null;
let clockIntervalId: number | null = null;
let splashScreenClosed = false; // Flag per tracciare chiusura splash screen

// --- Icon URLs (Mapped from HTML data-app to real URLs - Using verified Gemini95/Win98Icons) ---
const ICONS_MAP: Record<string, string> = {
    splashScreen: "https://win98icons.alexmeub.com/icons/png/computer_explorer_cool-5.png",
    prdIntro: "https://win98icons.alexmeub.com/icons/png/help_book_computer-1.png",
    vision: "https://storage.googleapis.com/gemini-95-icons/GemNotes.png",
    productVision: "https://win98icons.alexmeub.com/icons/png/world-1.png",
    users: "https://win98icons.alexmeub.com/icons/png/user_world-1.png",
    journeys: "https://win98icons.alexmeub.com/icons/png/windows_explorer_file_list-4.png",
    features: "https://win98icons.alexmeub.com/icons/png/application_hammer-1.png",
    technology: "https://win98icons.alexmeub.com/icons/png/chip_card_reader-1.png",
    design: "https://storage.googleapis.com/gemini-95-icons/gempaint.png",
    content: "https://storage.googleapis.com/gemini-95-icons/GemNotes.png",
    privacy: "https://win98icons.alexmeub.com/icons/png/keys-4.png",
    impact: "https://win98icons.alexmeub.com/icons/png/graph_stock_field_up-0.png",
    roadmap: "https://win98icons.alexmeub.com/icons/png/timetable-1.png",
    risks: "https://win98icons.alexmeub.com/icons/png/warning-0.png",
    future: "https://win98icons.alexmeub.com/icons/png/web_file_set_globe-0.png",
    appendices: "https://win98icons.alexmeub.com/icons/png/template_empty-2.png",
    shutdown: "https://win98icons.alexmeub.com/icons/png/shut_down_cool-5.png",
    // Internal content icons
    info: "https://win98icons.alexmeub.com/icons/png/msg_information-0.png",
    check: "https://win98icons.alexmeub.com/icons/png/check-0.png",
    summary: "https://win98icons.alexmeub.com/icons/png/template_empty-4.png",
    mission: "https://win98icons.alexmeub.com/icons/png/world-1.png",
    problems: "https://win98icons.alexmeub.com/icons/png/search_computer-1.png",
    target: "https://win98icons.alexmeub.com/icons/png/address_book_users-0.png",
    persona: "https://win98icons.alexmeub.com/icons/png/user_card-1.png",
    personaHP: "https://win98icons.alexmeub.com/icons/png/doctor-0.png",
    compass: "https://win98icons.alexmeub.com/icons/png/world_locations-1.png",
    timeline: "https://win98icons.alexmeub.com/icons/png/calendar_clock-0.png",
    network: "https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-4.png",
    knowledge: "https://win98icons.alexmeub.com/icons/png/document-1.png",
    architecture: "https://win98icons.alexmeub.com/icons/png/network_internet_schedule_time-3.png",
    data: "https://win98icons.alexmeub.com/icons/png/storage_drive_floppy_3_half-0.png",
    integration: "https://win98icons.alexmeub.com/icons/png/connection_network_augmented_reality-0.png",
    security: "https://win98icons.alexmeub.com/icons/png/key_security-1.png",
    philosophy: "https://win98icons.alexmeub.com/icons/png/color_profile-1.png",
    components: "https://win98icons.alexmeub.com/icons/png/window_layout_wizards-0.png",
    mobile: "https://win98icons.alexmeub.com/icons/png/cell_phone-0.png",
    accessibility: "https://win98icons.alexmeub.com/icons/png/accessibility-0.png",
    contentTypes: "https://win98icons.alexmeub.com/icons/png/wordpad_document-0.png",
    standards: "https://win98icons.alexmeub.com/icons/png/certificate_checklist-0.png",
    visuals: "https://win98icons.alexmeub.com/icons/png/pictures-1.png",
    localisation: "https://win98icons.alexmeub.com/icons/png/world_phonelink-1.png",
    principles: "https://win98icons.alexmeub.com/icons/png/policy_users_lock_id_card-1.png",
    handling: "https://win98icons.alexmeub.com/icons/png/storage_secure-4.png",
    governance: "https://win98icons.alexmeub.com/icons/png/users_key-4.png",
    metrics: "https://win98icons.alexmeub.com/icons/png/chart_bar-0.png",
    analyticsImpl: "https://win98icons.alexmeub.com/icons/png/processor-1.png",
    improvement: "https://win98icons.alexmeub.com/icons/png/settings_gear-1.png",
    devApproach: "https://win98icons.alexmeub.com/icons/png/channel_protocol_users_network_tools-1.png",
    mvp: "https://win98icons.alexmeub.com/icons/png/layout_section_split_emphasize-1.png",
    rollout: "https://win98icons.alexmeub.com/icons/png/world_network_satellite_update-1.png",
    clinicalRisk: "https://win98icons.alexmeub.com/icons/png/medical_record-1.png",
    culturalRisk: "https://win98icons.alexmeub.com/icons/png/users_relations-1.png",
    techRisk: "https://win98icons.alexmeub.com/icons/png/computer_explorer_executable_gear-0.png",
    businessRisk: "https://win98icons.alexmeub.com/icons/png/briefcase-0.png",
    evolution: "https://win98icons.alexmeub.com/icons/png/graphic_layers-1.png",
    innovation: "https://win98icons.alexmeub.com/icons/png/light_bulb_idea-1.png",
    impactVision: "https://win98icons.alexmeub.com/icons/png/world_network-4.png",
    glossary: "https://win98icons.alexmeub.com/icons/png/dictionary-1.png",
    evidence: "https://win98icons.alexmeub.com/icons/png/certificate_envelope-2.png",
    ethics: "https://win98icons.alexmeub.com/icons/png/user_properties-0.png",
    api: "https://win98icons.alexmeub.com/icons/png/component_plugin-4.png",
    compliance: "https://win98icons.alexmeub.com/icons/png/file_lines-0.png"
};

// --- Helper Functions ---
function iconHTML(key: keyof typeof ICONS_MAP, className: string = 'content-icon'): string {
    const url = ICONS_MAP[key] || ICONS_MAP.info;
    return `<img src="${url}" class="${className}" alt="${key} icon" loading="lazy" decoding="async" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;" />`;
}

function italianExplanation(term: string, explanation: string): string {
    const safeExplanation = explanation.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Converti **bold** -> <strong>, *italic* -> <em>, `code` -> <code>
    const formattedExplanation = safeExplanation
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    return `<div class="explanation italian"><strong>${term}:</strong> ${formattedExplanation}</div>`;
}


// --- Core OS Functions (Window Management - Stile Gemini 95) ---
function bringToFront(windowElement: HTMLDivElement): void { if (activeWindow === windowElement) return; if (activeWindow) { activeWindow.classList.remove('active'); const appName = activeWindow.id; const oldAppData = openApps.get(appName); if (oldAppData?.taskbarButton) oldAppData.taskbarButton.classList.remove('active'); } highestZIndex++; windowElement.style.zIndex = String(highestZIndex); windowElement.classList.add('active'); activeWindow = windowElement; const appNameRef = windowElement.id; const appData = openApps.get(appNameRef); if (appData?.taskbarButton) appData.taskbarButton.classList.add('active'); }

function closeApp(appName: string): void {
    const appData = openApps.get(appName);
    if (!appData) return;
    const { windowEl, taskbarButton } = appData;
    windowEl.style.display = 'none';
    windowEl.classList.remove('active');
    taskbarButton.remove();
    openApps.delete(appName);
    if (activeWindow === windowEl) { activeWindow = null; activateNextHighestWindow(); }
    console.log(`Closed app: ${appName}`);

    // --- Logica Splash Screen ---
    if (appName === 'splashScreen' && !splashScreenClosed) {
        splashScreenClosed = true;
        console.log("Splash screen closed, opening prdIntro...");
        setTimeout(() => { openApp('prdIntro').catch(console.error); }, 100);
    }
}
function minimizeApp(appName: string): void { const appData = openApps.get(appName); if (!appData) return; const { windowEl, taskbarButton } = appData; windowEl.style.display = 'none'; windowEl.classList.remove('active'); taskbarButton.classList.remove('active'); if (activeWindow === windowEl) { activeWindow = null; activateNextHighestWindow(); } console.log(`Minimized app: ${appName}`); }
function activateNextHighestWindow(): void { let nextAppToActivate: HTMLDivElement | null = null; let maxZ = -1; openApps.forEach((data) => { if (data.windowEl.style.display !== 'none') { const z = parseInt(data.windowEl.style.zIndex || '0', 10); if (z > maxZ) { maxZ = z; nextAppToActivate = data.windowEl; } } }); if (nextAppToActivate) { bringToFront(nextAppToActivate); } }

// --- Helper: Trova icona desktop (dall'originale Gemini95) ---
function findIconElement(appName: string): HTMLDivElement | undefined {
    return Array.from(icons).find(icon => icon.dataset.app === appName);
}

/** Apre una finestra dell'applicazione (stile Gemini 95) e inizializza il contenuto */
async function openApp(appName: string): Promise<void> {
    const windowElement = document.getElementById(appName) as HTMLDivElement | null;
    if (!windowElement) { console.error(`Window element not found for app: ${appName}`); return; }

    const appData = openApps.get(appName);

    if (appData) {
        windowElement.style.display = 'flex';
        bringToFront(windowElement);
        if (!appData.initialized) await initializeAppContent(appName, windowElement);
        return;
    }

    windowElement.style.display = 'flex';
    bringToFront(windowElement);

    const taskbarButton = document.createElement('div');
    taskbarButton.classList.add('taskbar-app');
    taskbarButton.dataset.appName = appName;

    let iconSrc = ICONS_MAP[appName as keyof typeof ICONS_MAP] || ICONS_MAP.info;
    let title = appName;
    const desktopIconElement = findIconElement(appName);
    if (desktopIconElement) {
        const span = desktopIconElement.querySelector('span');
        title = span?.textContent || title;
    } else {
        const windowTitleSpan = windowElement.querySelector('.window-title');
        title = windowTitleSpan?.textContent || title;
    }
    const windowTitleSpan = windowElement.querySelector('.window-title');
    if (windowTitleSpan && windowTitleSpan.textContent !== title) { windowTitleSpan.textContent = title; }
    const titleBarIcon = windowElement.querySelector('.window-title-icon');
    if(titleBarIcon) {
         (titleBarIcon as HTMLImageElement).src = iconSrc;
         (titleBarIcon as HTMLImageElement).alt = ""; // Alt vuoto per icona decorativa titlebar
    } else if (windowElement.querySelector('.window-titlebar')) {
         const img = document.createElement('img'); img.src = iconSrc; img.alt = ""; img.classList.add('window-title-icon'); windowElement.querySelector('.window-titlebar')?.prepend(img);
     }

    const taskbarImg = document.createElement('img'); taskbarImg.src = iconSrc; taskbarImg.alt = ""; taskbarButton.appendChild(taskbarImg); // Alt vuoto icona decorativa
    taskbarButton.appendChild(document.createTextNode(title));
    taskbarButton.addEventListener('click', () => { const currentAppData = openApps.get(appName); if (windowElement === activeWindow && windowElement.style.display !== 'none') { minimizeApp(appName); } else { windowElement.style.display = 'flex'; bringToFront(windowElement); if (currentAppData && !currentAppData.initialized) { initializeAppContent(appName, windowElement).catch(console.error); } } });
    taskbarAppsContainer.appendChild(taskbarButton);
    openApps.set(appName, { windowEl: windowElement, taskbarButton: taskbarButton, initialized: false });
    taskbarButton.classList.add('active');

    await initializeAppContent(appName, windowElement);
    console.log(`Opened app: ${appName}`);
}

// --- App Initialization & Content Generation ---
/** Gestore principale per l'inizializzazione del contenuto e il rendering di Mermaid */
async function initializeAppContent(appName: string, windowEl: HTMLDivElement): Promise<void> {
    const appData = openApps.get(appName);
    if (!appData || appData.initialized) return;

    console.log(`Initializing content for: ${appName}`);
    const contentArea = windowEl.querySelector('.window-content');
    if (!contentArea) { console.error(`Content area not found for ${appName}`); appData.initialized = true; return; }

    contentArea.innerHTML = `<div style="text-align:center; padding: 30px 10px; font-family: 'Tahoma', sans-serif; font-size: 11px;">${iconHTML(appName as keyof typeof ICONS_MAP)}<br><br>Loading <strong>${appName}</strong> content... Please wait.</div>`;

    try {
        let contentGenerated = true;
        await new Promise(resolve => setTimeout(resolve, 80)); // Delay leggermente aumentato

        // --- CHIAMATE ALLE FUNZIONI INIT SPECIFICHE ---
        switch (appName) {
            case 'splashScreen':  initSplashScreen(contentArea, windowEl); break;
            case 'prdIntro':      initPrdIntro(contentArea); break;
            case 'vision':        initVision(contentArea); break;
            case 'productVision': initProductVision(contentArea); break;
            case 'users':         initUsers(contentArea); break;
            case 'journeys':      initJourneys(contentArea); break;
            case 'features':      initFeatures(contentArea); break;
            case 'technology':    initTechnology(contentArea); break;
            case 'design':        initDesign(contentArea); break;
            case 'content':       initContent(contentArea); break;
            case 'privacy':       initPrivacy(contentArea); break;
            case 'impact':        initImpact(contentArea); break;
            case 'roadmap':       initRoadmap(contentArea); break;
            case 'risks':         initRisks(contentArea); break;
            case 'future':        initFuture(contentArea); break;
            case 'appendices':    initAppendices(contentArea); break;
            default:
                console.warn(`No init function defined for app: ${appName}`);
                contentArea.innerHTML = `<p>Content for <strong>${appName}</strong> not implemented.</p>`;
                contentGenerated = false;
        }
        appData.initialized = true; // Segna come inizializzato

        // Esegui Mermaid se necessario
        if (contentGenerated && contentArea.querySelector('.mermaid')) {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log(`Rendering Mermaid diagrams in ${appName}...`);
             // @ts-ignore - Mermaid è globale
            await mermaid.run({ nodes: contentArea.querySelectorAll('.mermaid') });
            console.log(`Mermaid rendering complete for ${appName}.`);
        }

    } catch (error) {
        console.error(`Error initializing content for ${appName}:`, error);
        contentArea.innerHTML = `<p style="color: red; padding: 10px; font-weight: bold;">Error loading content for <strong>${appName}</strong>. See console.</p>`;
        if (appData) appData.initialized = true; // Evita loop
    }
}

// --- Specific Content Generation Functions (IMPLEMENTAZIONI COMPLETE) ---

// -- SPLASH SCREEN --
function initSplashScreen(contentArea: Element, windowEl?: HTMLDivElement): void {
     contentArea.innerHTML = `
        <div style="text-align: center; padding: 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #008080; color: white; font-family: 'Tahoma', sans-serif; font-size: 11px;">
             <img src="${ICONS_MAP.splashScreen}" alt="FelloWS OS Start" width="48" height="48" style="image-rendering: pixelated; margin-bottom: 15px;" />
             <h1 style="font-size: 16px; margin-bottom: 8px; font-weight: bold; color: white; text-shadow: 1px 1px 1px black;">FelloWS OS</h1>
             <h2 style="font-size: 12px; margin-bottom: 15px; color: #C0C0C0; font-weight: normal;">PRD Explorer - 95 Edition</h2>
             <p style="margin-bottom: 20px; max-width: 350px; line-height: 1.4;">Welcome! This simulation uses a retro OS interface to explore the FelloWS Product Requirements Document.</p>
             <p style="font-size: 10px; margin-bottom: 25px;">Click 'Continue' or close this window [X] to begin exploring the PRD details.</p>
             <button id="splash-continue-button" class="splash-button">Continue</button>
         </div>
     `;
     const continueButton = contentArea.querySelector('#splash-continue-button');
     if(continueButton) {
         // Applica stili retro al bottone
         Object.assign((continueButton as HTMLElement).style, {
             backgroundColor: '#C0C0C0', borderTop: '2px solid #FFFFFF', borderLeft: '2px solid #FFFFFF', borderRight: '2px solid #000000', borderBottom: '2px solid #000000',
             padding: '5px 15px', fontSize: '11px', fontWeight: 'normal', cursor: 'pointer', color: 'black', fontFamily: 'inherit'
         });
         continueButton.addEventListener('click', () => closeApp('splashScreen'));
         // Effetto premuto
         continueButton.addEventListener('mousedown', () => { Object.assign((continueButton as HTMLElement).style, { borderTop: '2px solid #000000', borderLeft: '2px solid #000000', borderRight: '2px solid #FFFFFF', borderBottom: '2px solid #FFFFFF', padding: '6px 14px 4px 16px' }); });
         continueButton.addEventListener('mouseup', () => { Object.assign((continueButton as HTMLElement).style, { borderTop: '2px solid #FFFFFF', borderLeft: '2px solid #FFFFFF', borderRight: '2px solid #000000', borderBottom: '2px solid #000000', padding: '5px 15px' }); });
         continueButton.addEventListener('mouseout', () => { Object.assign((continueButton as HTMLElement).style, { borderTop: '2px solid #FFFFFF', borderLeft: '2px solid #FFFFFF', borderRight: '2px solid #000000', borderBottom: '2px solid #000000', padding: '5px 15px' }); });
     }
     if(windowEl){ // Modifiche alla finestra splash
         const titleBar = windowEl.querySelector('.window-titlebar');
         if (titleBar) (titleBar as HTMLElement).style.display = 'none';
         windowEl.classList.remove('resizable'); windowEl.style.resize = 'none';
         windowEl.style.width = '450px'; windowEl.style.height = '300px';
         const taskbarHeight = document.getElementById('taskbar')?.offsetHeight ?? 36;
         windowEl.style.left = `calc(50vw - 225px)`; windowEl.style.top = `calc(50vh - 150px - ${taskbarHeight / 2}px)`;
         (contentArea as HTMLElement).style.padding = '0'; (contentArea as HTMLElement).style.border = 'none'; (contentArea as HTMLElement).style.backgroundColor = '#008080';
     }
}

// --- initPrdIntro (Section 0) ---
function initPrdIntro(contentArea: Element): void {
    (contentArea as HTMLElement).style.padding = '10px'; (contentArea as HTMLElement).style.backgroundColor = 'white'; // Ripristina stile
    contentArea.innerHTML = `
        <h2>${iconHTML('info')} Understanding FelloWS Through Its PRD</h2>
        <p>This interactive desktop simulates exploring the <strong>Product Requirements Document (PRD)</strong> for <strong>FelloWS</strong>, an <strong>innovative</strong> maternal support application.</p>
        ${italianExplanation('PRD (Product Requirements Document)', `Un documento cruciale nello sviluppo di prodotti (specialmente software). Definisce <strong>cosa</strong> il prodotto dovrebbe fare, per <strong>chi</strong> (il pubblico target), <strong>perché</strong> (problemi risolti, obiettivi), e quali sono le sue <strong>capacità</strong> e le <strong>caratteristiche</strong> richieste (requisiti). Serve come guida condivisa per tutti i team coinvolti (prodotto, design, ingegneria, marketing, ecc.).`)}
        ${italianExplanation('FelloWS', `Nome del prodotto applicazione. Il nome suggerisce compagnia, supporto tra pari ("fellows" = compagni, pari).`)}
        ${italianExplanation('Innovative', `Innovativo/a. Che introduce metodi, idee o prodotti nuovi e originali, spesso migliorando o cambiando radicalmente lo stato dell'arte esistente.`)}
        ${italianExplanation('Maternal support application', `Applicazione di supporto materno. Un'applicazione software (tipicamente mobile) progettata per fornire informazioni, supporto, strumenti o connessioni sociali a donne durante la gravidanza, il parto e/o il periodo postpartum.`)}

        <p><strong>FelloWS' Core Idea:</strong> To support <strong>expectant mothers</strong> by blending reliable, <strong>evidence-based medical information</strong> with deep <strong>cultural sensitivity</strong> and understanding, acknowledging that pregnancy and childbirth are <strong>profoundly shaped</strong> by <strong>cultural contexts</strong>.</p>
        ${italianExplanation('Expectant mothers', `Madri in attesa / Donne incinte.`)}
        ${italianExplanation('Evidence-based medicine', `Medicina basata sull'evidenza (EBM). Approccio clinico che integra la migliore ricerca disponibile con l'esperienza clinica e i valori del paziente.`)}
        ${italianExplanation('Cultural sensitivity', `Sensibilità culturale. Consapevolezza e rispetto delle differenze culturali.`)}
        ${italianExplanation('Profoundly shaped', `Profondamente plasmato/influenzato. Indica che un fattore (la cultura) ha un impatto molto forte e significativo.`)}
        ${italianExplanation('Cultural contexts', `Contesti culturali. L'insieme di credenze, valori, norme che influenzano percezioni e comportamenti.`)}

        <h4>How to Use This Simulation:</h4>
        <p>This simulation aims to make the FelloWS PRD more <strong>digestible</strong> and <strong>engaging</strong>:</p>
        ${italianExplanation('Digestible', `Digeribile. Facile da capire, assimilare.`)}
        ${italianExplanation('Engaging', `Coinvolgente. Che cattura l'interesse.`)}
        <ul>
            <li>Each ${iconHTML('prdIntro', 'content-icon inline')} icon represents a PRD section.</li>
            <li>Double-click an icon to open its window.</li>
            <li>Inside, find PRD text (English) enhanced with:
                <ul>
                    <li>Visual structure (headings, lists, sections).</li>
                    <li>${iconHTML('info', 'content-icon inline')} Contextual retro icons.</li>
                    <li><span class="explanation italian" style="display: inline-block; padding: 1px 3px; margin:0; font-size: 10px;">🇮🇹</span> Exhaustive Italian explanations for <strong>ALL</strong> technical/business/cultural <strong>jargon</strong>, and terms requiring clarification.</li>
                     ${italianExplanation('Jargon', `Gergo. Linguaggio specializzato di un gruppo.`)}
                    <li>${iconHTML('analyticsImpl', 'content-icon inline')} Mermaid JS diagrams for visualization.</li>
                </ul>
            </li>
            <li>Interact with windows (drag, resize, minimize, close).</li>
        </ul>
        <p>This FelloWS OS simulation was conceived as a way to present complex product documentation using a familiar OS interface. This approach aids <strong>onboarding</strong> for new team members and helps explain the product vision to <strong>stakeholders</strong> by leveraging the <strong>OS metaphor</strong> for <strong>progressive disclosure</strong> of information.</p>
         ${italianExplanation('Onboarding', `Processo di integrazione.`)}
         ${italianExplanation('Stakeholders', `Parti interessate.`)}
         ${italianExplanation('OS metaphor', `Metafora del sistema operativo.`)}
         ${italianExplanation('Progressive disclosure', `Rivelazione progressiva.`)}
        <hr>
        <p><strong>FelloWs - Women Who care</strong> (Slogan del progetto)</p>
        `;
}

// --- initVision (Section 1) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initVision(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('summary')} 1. Executive Summary</h2>
         ${italianExplanation('Executive Summary', `Sommario Esecutivo / Sintesi Dirigenziale. Breve riassunto iniziale dei punti chiave del documento, destinato a fornire una panoramica rapida.`)}
        <p>FELLOWS represents a <strong>paradigmatic shift</strong> in <strong>maternal support applications</strong> by <strong>seamlessly integrating</strong> <strong>evidence-based medicine</strong> with <strong>cultural sensitivity</strong>.
         ${italianExplanation('Paradigmatic shift', `Cambiamento di paradigma. Trasformazione fondamentale nel modo di pensare o nelle pratiche comuni.`)}
         ${italianExplanation('Maternal support applications', `Applicazioni di supporto materno.`)}
         ${italianExplanation('Seamlessly integrating', `Integrare fluidamente.`)}
         ${italianExplanation('Evidence-based medicine (EBM)', `Medicina basata sull'evidenza.`)}
         ${italianExplanation('Cultural sensitivity', `Sensibilità culturale.`)}
        The application addresses the critical <strong>lacuna</strong> in <strong>cross-cultural</strong> maternal care through a <strong>personalised</strong> <strong>digital companion</strong> that provides <strong>contextually relevant guidance</strong> to <strong>expectant mothers</strong> whilst respecting their cultural backgrounds. This document <strong>delineates</strong> the <strong>comprehensive</strong> requirements for developing FELLOWS, ensuring <strong>alignment</strong> between <strong>business objectives</strong> and <strong>technical implementation</strong>.</p>
         ${italianExplanation('Lacuna', `Mancanza, vuoto.`)}
         ${italianExplanation('Cross-cultural', `Transculturale.`)}
         ${italianExplanation('Personalised', `Personalizzato.`)}
         ${italianExplanation('Digital companion', `Compagno digitale.`)}
         ${italianExplanation('Contextually relevant guidance', `Guida contestualmente rilevante.`)}
         ${italianExplanation('Expectant mothers', `Donne incinte.`)}
         ${italianExplanation('Whilst', `Mentre (forma più formale di while).`)}
         ${italianExplanation('Delineates', `Delinea, descrive.`)}
         ${italianExplanation('Comprehensive', `Completo.`)}
         ${italianExplanation('Requirements', `Requisiti. Condizioni o capacità necessarie.`)}
         ${italianExplanation('Alignment', `Allineamento.`)}
         ${italianExplanation('Business objectives', `Obiettivi di business.`)}
         ${italianExplanation('Technical implementation', `Implementazione tecnica.`)}
        <p>The <strong>unique value proposition (UVP)</strong> of FELLOWS lies in its <strong>capacity</strong> to navigate the complex <strong>interplay</strong> between modern medical practices and diverse cultural approaches to pregnancy and childbirth. By acknowledging this <strong>intersection</strong>, FELLOWS aims to reduce <strong>maternal anxiety</strong>, improve <strong>healthcare engagement</strong>, and <strong>foster</strong> a more <strong>inclusive</strong> approach to <strong>maternal wellbeing</strong>.</p>
         ${italianExplanation('Unique Value Proposition (UVP)', `Proposta di Valore Unica.`)}
         ${italianExplanation('Capacity', `Capacità, abilità.`)}
         ${italianExplanation('Interplay', `Interazione complessa.`)}
         ${italianExplanation('Intersection', `Intersezione.`)}
         ${italianExplanation('Maternal anxiety', `Ansia materna.`)}
         ${italianExplanation('Healthcare engagement', `Coinvolgimento nell'assistenza sanitaria.`)}
         ${italianExplanation('Foster', `Promuovere, incoraggiare, coltivare.`)}
         ${italianExplanation('Inclusive', `Inclusivo.`)}
         ${italianExplanation('Maternal wellbeing', `Benessere materno.`)}
         `;
}

// --- initProductVision (Section 2) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initProductVision(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('mission')} 2. Product Vision</h2>
        <section>
            <h3>2.1 Mission Statement</h3>
             ${italianExplanation('Mission Statement', `Dichiarazione di Missione. Definisce lo scopo fondamentale.`)}
            <p>FELLOWS exists to <strong>empower</strong> expectant mothers <strong>across cultural boundaries</strong> by providing <strong>personalised</strong>, <strong>medically accurate</strong>, and <strong>culturally respectful</strong> guidance throughout their pregnancy journey. The application serves as a trusted <strong>digital companion</strong> that transforms maternal care into an experience that <strong>honours</strong> both medical science and <strong>cultural heritage</strong>.</p>
             ${italianExplanation('Empower', `Dare potere, rendere capace.`)}
             ${italianExplanation('Across cultural boundaries', `Attraverso i confini culturali.`)}
             ${italianExplanation('Personalised', `Personalizzato.`)}
             ${italianExplanation('Medically accurate', `Medicalmente accurato.`)}
             ${italianExplanation('Culturally respectful', `Culturalmente rispettoso.`)}
             ${italianExplanation('Digital companion', `Compagno digitale.`)}
             ${italianExplanation('Honours', `Onora, rispetta.`)}
             ${italianExplanation('Cultural heritage', `Patrimonio culturale.`)}
        </section>
        <section>
            <h3>2.2 Core Problems Addressed ${iconHTML('problems')}</h3>
             ${italianExplanation('Core Problems Addressed', `Problemi Principali Affrontati.`)}
            <p>The application addresses several <strong>critical</strong> challenges:</p>
             ${italianExplanation('Critical', `Critico, cruciale.`)}
            <ol>
                <li>The <strong>cultural dissonance</strong> experienced by expectant mothers navigating healthcare systems that may not <strong>accommodate</strong> their traditional practices or beliefs.</li>
                 ${italianExplanation('Cultural dissonance', `Dissonanza culturale.`)}
                 ${italianExplanation('Accommodate', `Accogliere, adattarsi a.`)}
                <li>The <strong>information asymmetry</strong> between healthcare providers and patients from diverse cultural backgrounds, particularly when language barriers or <strong>cultural taboos</strong> <strong>impede</strong> communication.</li>
                 ${italianExplanation('Information asymmetry', `Asimmetria informativa.`)}
                 ${italianExplanation('Cultural taboos', `Tabù culturali.`)}
                 ${italianExplanation('Impede', `Impedire.`)}
                <li>The <strong>isolation</strong> commonly experienced by expectant mothers living away from traditional support networks, especially in <strong>migrant</strong> or <strong>refugee</strong> contexts.</li>
                 ${italianExplanation('Isolation', `Isolamento.`)}
                 ${italianExplanation('Migrant', `Migrante.`)}
                 ${italianExplanation('Refugee', `Rifugiato/a.`)}
                <li>The <strong>standardisation bias</strong> in existing maternal health resources that often <strong>presume</strong> Western medical perspectives as <strong>universal</strong>.</li>
                 ${italianExplanation('Standardisation bias', `Pregiudizio di standardizzazione.`)}
                 ${italianExplanation('Presume', `Presumere.`)}
                 ${italianExplanation('Universal', `Universale.`)}
            </ol>
        </section>
         <section>
           <h3>2.3 Target Market ${iconHTML('target')}</h3>
            ${italianExplanation('Target Market', `Mercato Target / Obiettivo.`)}
           <p>FELLOWS <strong>primarily targets</strong>:</p>
            ${italianExplanation('Primarily targets', `Si rivolge principalmente a.`)}
           <ul>
              <li><strong>First-generation migrants</strong></li>
               ${italianExplanation('First-generation migrants', `Migranti di prima generazione.`)}
              <li><strong>Multicultural families</strong></li>
               ${italianExplanation('Multicultural families', `Famiglie multiculturali (con membri provenienti da diverse culture).`)}
              <li><strong>Healthcare professionals</strong> seeking <strong>culturally competent care</strong></li>
               ${italianExplanation('Healthcare professionals (HCP)', `Professionisti sanitari.`)}
               ${italianExplanation('Culturally competent care', `Assistenza culturalmente competente.`)}
              <li><strong>Support networks</strong></li>
               ${italianExplanation('Support networks', `Reti di supporto.`)}
           </ul>
           <p>Initial market focus will <strong>prioritise</strong> regions with high <strong>cultural diversity indices</strong>, particularly <strong>urban centres</strong> with <strong>significant</strong> migrant populations.</p>
           ${italianExplanation('Prioritise', `Dare priorità a.`)}
           ${italianExplanation('Cultural diversity indices', `Indici di diversità culturale.`)}
           ${italianExplanation('Urban centres', `Centri urbani.`)}
           ${italianExplanation('Significant', `Significativo.`)}
       </section>
    `;
}

// --- initUsers (Section 3) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initUsers(contentArea: Element): void {
    contentArea.innerHTML = `
    <h2>${iconHTML('users')} 3. User Research and Personas</h2>
     ${italianExplanation('User Research', `Ricerca sull'utente. Processo per capire bisogni, comportamenti e motivazioni degli utenti.`)}
     ${italianExplanation('Personas', `Personaggi fittizi rappresentativi degli utenti tipo.`)}

    <section>
        <h3>3.1 Research Methodology</h3>
         ${italianExplanation('Research Methodology', `Metodologia di ricerca. Approccio usato per raccogliere e analizzare dati.`)}
        <p>User research employed a <strong>mixed-methods approach</strong> comprising:</p>
        ${italianExplanation('Mixed-methods approach', `Approccio a metodi misti (qualitativi + quantitativi).`)}
        <ul>
            <li><strong>Semi-structured interviews</strong> (37 mothers, 18 cultures)</li>
             ${italianExplanation('Semi-structured interviews', `Interviste semi-strutturate.`)}
            <li><strong>Ethnographic shadowing</strong> (8 pregnant women)</li>
             ${italianExplanation('Ethnographic shadowing', `Ombreggiamento etnografico (osservazione nel contesto).`)}
            <li><strong>Collaborative workshops</strong> (12 <strong>midwives</strong>/<strong>obstetricians</strong> - <strong>cross-cultural care</strong>)</li>
             ${italianExplanation('Collaborative workshops', `Laboratori collaborativi.`)}
             ${italianExplanation('Midwives', `Ostetriche.`)}
             ${italianExplanation('Obstetricians', `Ostetrici/Ginecologi.`)}
             ${italianExplanation('Cross-cultural care', `Assistenza transculturale.`)}
             ${italianExplanation('Specialising', `Specializzato/a in.`)}
            <li>Analysis of 420 forum posts</li>
            <li><strong>Contextual inquiry</strong> sessions (15 family members)</li>
             ${italianExplanation('Contextual inquiry', `Indagine contestuale (osservazione + intervista).`)}
        </ul>
    </section>

    <section>
        <h3>3.2 Primary Persona: Amina ${iconHTML('persona')}</h3>
        <div class="persona-card">
            <p><strong>Demographic Profile:</strong> 28, 1st-time mother, Morocco -> Italy (3 yrs), teacher.</p>
             ${italianExplanation('Demographic Profile', `Profilo demografico.`)}
            <p><strong>Technological Profile:</strong> Smartphone-dependent, moderate <strong>digital literacy</strong>, <strong>cautious</strong> with health apps.</p>
             ${italianExplanation('Technological Profile', `Profilo tecnologico.`)}
             ${italianExplanation('Smartphone-dependent', `Dipendente dallo smartphone.`)}
             ${italianExplanation('Digital literacy', `Alfabetizzazione digitale.`)}
             ${italianExplanation('Cautious', `Cauto/a.`)}
            <p><strong>Pregnancy Context:</strong> 2nd trimester, tension: traditions vs Italian healthcare.</p>
             ${italianExplanation('Pregnancy Context', `Contesto della gravidanza.`)}
             ${italianExplanation('Trimester', `Trimestre.`)}
             ${italianExplanation('Tension', `Tensione, conflitto.`)}
             ${italianExplanation('Expectations', `Aspettative.`)}
            <p><strong>Core Needs:</strong></p>
             ${italianExplanation('Core Needs', `Bisogni fondamentali.`)}
            <ul class="compact-list">
                <li><strong>Reconciliation</strong> of conflicting advice.</li>
                 ${italianExplanation('Reconciliation', `Riconciliazione.`)}
                <li>Contextual understanding of Italian healthcare.</li>
                <li>Preservation of traditions safely.</li>
                <li>Connection with peers.</li>
            </ul>
            <p><strong>Pain Points:</strong></p>
             ${italianExplanation('Pain Points', `Punti dolenti.`)}
            <ul class="compact-list">
                <li>Difficulty explaining preferences.</li>
                <li>Anxiety over choices (culture vs medical).</li>
                <li>Limited traditional support.</li>
                <li>Concern about <strong>dual cultural identity</strong>.</li>
                 ${italianExplanation('Dual cultural identity', `Doppia identità culturale.`)}
            </ul>
        </div>
    </section>

    <section>
         <h3>3.3 Secondary Persona: Elena ${iconHTML('personaHP')}</h3>
         <div class="persona-card secondary">
            <p><strong>Demographic Profile:</strong> 34, Italian HCP (maternal care), diverse urban community.</p>
             ${italianExplanation('HCP (Healthcare Provider)', `Operatore sanitario.`)}
             ${italianExplanation('Diverse', `Diverso.`)}
            <p><strong>Technological Profile:</strong> <strong>Tech-savvy</strong>, recommends digital resources.</p>
             ${italianExplanation('Tech-savvy', `Esperto/a di tecnologia.`)}
            <p><strong>Professional Context:</strong> <strong>Encounters</strong> diverse patients, <strong>struggles</strong> with culturally appropriate care <strong>despite best intentions</strong>.</p>
             ${italianExplanation('Encounters', `Incontra.`)}
             ${italianExplanation('Struggles', `Lotta, ha difficoltà.`)}
             ${italianExplanation('Appropriate', `Appropriato.`)}
             ${italianExplanation('Despite best intentions', `Nonostante le migliori intenzioni.`)}
             <p><strong>Core Needs:</strong></p>
             <ul class="compact-list">
                <li>Understand diverse perspectives.</li>
                <li>Tools to bridge communication gaps.</li>
                <li>Safe resources to recommend.</li>
                <li>Support for inclusive care plans.</li>
            </ul>
            <p><strong>Pain Points:</strong></p>
             <ul class="compact-list">
                <li>Frustration with <strong>non-adherence</strong> due to culture.</li>
                 ${italianExplanation('Non-adherence', `Non aderenza (terapeutica).`)}
                <li>Limited time for cultural discussion.</li>
                <li>Lack of accessible resources.</li>
                <li>Concern about negative outcomes.</li>
            </ul>
         </div>
    </section>
    `;
}

// --- initJourneys (Section 4) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initJourneys(contentArea: Element): void {
     contentArea.innerHTML = `
        <h2>${iconHTML('journeys')} 4. User Journeys</h2>
        <p>These <strong>narratives</strong> illustrate how users might interact with FelloWS in key <strong>scenarios</strong>.</p>
        ${italianExplanation('User Journey', `Percorso dell'utente.`)}
        ${italianExplanation('Narratives', `Narrazioni.`)}
        ${italianExplanation('Scenarios', `Scenari.`)}

        <section>
            <h3>4.1 First Engagement Journey</h3>
             ${italianExplanation('First Engagement', `Primo ingaggio / utilizzo.`)}
            <p>How Amina might start using FelloWS:</p>
            <ol>
                <li><strong>Awareness Phase:</strong> Discovers via recommendation (<strong>cultural integration programme</strong>). Emphasis on cultural respect <strong>resonates</strong>.</li>
                 ${italianExplanation('Awareness Phase', `Fase di consapevolezza.`)}
                 ${italianExplanation('Cultural integration programme', `Programma di integrazione culturale.`)}
                 ${italianExplanation('Resonates', `Risuona.`)}
                <li><strong>Onboarding Experience:</strong> Downloads, completes <strong>comprehensive</strong> profile (medical + cultural). App shows relevant examples, fostering recognition.</li>
                 ${italianExplanation('Onboarding', `Processo di accoglienza iniziale.`)}
                 ${italianExplanation('Comprehensive', `Completo.`)}
                 ${italianExplanation('Fostering recognition', `Promuovendo riconoscimento.`)}
                <li><strong>Cultural Framework Establishment:</strong> FELLOWS identifies potential <strong>cultural-medical intersection</strong> points, <strong>proactively</strong> addressing tensions.</li>
                 ${italianExplanation('Cultural Framework Establishment', `Stabilimento del quadro culturale.`)}
                 ${italianExplanation('Cultural-medical intersection', `Intersezione culturale-medica.`)}
                 ${italianExplanation('Proactively', `Proattivamente.`)}
                 ${italianExplanation('Addressing common tensions', `Affrontare tensioni comuni.`)}
                <li><strong>Personalised Dashboard Creation:</strong> System generates <strong>tailored</strong> interface with dual perspectives.</li>
                 ${italianExplanation('Tailored', `Su misura.`)}
                 ${italianExplanation('Dashboard', `Cruscotto.`)}
                 ${italianExplanation('Dual perspectives', `Doppie prospettive.`)}
                 ${italianExplanation('Demonstrating value', `Dimostrando valore.`)}
                <li><strong>Connection Facilitation:</strong> Receives <strong>vetted</strong> suggestions to connect with peers.</li>
                 ${italianExplanation('Connection Facilitation', `Facilitazione della connessione.`)}
                 ${italianExplanation('Vetted', `Verificato.`)}
            </ol>
             <div class="mermaid">
             graph TD; A[Awareness] --> B(Onboarding); B --> C{Analysis}; C --> D[Dashboard]; C --> E[Connections]; classDef default fill:#C0C0C0,stroke:#000,stroke-width:1px;
             </div>
             ${italianExplanation('Diagramma di Flusso (Primo Ingaggio)', `Scoperta -> Onboarding -> Analisi -> Dashboard & Connessioni.`)}
        </section>

         <section>
            <h3>4.2 Healthcare Integration Journey</h3>
             ${italianExplanation('Healthcare Integration', `Integrazione con l'assistenza sanitaria.`)}
            <p>How FelloWS supports Amina with the healthcare system:</p>
            <ol>
                <li><strong>Appointment Preparation:</strong> <strong>Prior to</strong> visit, FelloWS provides <strong>contextualised</strong> explanations.</li>
                 ${italianExplanation('Prior to', `Prima di.`)}
                 ${italianExplanation('Contextualised', `Contestualizzato.`)}
                 ${italianExplanation('Prenatal appointment', `Appuntamento prenatale.`)}
                <li><strong>Cultural-Medical Translation:</strong> App suggests <strong>phrasings</strong> using <strong>medically relevant terminology</strong>.</li>
                 ${italianExplanation('Phrasings', `Formulazioni.`)}
                 ${italianExplanation('Medically relevant terminology', `Terminologia medicalmente rilevante.`)}
                <li><strong>Information Reconciliation:</strong> Inputs recommendations; FELLOWS helps contextualise (harmony/tension).</li>
                 ${italianExplanation('Information Reconciliation', `Riconciliazione delle informazioni.`)}
                 ${italianExplanation('Harmony', `Armonia.`)} ${italianExplanation('Tension', `Tensione.`)}
                <li><strong>Decision Support:</strong> Presents balanced perspectives (evidence & culture).</li>
                 ${italianExplanation('Decision Support', `Supporto decisionale.`)}
                 ${italianExplanation('Prenatal testing', `Test prenatale.`)}
                 ${italianExplanation('Balanced perspectives', `Prospettive bilanciate.`)}
                <li><strong>Healthcare System Navigation:</strong> Guidance on <strong>healthcare bureaucracy</strong>, reducing <strong>procedural anxiety</strong>.</li>
                 ${italianExplanation('Healthcare bureaucracy', `Burocrazia sanitaria.`)}
                 ${italianExplanation('Procedural anxiety', `Ansia procedurale.`)}
            </ol>
             <div class="mermaid">
                sequenceDiagram; participant User; participant App; participant HCP; User->>App: Prep Appointment; App-->>User: Info & Phrasing; User->>HCP: Appointment; HCP-->>User: Recs; User->>App: Input Recs; App->>App: Reconcile; App-->>User: Summary;
             </div>
              ${italianExplanation('Diagramma di Sequenza (Integrazione Sanitaria)', `Utente prepara con App -> Visita HCP -> Utente inserisce info in App -> App aiuta.`)}
        </section>
     `;
}

// --- initFeatures (Section 5) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initFeatures(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('features')} 5. Functional Requirements</h2>
        <p>What the system <strong>must do</strong>. Defines the core capabilities.</p>
        ${italianExplanation('Functional Requirements', `Requisiti Funzionali.`)}

        <section>
            <h3>5.1 Cultural Compass Module ${iconHTML('compass')}</h3>
            <p>The <strong>core differentiating feature</strong>, providing <strong>personalised navigation</strong>.</p>
            ${italianExplanation('Core differentiating feature', `Caratteristica differenziante principale.`)}
            ${italianExplanation('Personalised navigation', `Navigazione personalizzata.`)}
            <h4>Technical Requirements:</h4>
             ${italianExplanation('Technical Requirements', `Requisiti Tecnici.`)}
            <ul>
                <li><strong>Cultural Knowledge Base:</strong> <strong>Comprehensive</strong> database (min. 25 cultures), <strong>quarterly</strong> expansion.</li>
                 ${italianExplanation('Comprehensive', `Completo.`)} ${italianExplanation('Knowledge Base', `Base di conoscenza.`)} ${italianExplanation('Minimally', `Minimo.`)} ${italianExplanation('Quarterly', `Trimestrale.`)}
                <li><strong>Belief-Practice Mapping:</strong> <strong>Sophisticated</strong> system distinguishing <strong>beliefs</strong> vs <strong>practices</strong> with <strong>medical relevance scoring</strong>.</li>
                 ${italianExplanation('Sophisticated', `Sofisticato.`)} ${italianExplanation('Beliefs', `Credenze.`)} ${italianExplanation('Practices', `Pratiche.`)} ${italianExplanation('Worldviews', `Visioni del mondo.`)} ${italianExplanation('Values', `Valori.`)} ${italianExplanation('Behaviours', `Comportamenti.`)} ${italianExplanation('Rituals', `Rituali.`)} ${italianExplanation('Belief-Practice Mapping', `Mappatura Credenze-Pratiche.`)} ${italianExplanation('Medical relevance scoring', `Punteggio di rilevanza medica.`)}
                <li><strong>Medical Compatibility Assessment:</strong> <strong>Algorithm</strong> evaluating practices vs <strong>guidelines</strong> (Beneficial, Neutral, Cautionary, Contraindicated).</li>
                 ${italianExplanation('Algorithm', `Algoritmo.`)} ${italianExplanation('Evidence-based guidelines', `Linee guida basate sull'evidenza.`)} ${italianExplanation('Beneficial', `Benefico.`)} ${italianExplanation('Neutral', `Neutro.`)} ${italianExplanation('Cautionary', `Che richiede cautela.`)} ${italianExplanation('Contraindicated', `Controindicato.`)} ${italianExplanation('Modifications', `Modifiche.`)} ${italianExplanation('Significant', `Significativo.`)}
                <li><strong>Personalised Recommendation Engine:</strong> <strong>Contextual</strong> system generating alternatives.</li>
                 ${italianExplanation('Contextual', `Contestuale.`)} ${italianExplanation('Recommendation Engine', `Motore di raccomandazione.`)} ${italianExplanation('Alternatives', `Alternative.`)}
                <li><strong>Cultural Conflict Resolution Framework:</strong> <strong>Decision-support system</strong> for tensions.</li>
                 ${italianExplanation('Decision-support system', `Sistema di supporto decisionale.`)} ${italianExplanation('Framework', `Struttura.`)} ${italianExplanation('Navigating tensions', `Gestire tensioni.`)}
            </ul>
        </section>

        <section>
            <h3>5.2 Health Timeline Tracker ${iconHTML('timeline')}</h3>
            <p><strong>Chronological</strong> view integrating cultural/medical <strong>landmarks</strong>.</p>
             ${italianExplanation('Chronological', `Cronologico.`)} ${italianExplanation('Landmarks', `Punti di riferimento.`)}
             <h4>Technical Requirements:</h4>
             <ul>
                <li><strong>Dual-Perspective Calendar:</strong> Medical milestones & culturally specific events.</li>
                 ${italianExplanation('Dual-Perspective', `Doppia prospettiva.`)} ${italianExplanation('Visualisation', `Visualizzazione.`)} ${italianExplanation('Milestones', `Tappe.`)}
                <li><strong>Appointment Management System:</strong> Scheduling (<strong>iCalendar</strong>), contextual guidance.</li>
                 ${italianExplanation('iCalendar (.ics)', `Formato standard calendari.`)} ${italianExplanation('Incorporates', `Incorpora.`)}
                <li><strong>Symptom Tracking Module:</strong> Monitoring with cultural interpretations & medical explanations (with safety <strong>caveats</strong>).</li>
                 ${italianExplanation('Caveats', `Avvertenze.`)} ${italianExplanation('Remedies', `Rimedi.`)}
                <li><strong>Cultural Milestone Notifications:</strong> <strong>Configurable</strong> alerts.</li>
                 ${italianExplanation('Configurable', `Configurabile.`)}
                <li><strong>Developmental Visualisation:</strong> <strong>Foetal</strong> imagery respecting sensitivities.</li>
                 ${italianExplanation('Foetal', `Fetale.`)} ${italianExplanation('Imagery', `Immagini.`)}
            </ul>
        </section>

         <section>
            <h3>5.3 Support Network Integration ${iconHTML('network')}</h3>
            <p><strong>Facilitates</strong> connections to support systems.</p>
             ${italianExplanation('Facilitates', `Facilita.`)}
             <h4>Technical Requirements:</h4>
            <ul>
                <li><strong>Cultural Cohort Matching:</strong> Algorithm connecting peers (culture, language, <strong>migration experience</strong>, stage).</li>
                 ${italianExplanation('Cohort', `Coorte.`)} ${italianExplanation('Migration experience', `Esperienza migratoria.`)}
                <li><strong>HCP Directory:</strong> Searchable, <strong>vetted</strong> database (competency, languages, feedback).</li>
                 ${italianExplanation('Healthcare Provider (HCP)', `Operatore sanitario.`)} ${italianExplanation('Directory', `Elenco, rubrica.`)} ${italianExplanation('Vetted', `Verificato.`)} ${italianExplanation('Filterable', `Filtrabile.`)} ${italianExplanation('Indicators', `Indicatori.`)} ${italianExplanation('Patient-sourced feedback', `Feedback dai pazienti.`)}
                <li><strong>Cultural Resource Mapping:</strong> <strong>Geolocation</strong> for resources (shops, practitioners, centers).</li>
                 ${italianExplanation('Geolocation', `Geolocalizzazione.`)} ${italianExplanation('Disclaimers', `Avvertenze.`)}
                <li><strong>Moderated Discussion Forums:</strong> Safe spaces with professional moderation.</li>
                 ${italianExplanation('Moderated', `Moderato/a.`)}
                <li><strong>Family Inclusion Tools:</strong> Shareable resources for family understanding.</li>
            </ul>
        </section>

         <section>
            <h3>5.4 Knowledge Repository ${iconHTML('knowledge')}</h3>
           <p>Provides accurate, sensitive, relevant info.</p>
            ${italianExplanation('Repository', `Deposito.`)}
            <h4>Technical Requirements:</h4>
           <ul>
                <li><strong>Culturally Contextualised Medical Content</strong></li>
                <li><strong>Multilingual Resource Library</strong> (Min. 12 languages)</li>
                 ${italianExplanation('Multilingual', `Multilingue.`)}
                <li><strong>Comparative Practice Explorer</strong></li>
                <li><strong>Terminology Translation System</strong> (Medical to resonant/<strong>vernacular</strong>)</li>
                 ${italianExplanation('Resonant', `Risonante.`)} ${italianExplanation('Vernacular', `Vernacolo.`)}
                <li><strong>Citation Infrastructure</strong> (Distinguishing sources: evidence, culture, <strong>UGC</strong>).</li>
                 ${italianExplanation('Citation', `Citazione.`)} ${italianExplanation('Infrastructure', `Infrastruttura.`)} ${italianExplanation('User-generated content (UGC)', `Contenuto generato dagli utenti.`)}
           </ul>
        </section>
    `;
}


// --- initTechnology (Section 6) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initTechnology(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('technology')} 6. Technical Architecture</h2>
        <p>The underlying technical structure enabling FelloWS, designed for <strong>scalability</strong> and <strong>maintainability</strong>.</p>
         ${italianExplanation('Scalability', `Scalabilità. Capacità di gestire carichi crescenti.`)}
         ${italianExplanation('Maintainability', `Manutenibilità. Facilità di modifica/correzione.`)}

        <section>
            <h3>6.1 System Architecture ${iconHTML('architecture')}</h3>
            <p>Employs a <strong>microservices architecture</strong>.</p>
            ${italianExplanation('Microservices Architecture', `Architettura a microservizi. Scompone app in servizi piccoli e indipendenti.`)}
            <ul>
                <li><strong>Core Services Layer:</strong> Fundamental services (<strong>authentication</strong>, <strong>user management</strong>, communication via <strong>RESTful APIs</strong>).</li>
                 ${italianExplanation('Layer', `Livello architetturale.`)} ${italianExplanation('Fundamental services', `Servizi fondamentali.`)} ${italianExplanation('Authentication', `Autenticazione.`)} ${italianExplanation('User management', `Gestione utenti.`)} ${italianExplanation('Cross-service communication', `Comunicazione tra servizi.`)} ${italianExplanation('RESTful APIs', `API basate su REST.`)}
                <li><strong>Domain Services Layer:</strong> Specialised services (cultural knowledge, medical info, connections).</li>
                 ${italianExplanation('Domain Services', `Servizi di Dominio.`)} ${italianExplanation('Specialised', `Specializzato.`)}
                <li><strong>Integration Services Layer:</strong> <strong>Connectors</strong> to external systems.</li>
                 ${italianExplanation('Connectors', `Connettori software.`)}
                <li><strong>API Gateway:</strong> Unified entry point (<strong>routing</strong>, <strong>composition</strong>, <strong>protocol translation</strong>).</li>
                 ${italianExplanation('API Gateway', `Gateway API.`)} ${italianExplanation('Unified entry point', `Punto ingresso unico.`)} ${italianExplanation('Request routing', `Instradamento richieste.`)} ${italianExplanation('Composition', `Composizione servizi.`)} ${italianExplanation('Protocol translation', `Traduzione protocollo.`)}
                <li><strong>Client Applications:</strong> <strong>PWA</strong>, <strong>native</strong> apps (iOS/Android).</li>
                 ${italianExplanation('PWA (Progressive Web Application)', `Applicazione web progressiva.`)} ${italianExplanation('Native mobile applications', `App native (iOS/Android).`)}
            </ul>
             <div class="mermaid">
             graph TD; Clients --> GW(API Gateway); GW --> Core(Core Svcs); GW --> Domain(Domain Svcs); Domain -- Uses --> Core; Domain -- Uses Int(Integration Svcs); Core -- Uses --> Int; classDef default fill:#C0C0C0,stroke:#000;
             </div>
             ${italianExplanation('Diagramma Architettura Semplificato', `Client -> Gateway -> Servizi Backend (Core, Domain, Integration).`)}
        </section>

        <section>
            <h3>6.2 Data Architecture ${iconHTML('data')}</h3>
            <p>Balancing performance, security, analytics.</p>
            ${italianExplanation('Data Architecture', `Architettura dei dati.`)}
            <ul>
                <li><strong>Operational Data Store:</strong> <strong>PostgreSQL</strong> cluster (<strong>transactional</strong>, <strong>sharding</strong>).</li>
                 ${italianExplanation('Operational Data Store (ODS)', `Archivio dati operativo.`)} ${italianExplanation('PostgreSQL', `Database relazionale.`)} ${italianExplanation('Cluster', `Gruppo di server.`)} ${italianExplanation('Transactional data', `Dati transazionali.`)} ${italianExplanation('Sharding', `Partizionamento DB.`)}
                <li><strong>Cultural Knowledge Graph:</strong> <strong>Neo4j</strong> (mapping relationships).</li>
                 ${italianExplanation('Neo4j', `Database a grafo.`)} ${italianExplanation('Graph database', `Database a grafo.`)}
                <li><strong>Search Infrastructure:</strong> <strong>Elasticsearch</strong> (multilingual search).</li>
                 ${italianExplanation('Elasticsearch', `Motore ricerca distribuito.`)} ${italianExplanation('Retrieval', `Recupero.`)} ${italianExplanation('Multilingual', `Multilingue.`)}
                <li><strong>Analytics Data Warehouse:</strong> <strong>Snowflake</strong> (<strong>anonymised</strong> patterns).</li>
                 ${italianExplanation('Data Warehouse', `Magazzino dati analisi.`)} ${italianExplanation('Snowflake', `Piattaforma dati cloud.`)} ${italianExplanation('Anonymised', `Anonimizzato.`)}
                <li><strong>Content Management System:</strong> <strong>Headless CMS</strong> (content, <strong>workflows</strong>).</li>
                 ${italianExplanation('Headless CMS', `CMS senza testa.`)} ${italianExplanation('Workflows', `Flussi di lavoro.`)}
            </ul>
        </section>

        <section>
             <h3>6.3 Integration Requirements ${iconHTML('integration')}</h3>
             <p>Connections needed:</p>
              ${italianExplanation('Integration', `Integrazione.`)}
             <ul>
                <li><strong>Healthcare Systems:</strong> <strong>FHIR</strong>-compliant APIs (<strong>interoperability</strong>).</li>
                 ${italianExplanation('FHIR', `Standard scambio dati sanitari.`)} ${italianExplanation('Compliant', `Conforme.`)} ${italianExplanation('Interoperability', `Interoperabilità.`)} ${italianExplanation('Electronic Health Records (EHR)', `Cartelle Cliniche Elettroniche.`)}
                <li><strong>Medical Terminology Services:</strong> <strong>SNOMED CT</strong>, other <strong>vocabularies</strong> (<strong>cross-referencing</strong>).</li>
                 ${italianExplanation('SNOMED CT', `Nomenclatura medica standard.`)} ${italianExplanation('Vocabularies', `Vocabolari controllati.`)} ${italianExplanation('Cross-referencing', `Riferimenti incrociati.`)}
                <li><strong>Machine Translation:</strong> <strong>DeepL API</strong> (<strong>supplementary</strong>).</li>
                 ${italianExplanation('DeepL', `Servizio traduzione automatica.`)} ${italianExplanation('Supplementary', `Supplementare.`)}
                <li><strong>Cultural Info Sources:</strong> APIs to anthropological DBs/<strong>repositories</strong> (<strong>authoritative</strong>).</li>
                 ${italianExplanation('Repositories', `Depositi.`)} ${italianExplanation('Authoritative', `Autorevole.`)}
                <li><strong>Community Resource Directories:</strong> Location-based services (user <strong>proximity</strong>).</li>
                 ${italianExplanation('Proximity', `Prossimità.`)}
             </ul>
        </section>

        <section>
            <h3>6.4 Authentication and Authorisation ${iconHTML('security')}</h3>
            <p><strong>Defence-in-depth</strong> strategies:</p>
            ${italianExplanation('Defence-in-depth', `Difesa in profondità.`)}
            ${italianExplanation('Authentication', `Autenticazione.`)} ${italianExplanation('Authorisation', `Autorizzazione.`)}
            <ul>
                <li><strong>AuthN System:</strong> <strong>OAuth 2.0</strong> (multiple <strong>IdP</strong>s, <strong>step-up</strong>).</li>
                 ${italianExplanation('AuthN (Authentication)', `Autenticazione.`)} ${italianExplanation('OAuth 2.0', `Standard autorizzazione delegata.`)} ${italianExplanation('IdP (Identity Provider)', `Fornitore identità.`)} ${italianExplanation('Step-up authentication', `Autenticazione incrementale.`)}
                <li><strong>AuthZ Framework:</strong> <strong>ABAC</strong> (attribute-based).</li>
                 ${italianExplanation('AuthZ (Authorisation)', `Autorizzazione.`)} ${italianExplanation('ABAC', `Controllo accessi basato su attributi.`)}
                <li><strong>Consent Management:</strong> <strong>Granular</strong>, explicit, <strong>immutable audit trails</strong>.</li>
                 ${italianExplanation('Granular', `Granulare.`)} ${italianExplanation('Explicit consent', `Consenso esplicito.`)} ${italianExplanation('Immutable audit trails', `Log immutabili.`)}
                <li><strong>Delegation Mechanism:</strong> Grant limited, <strong>scoped</strong> access.</li>
                 ${italianExplanation('Delegation Mechanism', `Meccanismo delega.`)} ${italianExplanation('Scoped', `Con ambito limitato.`)}
                <li><strong>Session Management:</strong> Secure handling, timeouts.</li>
                 ${italianExplanation('Session Management', `Gestione sessione.`)}
            </ul>
        </section>
    `;
}

// --- initDesign (Section 7) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initDesign(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('design')} 7. User Interface Requirements</h2>
        <p>Principles, components, accessibility for FelloWS <strong>UX</strong> & <strong>UI</strong>.</p>
         ${italianExplanation('UI (User Interface)', `Interfaccia Utente.`)} ${italianExplanation('UX (User Experience)', `Esperienza Utente.`)}

        <section>
            <h3>7.1 Design Philosophy ${iconHTML('philosophy')}</h3>
            <p>Principles: <strong>inclusive accessibility</strong>, cultural diversity.</p>
            ${italianExplanation('Inclusive accessibility', `Accessibilità inclusiva.`)} ${italianExplanation('Whilst', `Mentre.`)}
            <ul>
                <li><strong>Cultural Adaptation:</strong> Visuals (colors, <strong>iconography</strong>, imagery) adapt maintaining <strong>usability</strong>.</li>
                 ${italianExplanation('Iconography', `Iconografia.`)} ${italianExplanation('Usability', `Usabilità.`)}
                <li><strong>Progressive Disclosure:</strong> <strong>IA</strong> presenting concepts in layers (prevent <strong>cognitive overload</strong>).</li>
                 ${italianExplanation('Progressive Disclosure', `Rivelazione progressiva.`)} ${italianExplanation('Information architecture (IA)', `Architettura informazione.`)} ${italianExplanation('Cognitive overload', `Sovraccarico cognitivo.`)}
                <li><strong>Emotional Awareness:</strong> Interface <strong>responsive</strong> to anxiety (tone, density).</li>
                 ${italianExplanation('Responsive', `Reattivo.`)} ${italianExplanation('Information density', `Densità informativa.`)}
                <li><strong>Inclusive Imagery:</strong> Diverse, sensitive <strong>depictions</strong>.</li>
                 ${italianExplanation('Depictions', `Raffigurazioni.`)}
                <li><strong>Accessibility First:</strong> Conforming to <strong>WCAG 2.2 AAA</strong> + <strong>temporary impairments</strong>.</li>
                 ${italianExplanation('WCAG 2.2 AAA', `Standard accessibilità web.`)} ${italianExplanation('Temporary impairments', `Compromissioni temporanee.`)}
            </ul>
        </section>

         <section>
            <h3>7.2 Key Interface Components ${iconHTML('components')}</h3>
             <p>Essential <strong>UI</strong> building blocks:</p>
              ${italianExplanation('Interface Components', `Componenti UI.`)}
             <ul>
                 <li><strong>Cultural Dashboard:</strong> Personalised home view (cultural <strong>lens</strong>).</li>
                  ${italianExplanation('Dashboard', `Cruscotto.`)} ${italianExplanation('Lens', `Lente (prospettiva).`)}
                 <li><strong>Journey Visualisation:</strong> Interactive timeline, dual tracks.</li>
                 <li><strong>Decision Support Interfaces:</strong> Balanced presentation, avoiding <strong>bias</strong>.</li>
                  ${italianExplanation('Bias', `Pregiudizio.`)}
                 <li><strong>Cultural-Medical Translator:</strong> Interactive dialogues for HCP interactions.</li>
                 <li><strong>Community Connection Spaces:</strong> Respectful peer support.</li>
             </ul>
        </section>

         <section>
            <h3>7.3 Mobile-Specific Considerations ${iconHTML('mobile')}</h3>
            <p>Addressing unique contexts:</p>
             <ul>
                 <li>One-Handed Operation</li> <li>Offline Functionality</li> <li>Discreet Mode</li>
                 <li>Low-Bandwidth Optimisation (<strong>adaptive media</strong>).</li>
                  ${italianExplanation('Adaptive media', `Media adattivi.`)}
                 <li>Notification Sensitivity (norms, time zones, quiet periods).</li>
             </ul>
        </section>

         <section>
            <h3>7.4 Accessibility Requirements ${iconHTML('accessibility')}</h3>
             <p>Exceeding standard guidelines:</p>
             <ul>
                 <li>Voice Interaction</li> <li>Adaptive Typography</li> <li>Colour Adaptation</li>
                 <li>Reduced Motion Options (for <strong>vertigo</strong>/nausea).</li>
                   ${italianExplanation('Vertigo', `Vertigine.`)}
                 <li>Cognitive Accessibility ("<strong>baby brain</strong>").</li>
                  ${italianExplanation('"Baby brain"', `Difficoltà cognitive in gravidanza/postpartum.`)}
             </ul>
        </section>
    `;
}

// --- initContent (Section 8) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initContent(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('content')} 8. Content Requirements</h2>
        <p>Defining information, quality standards, management.</p>
         ${italianExplanation('Content Requirements', `Requisiti di contenuto. Specifiche riguardanti le informazioni (testo, immagini, video) che devono essere presenti nel prodotto.`)}

         <section>
            <h3>8.1 Core Content Types ${iconHTML('contentTypes')}</h3>
            <p>Distinct <strong>content categories</strong>:</p>
             ${italianExplanation('Content categories', `Categorie di contenuto.`)}
            <ul>
                <li>Medical Information (Evidence-based, sourced, updated - <strong>evolving guidelines</strong>).</li>
                 ${italianExplanation('Evolving guidelines', `Linee guida in evoluzione.`)}
                <li>Cultural Context Articles (<strong>Anthropologically accurate</strong>, respectful <strong>framing</strong>).</li>
                 ${italianExplanation('Anthropologically accurate', `Antropologicamente accurato.`)}
                 ${italianExplanation('Framing', `Inquadramento.`)}
                <li>Comparative Overviews (Comparing approaches).</li>
                <li>Decision Support Content (For culture/medicine <strong>divergence</strong>).</li>
                 ${italianExplanation('Diverge', `Divergere.`)}
                <li>Community Guidelines (Culturally sensitive interaction).</li>
            </ul>
        </section>

         <section>
            <h3>8.2 Editorial Standards ${iconHTML('standards')}</h3>
            <p><strong>Rigorous</strong> standards for accuracy & sensitivity:</p>
             ${italianExplanation('Rigorous', `Rigoroso.`)}
             ${italianExplanation('Editorial Standards', `Standard editoriali.`)}
            <ul>
                <li>Medical Review Process (<strong>Three-tier verification</strong>).</li>
                 ${italianExplanation('Three-tier verification', `Verifica a tre livelli.`)}
                <li>Cultural Authenticity Verification (Consultants prevent <strong>misrepresentation</strong>/<strong>stereotyping</strong>).</li>
                 ${italianExplanation('Misrepresentation', `Travisamento.`)}
                 ${italianExplanation('Stereotyping', `Stereotipizzazione.`)}
                <li>Linguistic Adaptation (<strong>Transcreation</strong>).</li>
                 ${italianExplanation('Transcreation', `Adattamento culturale del messaggio.`)}
                <li>Balanced Representation (No <strong>privileging</strong> Western <strong>paradigms</strong>).</li>
                 ${italianExplanation('Privileging', `Privilegiare.`)}
                 ${italianExplanation('Paradigms', `Paradigmi.`)}
                <li><strong>Trauma-Informed Language</strong>.</li>
                 ${italianExplanation('Trauma-Informed Language', `Linguaggio informato sul trauma.`)}
            </ul>
        </section>

        <section>
            <h3>8.3 Visual Content Strategy ${iconHTML('visuals')}</h3>
            <p>Guidelines for images/videos:</p>
             <ul>
                 <li>Cultural Appropriateness (Review for unintended meanings/<strong>taboos</strong>).</li>
                  ${italianExplanation('Taboo', `Tabù.`)}
                 <li>Diverse Representation (Systematic approach).</li>
                  ${italianExplanation('Systematic approach', `Approccio sistematico.`)}
                 <li>Medical Accuracy (Verified visuals, respecting sensitivities).</li>
                 <li>Emotional Sensitivity (Categorized to prevent <strong>triggers</strong>).</li>
                  ${italianExplanation('Triggering content', `Contenuto scatenante (trigger).`)}
                 <li>Illustration Preference (For sensitive topics).</li>
             </ul>
        </section>

        <section>
            <h3>8.4 Localisation Framework ${iconHTML('localisation')}</h3>
            <p>Adaptation beyond translation:</p>
            ${italianExplanation('Localisation (L10n)', `Localizzazione (adattamento culturale).`)}
            <ul>
                <li>Cultural <strong>Calibration</strong> (Regional variations).</li>
                 ${italianExplanation('Calibration', `Calibrazione.`)}
                <li><strong>Dialectical</strong> Awareness.</li>
                 ${italianExplanation('Dialectal', `Dialettale.`)}
                <li>Measurement Localisation.</li>
                <li>Cultural Calendar Integration.</li>
                <li>Name Pluralisation & <strong>Honorifics</strong>.</li>
                 ${italianExplanation('Honorifics', `Onorifici.`)}
            </ul>
        </section>
    `;
}


// --- initPrivacy (Section 9) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initPrivacy(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('privacy')} 9. Data Management and Privacy</h2>
        <p>Ensuring user trust through <strong>robust</strong> data protection.</p>
         ${italianExplanation('Robust', `Robusto.`)}

        <section>
            <h3>9.1 Data Collection Principles ${iconHTML('principles')}</h3>
            <p>Adhering to <strong>privacy by design</strong>:</p>
            ${italianExplanation('Privacy by Design', `Privacy fin dalla progettazione.`)}
            <ul>
                <li><strong>Minimal Collection</strong> (<strong>Purpose specification</strong>).</li>
                 ${italianExplanation('Data minimization', `Minimizzazione dei dati.`)}
                 ${italianExplanation('Purpose specification', `Specificazione della finalità.`)}
                <li><strong>Informed Consent</strong> (<strong>Multi-layered</strong>, contextual).</li>
                 ${italianExplanation('Informed Consent', `Consenso informato.`)}
                 ${italianExplanation('Multi-layered consent', `Consenso multi-livello.`)}
                <li><strong>Progressive Disclosure (Data)</strong>.</li>
                 ${italianExplanation('Progressive Disclosure (Data)', `Rivelazione progressiva dei dati.`)}
                <li><strong>Data Sovereignty</strong> (Ownership, <strong>portability</strong>, deletion).</li>
                 ${italianExplanation('Data Sovereignty', `Sovranità dei dati.`)}
                 ${italianExplanation('Portability (Data)', `Portabilità dei dati.`)}
                <li><strong>Purpose Limitation</strong> (Preventing <strong>function creep</strong>).</li>
                 ${italianExplanation('Purpose Limitation', `Limitazione della finalità.`)}
                 ${italianExplanation('Function creep', `Estensione dell'ambito ("scope creep") applicata alle funzionalità, o all'uso dei dati oltre lo scopo originale.`)}
            </ul>
        </section>

        <section>
            <h3>9.2 Sensitive Data Handling ${iconHTML('handling')}</h3>
            <p><strong>Extraordinary</strong> protection:</p>
             ${italianExplanation('Extraordinary', `Straordinario.`)}
            <ul>
                <li><strong>Encryption</strong> (<strong>E2EE</strong>, at rest <strong>AES-256</strong>, in transit TLS 1.2+, <strong>PFS</strong>).</li>
                 ${italianExplanation('Encryption', `Cifratura.`)}
                 ${italianExplanation('E2EE', `Cifratura end-to-end.`)}
                 ${italianExplanation('Encryption at rest', `Cifratura a riposo.`)}
                 ${italianExplanation('AES-256', `Standard cifratura avanzato.`)}
                 ${italianExplanation('Encryption in transit', `Cifratura in transito.`)}
                 ${italianExplanation('TLS', `Transport Layer Security.`)}
                 ${italianExplanation('PFS', `Perfect Forward Secrecy.`)}
                <li><strong>Anonymisation Protocols</strong> (k-anonymity, l-diversity, differential privacy).</li>
                 ${italianExplanation('Anonymisation Protocols', `Protocolli di anonimizzazione.`)}
                 ${italianExplanation('k-anonymity', `k-anonimato.`)} ${italianExplanation('l-diversity', `l-diversità.`)} ${italianExplanation('Differential privacy', `Privacy differenziale.`)}
                <li><strong>Secure Storage Architecture</strong> (<strong>Data residency</strong> controls).</li>
                 ${italianExplanation('Data residency', `Residenza dei dati.`)}
                <li><strong>Access Controls</strong> (<strong>Least privilege</strong>, RBAC, logging, <strong>anomaly detection</strong>).</li>
                 ${italianExplanation('Principle of least privilege', `Principio privilegio minimo.`)}
                 ${italianExplanation('RBAC', `Controllo accessi basato sui ruoli.`)}
                 ${italianExplanation('Mandatory access logging', `Log accessi obbligatorio.`)}
                 ${italianExplanation('Anomaly detection', `Rilevamento anomalie.`)}
                <li><strong>Retention Limitations</strong> (Automatic <strong>purging</strong>).</li>
                 ${italianExplanation('Retention', `Conservazione (dei dati).`)} ${italianExplanation('Purging', `Eliminazione.`)}
            </ul>
        </section>

        <section>
            <h3>9.3 Special Category Considerations</h3>
            <p>Heightened protection (aligning with <strong>GDPR Art. 9</strong>):</p>
             ${italianExplanation('Special Category Data (GDPR Art. 9)', `Dati categoria speciale (GDPR). Richiedono tutele extra.`)}
             <ul>
                <li>Cultural Affiliation (Preventing <strong>discrimination</strong>).</li>
                 ${italianExplanation('Discrimination', `Discriminazione.`)}
                <li>Reproductive Health (Complications, tests, <strong>fertility treatments</strong>).</li>
                 ${italianExplanation('Safeguards', `Salvaguardie.`)} ${italianExplanation('Fertility treatments', `Trattamenti fertilità.`)}
                <li>Migration Status (<strong>Displacement</strong> history).</li>
                 ${italianExplanation('Displacement', `Spostamento forzato.`)}
                <li>Family Structure (Non-traditional, assisted reproduction).</li>
                 ${italianExplanation('Assisted reproduction', `Riproduzione assistita.`)}
                <li>Traditional Practices (Preventing <strong>stigmatisation</strong>).</li>
                 ${italianExplanation('Stigmatised', `Stigmatizzato.`)}
            </ul>
        </section>

        <section>
            <h3>9.4 Data Governance Framework ${iconHTML('governance')}</h3>
            <p><strong>Oversight mechanisms</strong> for compliance & ethics:</p>
             ${italianExplanation('Data Governance', `Governo dei dati.`)}
             ${italianExplanation('Oversight mechanisms', `Meccanismi supervisione.`)}
             ${italianExplanation('Compliance', `Conformità.`)}
            <ul>
                <li><strong>Ethics Committee</strong> (Diverse body).</li>
                 ${italianExplanation('Ethics Committee', `Comitato etico.`)} ${italianExplanation('Privacy advocates', `Sostenitori privacy.`)} ${italianExplanation('Medical ethicists', `Esperti etica medica.`)}
                <li>Regular <strong>Auditing</strong> (Bias checks).</li>
                 ${italianExplanation('Auditing', `Revisione.`)}
                <li><strong>Transparency Reporting</strong>.</li>
                 ${italianExplanation('Transparency Reporting', `Reportistica sulla trasparenza (es. su uso dati, richieste accesso).`)}
                <li><strong>Vulnerability Management</strong> (Proactive <strong>remediation</strong>).</li>
                 ${italianExplanation('Vulnerability Management', `Gestione vulnerabilità.`)} ${italianExplanation('Remediation', `Rimedio.`)}
                <li><strong>Third-Party Assessment</strong>.</li>
                 ${italianExplanation('Third-Party Assessment', `Valutazione terze parti.`)}
            </ul>
        </section>
    `;
}


// --- initImpact (Section 10) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initImpact(contentArea: Element): void {
    contentArea.innerHTML = `
         <h2>${iconHTML('impact')} 10. Analytics and Measurement</h2>
         <p>Evaluating FelloWS's performance and impact while respecting privacy and cultural context.</p>
          ${italianExplanation('Analytics', `Analitica. Processo di scoperta e comunicazione di pattern significativi nei dati.`)}
          ${italianExplanation('Measurement', `Misurazione.`)}
          ${italianExplanation('Performance evaluation', `Valutazione delle prestazioni.`)}

         <section>
            <h3>10.1 Success Metrics ${iconHTML('metrics')}</h3>
            <p>Balancing <strong>quantitative</strong> & <strong>qualitative</strong> measures, adapted for culture:</p>
             ${italianExplanation('Quantitative measures', `Misure quantitative (numeriche).`)}
             ${italianExplanation('Qualitative measures', `Misure qualitative (descrittive).`)}
             ${italianExplanation('Adapted for cultural context', `Adattato al contesto culturale.`)}
            <ul>
                <li><strong>User Engagement:</strong> Patterns (<strong>feature adoption</strong>, session length/frequency) accounting for interaction norms.</li>
                 ${italianExplanation('User Engagement', `Coinvolgimento utente.`)}
                 ${italianExplanation('Feature adoption', `Adozione funzionalità.`)}
                 ${italianExplanation('Accounting for interaction norms', `Tenere conto norme interazione.`)}
                <li><strong>Medical Outcome Correlation:</strong> Anonymous aggregation (adherence, wellbeing) from <strong>voluntary</strong> data with consent.</li>
                 ${italianExplanation('Outcome', `Esito.`)} ${italianExplanation('Correlation', `Correlazione.`)} ${italianExplanation('Anonymous aggregation', `Aggregazione anonima.`)} ${italianExplanation('Voluntarily', `Volontariamente.`)} ${italianExplanation('Explicit consent', `Consenso esplicito.`)} ${italianExplanation('Adherence', `Aderenza.`)}
                <li><strong>Cultural Satisfaction:</strong> Metrics on cultural respect, representation, usefulness.</li>
                 ${italianExplanation('Metrics', `Metriche.`)} ${italianExplanation('Perception', `Percezione.`)} ${italianExplanation('Representation', `Rappresentazione.`)} ${italianExplanation('Usefulness', `Utilità.`)} ${italianExplanation('Culturally-tailored', `Su misura culturale.`)}
                <li><strong>Knowledge Transfer:</strong> Assessing retention & application of info (quizzes, <strong>self-reporting</strong>).</li>
                 ${italianExplanation('Knowledge Transfer', `Trasferimento conoscenza.`)} ${italianExplanation('Retain', `Mantenere.`)} ${italianExplanation('Self-reporting', `Autovalutazione.`)}
                <li><strong>Healthcare System Navigation:</strong> Tracking use of features aiding formal care interaction.</li>
            </ul>
        </section>

         <section>
            <h3>10.2 Analytics Implementation ${iconHTML('analyticsImpl')}</h3>
            <p>Measurement systems with privacy <strong>at the forefront</strong>:</p>
             ${italianExplanation('Implementation', `Implementazione.`)} ${italianExplanation('At the forefront', `In prima linea, come priorità.`)}
             <ul>
                <li><strong>Privacy-Preserving Analytics:</strong> Techniques (<strong>differential privacy</strong>, <strong>on-device processing</strong>).</li>
                  ${italianExplanation('Privacy-Preserving Analytics', `Analisi che preserva la privacy.`)}
                  ${italianExplanation('Differential Privacy', `Privacy differenziale.`)}
                  ${italianExplanation('On-device processing', `Elaborazione sul dispositivo.`)}
                <li><strong>Cultural Cohort Analysis:</strong> <strong>Segmentation</strong> without reinforcing stereotypes (ethical oversight needed).</li>
                 ${italianExplanation('Cohort Analysis', `Analisi di coorte.`)} ${italianExplanation('Segmentation', `Segmentazione.`)} ${italianExplanation('Reinforcing stereotypes', `Rafforzare stereotipi.`)} ${italianExplanation('Ethical oversight', `Supervisione etica.`)}
                <li><strong>Engagement Respect:</strong> Interpreting usage considering cultural variations.</li>
                <li><strong>Contextual Satisfaction Measurement:</strong> Culturally adapted feedback.</li>
                 ${italianExplanation('Feedback mechanisms', `Meccanismi di feedback.`)}
                <li><strong>Impact Assessment:</strong> <strong>Longitudinal evaluation</strong> of influence on confidence, engagement, identity.</li>
                 ${italianExplanation('Longitudinal evaluation', `Valutazione longitudinale.`)}
                 ${italianExplanation('Identity preservation', `Preservazione identità.`)}
            </ul>
        </section>

         <section>
            <h3>10.3 Continuous Improvement Process ${iconHTML('improvement')}</h3>
            <p>Systematic approach to <strong>refining</strong> based on insights:</p>
             ${italianExplanation('Continuous Improvement', `Miglioramento continuo.`)}
             ${italianExplanation('Refining', `Rifinire.`)}
             ${italianExplanation('Insights', `Intuizioni basate sui dati.`)}
             <ul>
                 <li><strong>Cultural Advisory Panel</strong></li>
                  ${italianExplanation('Advisory Panel', `Comitato consultivo.`)}
                 <li><strong>Medical Review Cycle</strong> (Quarterly)</li>
                 <li><strong>User Voice Programme</strong> (Qualitative feedback, sensitive <strong>outreach</strong>)</li>
                  ${italianExplanation('Usability tests', `Test di usabilità.`)}
                  ${italianExplanation('Outreach methodologies', `Metodologie di contatto.`)}
                 <li><strong>Behavioural Analysis</strong> (Detecting cultural <strong>friction points</strong> / <strong>abandonment</strong>)</li>
                  ${italianExplanation('Behavioural Analysis', `Analisi comportamentale.`)}
                  ${italianExplanation('Friction points', `Punti di attrito.`)}
                  ${italianExplanation('Abandonment', `Abbandono.`)}
                 <li><strong>A/B Testing Framework</strong> (Culturally aware experiments).</li>
                  ${italianExplanation('A/B Testing', `Test A/B.`)}
                  ${italianExplanation('Framework', `Struttura.`)}
             </ul>
        </section>
    `;
}


// --- initRoadmap (Section 11) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initRoadmap(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('roadmap')} 11. Implementation and Rollout</h2>
        <p>Defining the development methodology and strategy for bringing FelloWS to market.</p>
         ${italianExplanation('Implementation', `Implementazione.`)}
         ${italianExplanation('Rollout', `Lancio sul mercato.`)}

        <section>
            <h3>11.1 Development Approach ${iconHTML('devApproach')}</h3>
            <p>Methodology emphasising inclusion, ethics, <strong>agility</strong>:</p>
             ${italianExplanation('Agility / Agile Methodology', `Metodologia Agile (flessibilità, collaborazione, iterazione).`)}
            <ul>
                <li><strong>Cultural Consultants Integration:</strong> <strong>Embedding</strong> consultants in teams.</li>
                 ${italianExplanation('Embedding', `Incorporare.`)}
                 ${italianExplanation('Sprint (in Agile/Scrum)', `Sprint (ciclo di lavoro breve).`)}
                <li><strong>Agile Ceremonial Adaptation:</strong> Modifying processes (planning, reviews, <strong>retrospectives</strong>) for cultural checks.</li>
                 ${italianExplanation('Agile Ceremonies', `Cerimonie/Eventi Agili.`)}
                 ${italianExplanation('Retrospectives', `Retrospettive Agile.`)}
                <li><strong>Ethical Design Workshops:</strong> Examining <strong>unintended consequences</strong>.</li>
                 ${italianExplanation('Unintended consequences', `Conseguenze non intenzionali.`)}
                <li><strong>Inclusive Testing Strategy:</strong> Diverse participants.</li>
                <li><strong>Continuous Cultural Training:</strong> Education on competency & <strong>unconscious bias</strong>.</li>
                 ${italianExplanation('Unconscious bias', `Pregiudizio inconscio.`)}
            </ul>
        </section>

        <section>
            <h3>11.2 MVP Definition ${iconHTML('mvp')}</h3>
            <p><strong>Minimum Viable Product</strong> for initial launch:</p>
             ${italianExplanation('MVP (Minimum Viable Product)', `Prodotto Minimo Funzionante/Vitale.`)}
            <ul>
                <li>Cultural Profiling System</li> <li>Basic Cultural-Medical Comparison</li>
                <li>Essential Timeline (5 cultures)</li> <li>Foundational Knowledge Base</li>
                 ${italianExplanation('Foundational', `Fondamentale.`)}
                <li>Limited Community Features</li>
            </ul>
             <div class="mermaid">
                graph TD; A[Profiling] --> B(Comparison); A --> C(Timeline); A --> D(Knowledge); A --> E(Community); B & C & D & E --> F((Launch & Learn)); classDef default fill:#C0C0C0,stroke:#000;
             </div>
              ${italianExplanation('Diagramma MVP', `Mostra le componenti essenziali dell'MVP.`)}
        </section>

        <section>
            <h3>11.3 Phased Rollout Plan ${iconHTML('rollout')}</h3>
            <p><strong>Sequenced</strong> market introduction:</p>
             ${italianExplanation('Sequenced', `Sequenziato.`)}
             <div class="mermaid">
                gantt; dateFormat YYYY-QQ; title FelloWS Rollout (Illustrative); axisFormat %Y-Q%q;
                section Phase 1: Pilot (Validation); Community Partnerships : P1, 2025-Q3, 2; HCP Pilot : P1b, after P1, 1;
                section Phase 2: Early Adopter (Growth); Provider Adoption : P2, after P1b, 2; Consumer Marketing : P2b, after P2, 3;
                section Phase 3: Scaling (Reach); New Region Localisation : P3, after P2b, 4; Platform Scaling : P3b, during P3, 2;
                section Phase 4: Enterprise (Integration); System Integration : P4, after P3, 4; Insurance Partnership : P4b, after P4, 2;
             </div>
             ${italianExplanation('Diagramma di Gantt (Rollout)', `Illustra sequenza e durata stimata (in trimestri) delle fasi di lancio.`)}
             <ol>
                <li>Phase 1: Community Partnerships (3 EU cities).</li>
                <li>Phase 2: HCP Adoption (Specialists).</li>
                <li>Phase 3: Direct Consumer Expansion (Diversity regions).</li>
                <li>Phase 4: Geographic Expansion.</li>
                <li>Phase 5: Enterprise Integration (Health systems/insurers).</li>
                 ${italianExplanation('Enterprise Integration', `Integrazione aziendale.`)}
            </ol>
        </section>

        <section>
            <h3>11.4 Technical Rollout Considerations</h3>
            <p><strong>Deployment</strong> strategy specifics:</p>
             ${italianExplanation('Deployment', `Distribuzione software.`)}
             <ul>
                 <li>Seasonal Sensitivity (Birth rate <strong>fluctuations</strong>).</li>
                  ${italianExplanation('Fluctuations', `Fluttuazioni.`)}
                 <li>Service <strong>Reliability</strong> (>99.9% <strong>uptime</strong>).</li>
                  ${italianExplanation('Reliability', `Affidabilità.`)} ${italianExplanation('Uptime', `Tempo di attività.`)}
                 <li>Data Migration Pathways.</li>
                  ${italianExplanation('Data Migration', `Migrazione dati.`)} ${italianExplanation('Protocols', `Protocolli.`)}
                 <li>Version Support <strong>Longevity</strong> (9+ months).</li>
                  ${italianExplanation('Longevity', `Longevità.`)} ${italianExplanation('Inherent', `Inherente.`)}
                 <li>Cultural Calendar Awareness (Release scheduling).</li>
             </ul>
        </section>
    `;
}


// --- initRisks (Section 12) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initRisks(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('risks')} 12. Risks and Mitigation Strategies</h2>
        <p>Identifying potential challenges (<strong>Risks</strong>) and planning proactive measures (<strong>Mitigation</strong>).</p>
         ${italianExplanation('Risk', `Rischio. Evento incerto con potenziale impatto (solitamente negativo).`)}
         ${italianExplanation('Mitigation Strategy', `Strategia di mitigazione. Piano per ridurre probabilità o impatto di un rischio.`)}

        <section>
            <h3>12.1 Clinical Risks ${iconHTML('clinicalRisk')}</h3>
            <p>Health-related concerns:</p>
             ${italianExplanation('Clinical', `Clinico.`)}
            <ul>
                <li><strong>Risk:</strong> Medical Accuracy <strong>Drift</strong>.<br/><strong>Mitigation:</strong> Systematic reviews, version control, sourcing.</li>
                 ${italianExplanation('Drift', `Deriva.`)} ${italianExplanation('Systematic review protocols', `Protocolli revisione sistematica.`)} ${italianExplanation('Version control', `Controllo versione.`)}
                <li><strong>Risk:</strong> Cultural Practice Safety.<br/><strong>Mitigation:</strong> Safety classification, disclaimers, HCP dialogue.</li>
                 ${italianExplanation('Validation', `Validazione.`)} ${italianExplanation('Disclaimer', `Clausola non responsabilità.`)} ${italianExplanation('HCP', `Operatore sanitario.`)}
                <li><strong>Risk:</strong> Delayed Care Seeking.<br/><strong>Mitigation:</strong> <strong>Escalation prompts</strong>, scope definition.</li>
                 ${italianExplanation('Care escalation prompts', `Inviti escalation cure.`)} ${italianExplanation('Scope definition', `Definizione ambito.`)}
                <li><strong>Risk:</strong> Misinterpretation.<br/><strong>Mitigation:</strong> <strong>Multifaceted</strong> explanations, testing.</li>
                 ${italianExplanation('Multifaceted', `Multisfaccettato.`)}
                <li><strong>Risk:</strong> False Reassurance.<br/><strong>Mitigation:</strong> Warning systems, prioritizing safety.</li>
                 ${italianExplanation('False Reassurance', `Falsa rassicurazione.`)}
            </ul>
        </section>

         <section>
            <h3>12.2 Cultural Sensitivity Risks ${iconHTML('culturalRisk')}</h3>
             <p>Cross-cultural challenges:</p>
             <ul>
                <li><strong>Risk:</strong> Cultural <strong>Essentialisation</strong>.<br/><strong>Mitigation:</strong> Nuanced representation, <strong>intra-cultural diversity</strong>, customization.</li>
                 ${italianExplanation('Essentialisation', `Essenzializzazione.`)} ${italianExplanation('Intra-cultural diversity', `Diversità intra-culturale.`)} ${italianExplanation('Nuanced', `Sfumato.`)}
                <li><strong>Risk:</strong> Western Medical Dominance.<br/><strong>Mitigation:</strong> Balanced <strong>epistemological</strong> approaches, shared decision-making.</li>
                 ${italianExplanation('Epistemological', `Epistemologico.`)} ${italianExplanation('Shared decision-making', `Processo decisionale condiviso.`)}
                <li><strong>Risk:</strong> Cultural <strong>Appropriation</strong>.<br/><strong>Mitigation:</strong> Authentic collaboration, attribution, community benefit, avoiding <strong>exoticism</strong>.</li>
                 ${italianExplanation('Cultural Appropriation', `Appropriazione culturale.`)} ${italianExplanation('Authentic', `Autentico.`)} ${italianExplanation('Attribution', `Attribuzione.`)} ${italianExplanation('Exoticism', `Esotismo.`)}
                <li><strong>Risk:</strong> Conflicting Cultural Guidance.<br/><strong>Mitigation:</strong> Respectful <strong>mediation</strong> frameworks, discussion tools.</li>
                 ${italianExplanation('Mediation', `Mediazione.`)}
                <li><strong>Risk:</strong> Cultural Power Imbalances.<br/><strong>Mitigation:</strong> <strong>Decolonising methodologies</strong>.</li>
                 ${italianExplanation('Power Imbalances', `Squilibri potere.`)} ${italianExplanation('Colonial dynamics', `Dinamiche coloniali.`)} ${italianExplanation('Decolonising methodologies', `Metodologie decolonizzanti.`)}
            </ul>
        </section>

         <section>
            <h3>12.3 Technical Risks ${iconHTML('techRisk')}</h3>
             <p>Implementation challenges:</p>
             <ul>
                 <li>Data Quality Variations (Mitigation: Transparency, user contrib.).</li>
                 <li>Linguistic Limitation (Mitigation: Transcreation, reviews).</li>
                 <li>Algorithmic Bias (Mitigation: Bias testing, fairness metrics).</li>
                  ${italianExplanation('Algorithmic Bias', `Bias algoritmico.`)} ${italianExplanation('Healthcare disparities', `Disparità sanitarie.`)} ${italianExplanation('Fairness metrics', `Metriche di equità (per algoritmi).`)}
                 <li>Connectivity Challenges (Mitigation: Offline functionality).</li>
                 <li>Digital Literacy Variation (Mitigation: Adaptive UI).</li>
                  ${italianExplanation('Adaptive interface complexity', `Complessità adattiva interfaccia.`)}
             </ul>
        </section>

        <section>
            <h3>12.4 Business Risks ${iconHTML('businessRisk')}</h3>
             <p><strong>Sustainability</strong> challenges:</p>
              ${italianExplanation('Sustainability', `Sostenibilità (business).`)}
             <ul>
                 <li>Cultural Perception <strong>Backlash</strong> (Mitigation: Engagement, transparency).</li>
                  ${italianExplanation('Backlash', `Contraccolpo.`)} ${italianExplanation('Purists', `Puristi.`)} ${italianExplanation('Mediation (technological)', `Mediazione tecnologica.`)}
                 <li>Medical <strong>Liability</strong> (Mitigation: Disclaimers, boundaries, review, insurance).</li>
                  ${italianExplanation('Liability', `Responsabilità legale.`)} ${italianExplanation('Boundaries', `Confini.`)}
                 <li>Scalability Challenges (Cultural authenticity) (Mitigation: Knowledge mgmt, modularity).</li>
                  ${italianExplanation('Scalability Challenges (Cultural)', `Sfide scalabilità culturale.`)}
                 <li><strong>Monetisation</strong> Sensitivity (Mitigation: Transparent <strong>value exchange</strong> - freemium, B2B).</li>
                  ${italianExplanation('Monetisation', `Monetizzazione.`)} ${italianExplanation('Vulnerable', `Vulnerabile.`)} ${italianExplanation('Value exchange', `Scambio di valore.`)} ${italianExplanation('Freemium', `Modello Freemium.`)} ${italianExplanation('B2B', `Business-to-Business.`)}
                 <li>Competitive Response (Mitigation: Depth/authenticity as <strong>differentiator</strong>).</li>
                  ${italianExplanation('Incumbents', `Attori consolidati.`)} ${italianExplanation('Superficial', `Superficiale.`)} ${italianExplanation('Differentiator', `Elemento differenziante.`)}
             </ul>
        </section>
    `;
}

// --- initFuture (Section 13) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initFuture(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('future')} 13. Future Directions</h2>
        <p>Potential growth, innovation, and impact <strong>pathways</strong> <strong>beyond the initial scope</strong>.</p>
         ${italianExplanation('Pathways', `Percorsi.`)} ${italianExplanation('Beyond the initial scope', `Oltre l'ambito iniziale.`)}

        <section>
            <h3>13.1 Product Evolution Possibilities ${iconHTML('evolution')}</h3>
             ${italianExplanation('Evolution', `Evoluzione.`)}
             <ul>
                <li><strong>Postpartum Extension</strong> ("<strong>fourth trimester</strong>" & early child dev).</li>
                 ${italianExplanation('Postpartum', `Postparto.`)} ${italianExplanation('Fourth trimester', `Quarto trimestre.`)} ${italianExplanation('Child development', `Sviluppo infantile.`)}
                <li><strong>Partner Integration</strong> (Features for partners).</li>
                <li><strong>Healthcare Provider (HCP) Tools</strong> (Professional interfaces).</li>
                <li><strong>Cultural Knowledge Expansion</strong> (Adding more groups).</li>
                 ${italianExplanation('Demographics', `Dati demografici.`)} ${italianExplanation('Migration patterns', `Modelli migratori.`)}
                <li><strong>Research Collaboration Infrastructure</strong> (Ethical data sharing).</li>
                 ${italianExplanation('Infrastructure', `Infrastruttura.`)}
            </ul>
        </section>

        <section>
            <h3>13.2 Technology Innovation Opportunities ${iconHTML('innovation')}</h3>
             ${italianExplanation('Innovation', `Innovazione.`)}
            <ul>
                <li>Advanced Translation (Real-time, <strong>AR</strong>).</li>
                 ${italianExplanation('AR (Augmented Reality)', `Realtà Aumentata.`)}
                <li>Predictive Cultural Guidance (<strong>AI/ML</strong>).</li>
                 ${italianExplanation('AI/ML', `Intelligenza Artificiale / Apprendimento Automatico.`)} ${italianExplanation('Anticipation', `Anticipazione.`)}
                <li><strong>Voice-First Interaction</strong> (Hands-free guidance).</li>
                 ${italianExplanation('Voice-First', `Approccio Voice-First.`)} ${italianExplanation('Labour and delivery', `Travaglio e parto.`)}
                <li><strong>Wearable Integration</strong> (Context + <strong>physiological</strong> data).</li>
                 ${italianExplanation('Wearable', `Dispositivo indossabile.`)} ${italianExplanation('Physiological', `Fisiologico.`)}
                <li><strong>Virtual Cultural Doulas</strong> (AI agents).</li>
                 ${italianExplanation('Doula', `Figura supporto non medico.`)} ${italianExplanation('Conversational agents', `Agenti conversazionali.`)} ${italianExplanation('Embodying', `Incarnare.`)}
            </ul>
        </section>

         <section>
            <h3>13.3 Impact Expansion Vision ${iconHTML('impactVision')}</h3>
            <p>Broader <strong>societal influence</strong>:</p>
             ${italianExplanation('Societal influence', `Influenza sociale.`)}
            <ul>
                <li>Healthcare System Transformation (<strong>Data-driven insights</strong> for <strong>responsive</strong> systems).</li>
                 ${italianExplanation('Data-driven insights', `Intuizioni basate sui dati.`)} ${italianExplanation('Culturally responsive', `Culturalmente responsivo.`)}
                <li><strong>Intergenerational Knowledge Preservation</strong> (Documenting traditional wisdom).</li>
                 ${italianExplanation('Intergenerational', `Intergenerazionale.`)} ${italianExplanation('Preservation', `Conservazione.`)} ${italianExplanation('Globalisation', `Globalizzazione.`)}
                <li>Cross-Cultural Understanding (Facilitating <strong>appreciation</strong>).</li>
                 ${italianExplanation('Facilitation', `Facilitazione.`)} ${italianExplanation('Appreciation', `Apprezzamento.`)}
                <li><strong>Maternal Health Equity</strong> (Reducing <strong>disparities</strong>).</li>
                 ${italianExplanation('Maternal Health Equity', `Equità salute materna.`)} ${italianExplanation('Disparities', `Disparità.`)} ${italianExplanation('Migrant', `Migrante.`)} ${italianExplanation('Minority', `Minoranza.`)}
                <li><strong>Policy Influence</strong> (Evidence-based <strong>advocacy</strong>).</li>
                 ${italianExplanation('Policy', `Politica pubblica.`)} ${italianExplanation('Advocacy', `Sostegno attivo.`)}
            </ul>
        </section>
    `;
}

// --- initAppendices (Section 14) ---
// (Implementazione Completa con Spiegazioni Esaustive)
function initAppendices(contentArea: Element): void {
    contentArea.innerHTML = `
        <h2>${iconHTML('appendices')} 14. Appendices</h2>
        <p>Supporting documents and detailed references. <em>(Content below is illustrative).</em></p>
         ${italianExplanation('Appendices', `Appendici. Informazioni supplementari alla fine di un documento.`)}
         ${italianExplanation('Complementing', `Che completa.`)}
         ${italianExplanation('Illustrative', `Esemplificativo.`)}

        <section>
            <h3>14.1 Glossary of Cultural Terms ${iconHTML('glossary')}</h3>
            <p>Detailed definitions and context.</p>
            <p><em>Example: Definition of "Closing the Bones" ritual.</em></p>
            ${italianExplanation('Glossary', `Glossario.`)}
        </section>

        <section>
            <h3>14.2 Medical Evidence Standards ${iconHTML('evidence')}</h3>
            <p>Framework for evaluating/presenting medical info.</p>
            <p><em>Details on sourcing, grading (e.g., GRADE), updates.</em></p>
            ${italianExplanation('Framework', `Struttura.`)}
            ${italianExplanation('Confidence levels', `Livelli di confidenza.`)}
            ${italianExplanation('Contextualisation', `Contestualizzazione.`)}
            ${italianExplanation('GRADE methodology', `Metodologia GRADE.`)}
        </section>

        <section>
            <h3>14.3 Ethical Guidelines ${iconHTML('ethics')}</h3>
            <p>Comprehensive principles governing development, content, community, data.</p>
            <p><em>Includes <strong>beneficence</strong>, <strong>non-maleficence</strong>, autonomy, justice.</em></p>
             ${italianExplanation('Beneficence', `Beneficenza (etica).`)}
             ${italianExplanation('Non-maleficence', `Non maleficenza (etica).`)}
             ${italianExplanation('Autonomy', `Autonomia.`)}
             ${italianExplanation('Justice', `Giustizia (etica).`)}
        </section>

        <section>
            <h3>14.4 API Documentation ${iconHTML('api')}</h3>
            <p>Technical specifications for integrations.</p>
            <p><em>(Endpoint definitions, data schemas (JSON), auth methods, rate limits).</em></p>
             ${italianExplanation('API', `Interfaccia Programmazione Applicazioni.`)}
             ${italianExplanation('Developer ecosystem', `Ecosistema sviluppatori.`)}
             ${italianExplanation('Endpoint', `Punto finale API.`)}
             ${italianExplanation('Schema', `Schema dati.`)}
             ${italianExplanation('JSON', `JavaScript Object Notation.`)}
             ${italianExplanation('Rate limits', `Limiti di frequenza.`)}
        </section>

        <section>
            <h3>14.5 Regulatory Compliance Matrix ${iconHTML('compliance')}</h3>
            <p>Mapping of relevant regulations (healthcare, privacy, consumer) to FelloWS features.</p>
            <p><em>Lists regulations like GDPR, HIPAA, local laws, and compliance measures.</em></p>
            ${italianExplanation('Regulatory Compliance', `Conformità normativa.`)}
            ${italianExplanation('Matrix', `Matrice.`)}
            ${italianExplanation('GDPR', `Regolamento Generale Protezione Dati (UE).`)}
            ${italianExplanation('HIPAA', `Legge USA privacy dati sanitari.`)}
        </section>
    `;
}


// --- Window Dragging Logic (Identico a Gemini 95) ---
function startDragging(e: MouseEvent, windowElement: HTMLDivElement): void { const targetElement = e.target as HTMLElement; const titlebar = targetElement.closest('.window-titlebar'); if (!titlebar || targetElement.closest('.window-control-button')) { isDragging = false; return; } isDragging = true; draggedWindow = windowElement; bringToFront(windowElement); const rect = windowElement.getBoundingClientRect(); dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top; document.addEventListener('mousemove', dragWindow, { capture: true }); document.addEventListener('mouseup', stopDragging, { once: true, capture: true }); (titlebar as HTMLElement).style.cursor = 'grabbing'; e.preventDefault(); }
function dragWindow(e: MouseEvent): void { if (!isDragging || !draggedWindow) return; window.requestAnimationFrame(() => { if (!isDragging || !draggedWindow) return; let x = e.clientX - dragOffsetX; let y = e.clientY - dragOffsetY; const taskbarHeight = (taskbarAppsContainer.parentElement?.offsetHeight ?? 36); const maxX = window.innerWidth - draggedWindow.offsetWidth; const maxY = window.innerHeight - draggedWindow.offsetHeight - taskbarHeight; const minX = -(draggedWindow.offsetWidth - 40); const maxXAdjusted = window.innerWidth - 40; x = Math.max(minX, Math.min(x, maxXAdjusted)); y = Math.max(0, Math.min(y, maxY)); draggedWindow.style.left = `${x}px`; draggedWindow.style.top = `${y}px`; }); }
function stopDragging(e: MouseEvent): void { if (!isDragging) return; const titleBar = draggedWindow?.querySelector('.window-titlebar') as HTMLDivElement | null; if (titleBar) titleBar.style.cursor = 'grab'; isDragging = false; draggedWindow = null; document.removeEventListener('mousemove', dragWindow, { capture: true }); e.stopPropagation(); }

// --- Update Clock (Real-time) ---
function updateClock(): void {
    if (taskbarClock) {
        const now = new Date();
        const timeString = now.toLocaleTimeString(navigator.language || 'en-US', { hour: 'numeric', minute: '2-digit' });
        taskbarClock.textContent = timeString;
    }
}

// --- Shutdown Simulation ---
function initiateShutdown(): void {
    if (shutdownOverlay) {
        Array.from(openApps.keys()).forEach(appName => closeApp(appName));
        setTimeout(() => shutdownOverlay.classList.add('visible'), 300);
    }
    if (clockIntervalId) clearInterval(clockIntervalId);
    clockIntervalId = null;
    console.log("Shutdown initiated.");
}

function restartSimulation(): void {
    console.log("Restarting simulation...");
    window.location.reload();
}

// --- Event Listeners Setup ---
function setupEventListeners(): void {
    // Desktop Icon Clicks (Double Click)
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appName = icon.getAttribute('data-app');
            if (appName) { openApp(appName).catch(console.error); startMenu.classList.remove('active'); }
        });
        icon.addEventListener('click', (e) => { // Selezione icona
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            e.stopPropagation();
        });
    });

    // Start Menu Item Clicks
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const appName = (item as HTMLElement).getAttribute('data-app');
            const action = (item as HTMLElement).getAttribute('data-action');
            startMenu.classList.remove('active');
            if (appName) { openApp(appName).catch(console.error); }
            else if (action === 'shutdown') { initiateShutdown(); }
        });
    });

    // Start Button Click
    startButton.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('active'); if (startMenu.classList.contains('active')) { highestZIndex++; startMenu.style.zIndex = String(highestZIndex + 50); } });

    // Window Interactions
    windows.forEach(windowElement => {
        const titleBar = windowElement.querySelector('.window-titlebar') as HTMLDivElement | null;
        const closeButton = windowElement.querySelector('.window-close') as HTMLButtonElement | null;
        const minimizeButton = windowElement.querySelector('.window-minimize') as HTMLButtonElement | null;

        windowElement.addEventListener('mousedown', (e) => { bringToFront(windowElement); }, true); // Capture phase

        if (closeButton) { closeButton.addEventListener('click', (e) => { e.stopPropagation(); closeApp(windowElement.id); }); }
        if (minimizeButton) { minimizeButton.addEventListener('click', (e) => { e.stopPropagation(); minimizeApp(windowElement.id); }); }
        if (titleBar) { titleBar.addEventListener('mousedown', (e) => startDragging(e, windowElement)); }

        // Posizionamento iniziale casuale (non per splash)
        if (windowElement.id !== 'splashScreen') {
            const randomTop = Math.floor(Math.random() * (window.innerHeight / 5) + 20);
            const randomLeft = Math.floor(Math.random() * (window.innerWidth / 4) + 20);
            windowElement.style.top = `${randomTop}px`;
            windowElement.style.left = `${randomLeft}px`;
        }
    });

    // Global Click Listener
    document.addEventListener('click', (e) => {
        if (startMenu.classList.contains('active') && !startMenu.contains(e.target as Node) && !startButton.contains(e.target as Node)) { startMenu.classList.remove('active'); }
        const clickedElement = e.target as HTMLElement;
        if (clickedElement === desktop) {
             if(activeWindow) { activeWindow.classList.remove('active'); const appName = activeWindow.id; if(openApps.has(appName)) { openApps.get(appName)?.taskbarButton.classList.remove('active'); } activeWindow = null; }
             icons.forEach(i => i.classList.remove('selected'));
        }
    });

    // Shutdown overlay button
    if (shutdownRestartButton) { shutdownRestartButton.addEventListener('click', restartSimulation); }
    console.log("Event listeners set up.");
}

// --- Initial Setup ---
function initializeOS() {
    console.log("FelloWS OS Simulator Initializing (Retro Mode)...");
    if (!desktop || !startMenu || !startButton || !taskbarAppsContainer || !taskbarClock || !shutdownOverlay) { console.error("Critical UI element missing."); return; }
    setupEventListeners();
    updateClock();
    if (clockIntervalId) clearInterval(clockIntervalId);
    clockIntervalId = window.setInterval(updateClock, 1000); // Aggiorna ogni secondo

    // Avvia con lo Splash Screen (usa icona desktop per avviare)
    const splashIcon = findIconElement('splashScreen');
    if (splashIcon) {
        // Non apriamo automaticamente, l'utente deve cliccare l'icona "Start FelloWS OS"
        console.log("FelloWS OS Ready. Double-click 'Start FelloWS OS' icon to launch splash screen.");
    } else {
         // Fallback se manca l'icona splash, apriamo l'intro PRD
        console.warn("Splash screen ICON not found, opening prdIntro directly on first app open via other icons.");
        // In questo caso, l'intro si aprirà al primo click su un'altra icona
        // o lo lasciamo così e l'utente deve cliccare "About"?
        // Decido di non aprire nulla automaticamente se manca l'icona Splash.
        console.log("FelloWS OS Ready. Double-click an icon to explore.");
    }
}

// Avvia l'inizializzazione OS quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initializeOS);