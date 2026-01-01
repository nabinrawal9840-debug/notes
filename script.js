// ========== GITHUB CONFIGURATION ==========
const GITHUB_CONFIG = {
    baseUrl: 'https://nabinrawal1.github.io/notePokhraUniversity',
    isGitHubPages: window.location.hostname.includes('github.io'),
    repoName: 'notePokhraUniversity'
};

// ========== CONFIGURATION ==========
const CONFIG = {
    dots: {
        count: 50,
        lineCount: 15,
        colors: [
            'rgba(203, 85, 34, 0.6)',
            'rgba(255, 107, 53, 0.6)',
            'rgba(207, 23, 152, 0.6)',
            'rgba(26, 27, 48, 0.8)'
        ]
    },
    fingerprint: {
        rings: 6,
        lines: 18,
        dots: 24
    },
    pdf: {
        viewerUrl: 'viewer.html',
        defaultFileName: 'document.pdf',
        maxFileSize: 50 * 1024 * 1024,
        supportedFileTypes: ['.pdf', '.PDF'],
        types: {
            'notes': 'Notes',
            'syllabus': 'Syllabus',
            'oldisgold': 'Old Is Gold',
            'recentpaper': 'Recent Papers',
            'internalpaper': 'College Papers'
        }
    }
};

// ========== ENHANCED PATH UTILITY ==========
class PathUtil {
    static normalizePath(path) {
        if (!path) return '';
        
        // If it's already a full URL or data URL, return as is
        if (path.startsWith('http://') || 
            path.startsWith('https://') || 
            path.startsWith('data:') || 
            path.startsWith('blob:')) {
            return path;
        }
        
        // For GitHub Pages
        if (GITHUB_CONFIG.isGitHubPages) {
            // Remove leading ./ if present
            path = path.replace(/^\.\//, '');
            
            // If path doesn't start with /, add it
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            // Encode spaces and special characters
            path = encodeURI(path);
            
            // Add base URL for absolute paths
            return GITHUB_CONFIG.baseUrl + path;
        }
        
        // For local development
        return path.replace(/^\.\//, '');
    }
    
    static getViewerUrl(pdfPath, fileName) {
        const normalizedPath = this.normalizePath(pdfPath);
        const encodedPath = encodeURIComponent(normalizedPath);
        const encodedName = encodeURIComponent(fileName || CONFIG.pdf.defaultFileName);
        
        return `${CONFIG.pdf.viewerUrl}?file=${encodedPath}&title=${encodedName}`;
    }
    
    static getBaseUrl() {
        return GITHUB_CONFIG.baseUrl;
    }
    
    static isLocalDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }
    
    static encodePath(path) {
        return encodeURI(path);
    }
}

// ========== AUTO PATH FIXER ==========
class AutoPathFixer {
    static fixAllOnClickHandlers() {
        console.log('🛠️ Fixing all PDF paths for GitHub Pages...');
        
        document.querySelectorAll('[onclick*="openPDFViewer"]').forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                try {
                    // Extract path and title
                    const match = onclick.match(/openPDFViewer\('([^']+)',\s*'([^']+)'\)/);
                    if (match) {
                        const oldPath = match[1];
                        const title = match[2];
                        
                        // Fix common issues
                        let newPath = oldPath;
                        
                        // 1. Remove leading ./
                        newPath = newPath.replace(/^\.\//, '');
                        
                        // 2. Fix folder names with spaces
                        newPath = newPath.replace(/Old Is Gold/g, 'Old%20Is%20Gold');
                        
                        // 3. Ensure it starts with / for GitHub Pages
                        if (GITHUB_CONFIG.isGitHubPages && !newPath.startsWith('/') && !newPath.startsWith('http')) {
                            newPath = '/' + newPath;
                        }
                        
                        // Only update if path changed
                        if (newPath !== oldPath) {
                            const newOnclick = `openPDFViewer('${newPath}', '${title}')`;
                            btn.setAttribute('onclick', newOnclick);
                            console.log(`Fixed: ${oldPath} → ${newPath}`);
                        }
                    }
                } catch (error) {
                    console.error('Error fixing button:', error);
                }
            }
        });
        
        console.log('✅ Path fixing complete');
    }
}

// ========== ANIMATED DOTS BACKGROUND ==========
class AnimatedDots {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.dots = [];
        this.lines = [];
        this.mouseX = 50;
        this.mouseY = 50;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.createLines();
        this.setupEventListeners();
        this.startAnimation();
        this.optimizeForMobile();
    }
    
    createDots() {
        for (let i = 0; i < CONFIG.dots.count; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            const size = Math.random() * 4 + 3;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            dot.style.left = `${x}%`;
            dot.style.top = `${y}%`;
            
            const color = CONFIG.dots.colors[Math.floor(Math.random() * CONFIG.dots.colors.length)];
            dot.style.background = color;
            
            this.container.appendChild(dot);
            
            this.dots.push({
                element: dot,
                x: x,
                y: y,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                size: size
            });
        }
    }
    
    createLines() {
        for (let i = 0; i < CONFIG.dots.lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'dot-line';
            this.lines.push(line);
            this.container.appendChild(line);
        }
    }
    
    updateLines() {
        this.lines.forEach(line => {
            line.style.display = 'none';
        });
        
        let lineIndex = 0;
        
        for (let i = 0; i < this.dots.length && lineIndex < this.lines.length; i++) {
            for (let j = i + 1; j < this.dots.length && lineIndex < this.lines.length; j++) {
                const dx = this.dots[i].x - this.dots[j].x;
                const dy = this.dots[i].y - this.dots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 30) {
                    const line = this.lines[lineIndex];
                    line.style.display = 'block';
                    
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    line.style.left = `${this.dots[i].x}%`;
                    line.style.top = `${this.dots[i].y}%`;
                    line.style.width = `${distance}%`;
                    line.style.transform = `rotate(${angle}deg)`;
                    
                    line.style.opacity = (1 - distance / 30) * 0.3;
                    
                    lineIndex++;
                }
            }
        }
    }
    
    animate() {
        this.dots.forEach(dot => {
            dot.x += dot.speedX;
            dot.y += dot.speedY;
            
            if (dot.x <= 0 || dot.x >= 100) {
                dot.speedX *= -0.95;
                dot.x = Math.max(0, Math.min(100, dot.x));
            }
            
            if (dot.y <= 0 || dot.y >= 100) {
                dot.speedY *= -0.95;
                dot.y = Math.max(0, Math.min(100, dot.y));
            }
            
            dot.element.style.left = `${dot.x}%`;
            dot.element.style.top = `${dot.y}%`;
        });
        
        this.updateLines();
        
        requestAnimationFrame(() => this.animate());
    }
    
    handleMouseMove(e) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            this.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            this.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.dots.forEach(dot => {
                const dx = this.mouseX - dot.x;
                const dy = this.mouseY - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 25 && distance > 0) {
                    const force = (25 - distance) / 25;
                    dot.speedX -= (dx / distance) * force * 0.05;
                    dot.speedY -= (dy / distance) * force * 0.05;
                }
            });
        }
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('resize', () => this.updateLines());
    }
    
    startAnimation() {
        this.updateLines();
        this.animate();
    }
    
    optimizeForMobile() {
        if (window.innerWidth < 768) {
            this.dots.forEach(dot => {
                dot.speedX *= 0.7;
                dot.speedY *= 0.7;
            });
        }
    }
}

// ========== PROFESSIONAL FINGERPRINT ANIMATION ==========
class FingerprintGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.ringsContainer = this.container.querySelector('.fingerprint-rings');
        this.linesContainer = this.container.querySelector('.fingerprint-lines');
        this.dotsContainer = this.container.querySelector('.fingerprint-dots');
        
        this.init();
    }
    
    init() {
        this.createRings();
        this.createLines();
        this.createDots();
        this.startAnimations();
        this.addInteractivity();
    }
    
    createRings() {
        const ringColors = [
            'rgba(203, 85, 34, 0.3)',
            'rgba(255, 107, 53, 0.25)',
            'rgba(207, 23, 152, 0.2)',
            'rgba(203, 85, 34, 0.15)',
            'rgba(255, 107, 53, 0.1)',
            'rgba(207, 23, 152, 0.05)'
        ];
        
        for (let i = 0; i < CONFIG.fingerprint.rings; i++) {
            const ring = document.createElement('div');
            ring.className = 'fingerprint-ring';
            
            const size = 40 + (i * 20);
            ring.style.width = `${size}px`;
            ring.style.height = `${size}px`;
            ring.style.borderColor = ringColors[i];
            ring.style.borderWidth = `${1 + (i * 0.2)}px`;
            
            ring.style.animation = `ring-pulse ${3 + (i * 0.5)}s ease-in-out infinite`;
            ring.style.animationDelay = `${i * 0.3}s`;
            
            this.ringsContainer.appendChild(ring);
        }
    }
    
    createLines() {
        const angleStep = 360 / CONFIG.fingerprint.lines;
        
        for (let i = 0; i < CONFIG.fingerprint.lines; i++) {
            const line = document.createElement('div');
            line.className = 'fingerprint-line';
            
            const length = 70 + Math.random() * 40;
            const thickness = 1 + Math.random() * 1.5;
            const startAngle = (i * angleStep) + (Math.random() * 10 - 5);
            const endAngle = startAngle + (Math.random() * 30 - 15);
            
            line.style.width = `${length}px`;
            line.style.height = `${thickness}px`;
            line.style.setProperty('--start-angle', `${startAngle}deg`);
            line.style.setProperty('--mid-angle', `${(startAngle + endAngle) / 2}deg`);
            line.style.setProperty('--end-angle', `${endAngle}deg`);
            
            line.style.left = '50%';
            line.style.top = '50%';
            line.style.transformOrigin = '0 0';
            
            const animationDuration = 3 + Math.random() * 2;
            const animationDelay = (i * 0.1) + Math.random() * 0.5;
            line.style.animation = `line-scan ${animationDuration}s ease-in-out infinite`;
            line.style.animationDelay = `${animationDelay}s`;
            
            this.linesContainer.appendChild(line);
        }
    }
    
    createDots() {
        const radius = 80;
        
        for (let i = 0; i < CONFIG.fingerprint.dots; i++) {
            const dot = document.createElement('div');
            dot.className = 'fingerprint-dot';
            
            const angle = (i * 15) + (Math.random() * 10 - 5);
            const distance = 20 + (Math.random() * 60);
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            const size = 2 + Math.random() * 3;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            
            dot.style.left = `calc(50% + ${x}px)`;
            dot.style.top = `calc(50% + ${y}px)`;
            
            const opacity = 0.6 + Math.random() * 0.4;
            dot.style.opacity = opacity;
            
            const animationDuration = 1.5 + Math.random() * 1.5;
            const animationDelay = Math.random() * 2;
            dot.style.animation = `dot-glow ${animationDuration}s ease-in-out infinite`;
            dot.style.animationDelay = `${animationDelay}s`;
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    startAnimations() {
        const elements = this.container.querySelectorAll('[style*="animation"]');
        elements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
    
    addInteractivity() {
        const fingerprint = this.container.querySelector('.fingerprint-inner');
        
        fingerprint.addEventListener('mouseenter', () => {
            this.intensifyAnimations();
            this.container.style.transform = 'translateY(-50%) scale(1.05)';
            this.container.style.transition = 'transform 0.3s ease';
        });
        
        fingerprint.addEventListener('mouseleave', () => {
            this.resetAnimations();
            this.container.style.transform = 'translateY(-50%) scale(1)';
        });
        
        fingerprint.addEventListener('click', () => {
            this.playVerificationEffect();
        });
    }
    
    intensifyAnimations() {
        const elements = this.container.querySelectorAll('.fingerprint-line, .fingerprint-dot');
        elements.forEach(el => {
            const currentAnimation = el.style.animation;
            el.style.animation = currentAnimation.replace(/s ease-in-out/, 's linear');
            el.style.filter = 'brightness(1.5)';
        });
    }
    
    resetAnimations() {
        const elements = this.container.querySelectorAll('.fingerprint-line, .fingerprint-dot');
        elements.forEach(el => {
            const currentAnimation = el.style.animation;
            el.style.animation = currentAnimation.replace(/s linear/, 's ease-in-out');
            el.style.filter = 'brightness(1)';
        });
    }
    
    playVerificationEffect() {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(203, 85, 34, 0.8), transparent)';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.zIndex = '100';
        
        this.container.appendChild(ripple);
        
        const animation = ripple.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(10)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            ripple.remove();
        };
        
        this.intensifyAnimations();
        setTimeout(() => this.resetAnimations(), 1000);
    }
}

// ========== PDF TYPE FILTERING ==========
class PDFTypeFilter {
    constructor() {
        this.currentFilter = 'all';
        this.filterButtons = [];
        this.init();
    }
    
    init() {
        this.createFilterButtons();
        this.setupEventListeners();
        this.restoreFilterState();
    }
    
    createFilterButtons() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'pdf-type-filter';
        filterContainer.innerHTML = `
            <h4 class="filter-title">Filter by Type</h4>
            <div class="filter-buttons">
                <button class="filter-btn active" data-type="all">
                    <i class="fas fa-layer-group"></i> All Types
                </button>
                <button class="filter-btn" data-type="notes">
                    <i class="fas fa-book"></i> Notes
                </button>
                <button class="filter-btn" data-type="syllabus">
                    <i class="fas fa-file-contract"></i> Syllabus
                </button>
                <button class="filter-btn" data-type="oldisgold">
                    <i class="fas fa-gem"></i> Old Is Gold
                </button>
                <button class="filter-btn" data-type="recentpaper">
                    <i class="fas fa-file-alt"></i> Recent Papers
                </button>
                <button class="filter-btn" data-type="internalpaper">
                    <i class="fas fa-clipboard-list"></i> College Papers
                </button>
                <button class="filter-btn debug-btn" id="debugDataBtn" style="background: #666; color: white;">
                    <i class="fas fa-bug"></i> Debug
                </button>
            </div>
        `;
        
        // Insert at the beginning of sidebar content
        const sidebarContent = sidebar.querySelector('.sidebar-content') || sidebar;
        sidebarContent.insertBefore(filterContainer, sidebarContent.firstChild);
        
        this.filterButtons = filterContainer.querySelectorAll('.filter-btn');
        
        // Add debug button click handler
        document.getElementById('debugDataBtn')?.addEventListener('click', () => {
            const data = PDFDataCollector.collectPagePDFs();
            console.log('🧪 DEBUG PDF DATA:', data);
            alert(`Collected ${Object.keys(data.allPDFs).length} semesters with PDFs.\nOpen browser console (F12) for details.`);
        });
    }
    
    setupEventListeners() {
        this.filterButtons.forEach(btn => {
            if (btn.id !== 'debugDataBtn') {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    this.setFilter(type);
                    this.saveFilterState(type);
                });
            }
        });
    }
    
    setFilter(type) {
        this.currentFilter = type;
        
        // Update button states
        this.filterButtons.forEach(btn => {
            if (btn.id !== 'debugDataBtn') {
                if (btn.dataset.type === type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
        
        // Filter PDF items
        this.filterPDFItems(type);
        
        // Show toast notification
        const filterName = CONFIG.pdf.types[type] || 'All Types';
        UI.showToast(`Showing: ${filterName}`, 'info');
    }
    
    filterPDFItems(type) {
        const pdfItems = document.querySelectorAll('.pdf-item, .notes-table tr');
        
        if (type === 'all') {
            pdfItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('filtered-out');
            });
            return;
        }
        
        pdfItems.forEach(item => {
            const pdfType = item.dataset.pdfType || 
                           this.extractTypeFromRow(item) || 
                           this.extractTypeFromItem(item);
            
            if (pdfType === type) {
                item.style.display = '';
                item.classList.remove('filtered-out');
            } else {
                item.style.display = 'none';
                item.classList.add('filtered-out');
            }
        });
        
        // Update semester visibility
        this.updateSemesterVisibility();
    }
    
    extractTypeFromRow(row) {
        const viewBtn = row.querySelector('.view-btn');
        if (viewBtn) {
            const onclickText = viewBtn.getAttribute('onclick') || '';
            
            if (onclickText.includes('Files/notes/')) return 'notes';
            if (onclickText.includes('Files/Syllabus/')) return 'syllabus';
            if (onclickText.includes('Files/Old Is Gold/')) return 'oldisgold';
            if (onclickText.includes('Files/recentpaper/')) return 'recentpaper';
            if (onclickText.includes('Files/Internal_Paper/')) return 'internalpaper';
        }
        
        return null;
    }
    
    extractTypeFromItem(item) {
        const text = item.textContent.toLowerCase();
        
        if (text.includes('notes') || item.classList.contains('notes-item')) return 'notes';
        if (text.includes('syllabus')) return 'syllabus';
        if (text.includes('old') || text.includes('gold')) return 'oldisgold';
        if (text.includes('recent') || text.includes('paper')) return 'recentpaper';
        if (text.includes('internal')) return 'internalpaper';
        
        return null;
    }
    
    updateSemesterVisibility() {
        const semesterSections = document.querySelectorAll('.semester-section');
        
        semesterSections.forEach(section => {
            const visibleItems = section.querySelectorAll('.pdf-item:not([style*="display: none"]), .notes-table tr:not([style*="display: none"])');
            
            if (visibleItems.length === 0) {
                section.style.display = 'none';
                section.classList.add('filtered-out');
            } else {
                section.style.display = '';
                section.classList.remove('filtered-out');
            }
        });
    }
    
    saveFilterState(type) {
        localStorage.setItem('pdf_filter_type', type);
    }
    
    restoreFilterState() {
        const savedFilter = localStorage.getItem('pdf_filter_type');
        if (savedFilter) {
            setTimeout(() => this.setFilter(savedFilter), 100);
        }
    }
}

// ========== PDF DATA COLLECTOR ==========
class PDFDataCollector {
    static collectPagePDFs() {
        const allPDFs = {};
        
        const currentPage = window.location.pathname.split('/').pop();
        let pageType = 'notes';
        
        if (currentPage.includes('syllabus')) pageType = 'syllabus';
        else if (currentPage.includes('oldisgold')) pageType = 'oldisgold';
        else if (currentPage.includes('internalpaper')) pageType = 'internalpaper';
        else if (currentPage.includes('notes')) pageType = 'notes';
        
        const semesterSections = document.querySelectorAll('.semester-section');
        
        semesterSections.forEach(section => {
            const semesterId = section.id;
            const semesterHeader = section.querySelector('.semester-header h2');
            const semesterName = semesterHeader ? semesterHeader.textContent : `Semester ${semesterId.replace('sem', '')}`;
            
            const rows = section.querySelectorAll('table tbody tr');
            const pdfs = [];
            
            rows.forEach(row => {
                const code = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                const name = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                
                // Get ALL 5 view buttons from each row
                const viewButtons = row.querySelectorAll('.view-btn');
                
                // Each row has exactly 5 buttons:
                // Column 4: Notes (button index 0)
                // Column 5: Syllabus (button index 1)
                // Column 6: Old Is Gold (button index 2)
                // Column 7: Recent Papers (button index 3)
                // Column 8: College Papers (button index 4)
                
                viewButtons.forEach((btn, btnIndex) => {
                    if (btn && btn.onclick) {
                        const onclickAttr = btn.getAttribute('onclick');
                        if (onclickAttr) {
                            const match = onclickAttr.match(/openPDFViewer\('([^']+)',\s*'([^']+)'\)/);
                            if (match) {
                                // Normalize the file path for GitHub Pages
                                let file = PathUtil.normalizePath(match[1]);
                                const title = match[2];
                                
                                // Determine PDF type based on button position
                                let pdfType = 'notes';
                                switch(btnIndex) {
                                    case 0: // Notes column (4th column)
                                        pdfType = 'notes';
                                        break;
                                    case 1: // Syllabus column (5th column)
                                        pdfType = 'syllabus';
                                        break;
                                    case 2: // Old Is Gold column (6th column)
                                        pdfType = 'oldisgold';
                                        break;
                                    case 3: // Recent Papers column (7th column)
                                        pdfType = 'recentpaper';
                                        break;
                                    case 4: // College Papers column (8th column)
                                        pdfType = 'internalpaper';
                                        break;
                                    default:
                                        pdfType = pageType;
                                }
                                
                                // Create PDF object
                                const pdfObj = {
                                    file: file,
                                    title: title,
                                    code: code,
                                    name: name,
                                    semester: semesterId,
                                    semesterName: semesterName,
                                    type: pdfType,
                                    buttonIndex: btnIndex
                                };
                                
                                pdfs.push(pdfObj);
                            }
                        }
                    }
                });
            });
            
            if (pdfs.length > 0) {
                allPDFs[semesterId] = {
                    pdfs: pdfs,
                    pageType: pageType,
                    name: semesterName,
                    totalPDFs: pdfs.length
                };
            }
        });
        
        const totalPDFs = Object.values(allPDFs).reduce((sum, sem) => sum + (sem.pdfs?.length || 0), 0);
        console.log(`📊 PDF Data Collection Summary:`);
        console.log(`📊 Total PDFs collected: ${totalPDFs}`);
        console.log(`📊 Semesters with data: ${Object.keys(allPDFs).length}`);
        
        // Log breakdown by type
        Object.keys(allPDFs).forEach(semId => {
            const semData = allPDFs[semId];
            const typeCounts = {};
            semData.pdfs.forEach(pdf => {
                typeCounts[pdf.type] = (typeCounts[pdf.type] || 0) + 1;
            });
            console.log(`📚 ${semId}: ${semData.pdfs.length} PDFs -`, typeCounts);
        });
        
        return {
            allPDFs: allPDFs,
            pageType: pageType
        };
    }
    
    static detectPDFType(row, pageType) {
        const viewBtn = row.querySelector('.view-btn');
        if (viewBtn) {
            const onclickText = viewBtn.getAttribute('onclick') || '';
            
            if (onclickText.includes('Files/notes/')) return 'notes';
            if (onclickText.includes('Files/Syllabus/')) return 'syllabus';
            if (onclickText.includes('Files/Old Is Gold/')) return 'oldisgold';
            if (onclickText.includes('Files/recentpaper/')) return 'recentpaper';
            if (onclickText.includes('Files/Internal_Paper/')) return 'internalpaper';
        }
        
        return pageType;
    }
}

// ========== PDF VIEWER MODULE ==========
class PDFViewerModule {
    static currentPDF = null;
    
    static openViewer(pdfPath, fileName) {
        if (!pdfPath) {
            UI.showToast('PDF file not found', 'error');
            return;
        }
        
        // Normalize path for GitHub Pages compatibility
        const normalizedPath = PathUtil.normalizePath(pdfPath);
        
        const fileExt = normalizedPath.substring(normalizedPath.lastIndexOf('.')).toLowerCase();
        if (!CONFIG.pdf.supportedFileTypes.includes(fileExt)) {
            UI.showToast('Only PDF files are supported', 'error');
            return;
        }
        
        console.log('🔍 Opening PDF viewer...');
        console.log('Original File:', pdfPath);
        console.log('Normalized File:', normalizedPath);
        console.log('Title:', fileName);
        
        // Collect ALL PDF data from current page
        const pageData = PDFDataCollector.collectPagePDFs();
        
        // Find which semester and type this PDF belongs to
        let currentSemester = 'sem1';
        let pdfType = 'notes';
        
        console.log('📚 Looking for PDF in collected data...');
        
        for (const [semesterId, semesterData] of Object.entries(pageData.allPDFs)) {
            const found = semesterData.pdfs.find(pdf => 
                pdf.file === normalizedPath || pdf.file === pdfPath
            );
            if (found) {
                currentSemester = semesterId;
                pdfType = found.type;
                console.log(`✅ Found PDF in ${semesterId}, type: ${pdfType}`);
                break;
            }
        }
        
        // If not found, try to detect from URL
        if (!pageData.allPDFs[currentSemester]?.pdfs.some(pdf => pdf.file === normalizedPath)) {
            pdfType = this.detectTypeFromPath(normalizedPath);
            console.log(`📄 PDF not found, detected type from path: ${pdfType}`);
        }
        
        // Store source page for back navigation
        sessionStorage.setItem('pdfReferrer', window.location.pathname.split('/').pop());
        
        // Prepare enhanced viewer data
        const viewerData = {
            allPDFs: pageData.allPDFs,
            currentSemester: currentSemester,
            currentFile: normalizedPath,
            currentTitle: fileName,
            pageType: pdfType,
            pdfType: pdfType,
            timestamp: Date.now(),
            sourcePage: window.location.pathname
        };
        
        // Debug: Show what we're storing
        console.log('💾 Preparing viewer data:');
        console.log('- Current Semester:', currentSemester);
        console.log('- PDF Type:', pdfType);
        console.log('- Normalized Path:', normalizedPath);
        console.log('- Total Semesters:', Object.keys(pageData.allPDFs).length);
        
        // Store in localStorage
        try {
            localStorage.setItem('viewer_page_data', JSON.stringify(viewerData));
            console.log('✅ Data stored in localStorage successfully');
        } catch (error) {
            console.error('❌ Error storing data:', error);
            UI.showToast('Error preparing PDF viewer', 'error');
            return;
        }
        
        // Open viewer
        const encodedPath = encodeURIComponent(normalizedPath);
        const encodedName = encodeURIComponent(fileName || CONFIG.pdf.defaultFileName);
        const viewerUrl = `${CONFIG.pdf.viewerUrl}?file=${encodedPath}&title=${encodedName}&type=${pdfType}&semester=${currentSemester}`;
        
        console.log('🚀 Opening viewer:', viewerUrl);
        
        // Use window.location for single-page navigation (better for GitHub Pages)
        window.location.href = viewerUrl;
        
        UI.showToast(`Opening ${fileName}...`, 'info');
        this.trackPDFView(fileName, normalizedPath);
    }
    
    static detectTypeFromPath(pdfPath) {
        if (!pdfPath) return 'notes';
        
        const path = pdfPath.toLowerCase();
        
        if (path.includes('files/notes/')) return 'notes';
        if (path.includes('files/syllabus/')) return 'syllabus';
        if (path.includes('files/old is gold/') || path.includes('files/old_is_gold/')) return 'oldisgold';
        if (path.includes('files/recentpaper/')) return 'recentpaper';
        if (path.includes('files/internal_paper/') || path.includes('files/internalpaper/')) return 'internalpaper';
        
        return 'notes';
    }
    
    static openEmbedded(pdfPath, fileName) {
        if (!pdfPath) {
            UI.showToast('PDF file not found', 'error');
            return;
        }
        
        // Normalize path
        const normalizedPath = PathUtil.normalizePath(pdfPath);
        
        const modal = document.getElementById('pdfViewerModal');
        const iframe = document.getElementById('pdfViewerIframe');
        
        if (!modal || !iframe) {
            this.openViewer(normalizedPath, fileName);
            return;
        }
        
        this.currentPDF = { path: normalizedPath, name: fileName };
        
        document.getElementById('pdfTitle').textContent = fileName || 'PDF Document';
        document.getElementById('pdfLoading').style.display = 'flex';
        iframe.style.display = 'none';
        iframe.src = normalizedPath;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        iframe.onload = () => {
            document.getElementById('pdfLoading').style.display = 'none';
            iframe.style.display = 'block';
            this.setupModalControls(normalizedPath, fileName);
        };
        
        iframe.onerror = () => {
            document.getElementById('pdfLoading').style.display = 'none';
            UI.showToast('Failed to load PDF', 'error');
            this.closeViewer();
        };
        
        UI.showToast(`Loading ${fileName}...`, 'info');
        this.trackPDFView(fileName, normalizedPath);
    }
    
    static closeViewer() {
        const modal = document.getElementById('pdfViewerModal');
        const iframe = document.getElementById('pdfViewerIframe');
        
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (iframe) iframe.src = '';
        this.currentPDF = null;
    }
    
    static setupModalControls(pdfPath, fileName) {
        const iframe = document.getElementById('pdfViewerIframe');
        const downloadBtn = document.getElementById('downloadPdfBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const closeBtn = document.querySelector('.close-pdf-modal');
        
        if (downloadBtn) {
            downloadBtn.onclick = () => this.download(pdfPath, fileName);
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.onclick = () => {
                if (iframe.requestFullscreen) iframe.requestFullscreen();
                else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
                else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
                else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
            };
        }
        
        if (closeBtn) closeBtn.onclick = () => this.closeViewer();
        
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                // Handle fullscreen exit if needed
            }
        });
    }
    
    static download(pdfPath, fileName) {
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = fileName || CONFIG.pdf.defaultFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        UI.showToast(`Downloading ${fileName}...`, 'success');
        this.trackPDFDownload(fileName, pdfPath);
    }
    
    static trackPDFView(fileName, filePath) {
        console.log(`PDF Viewed: ${fileName} (${filePath})`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pdf_view', {
                'event_category': 'engagement',
                'event_label': fileName,
                'value': 1
            });
        }
    }
    
    static trackPDFDownload(fileName, filePath) {
        console.log(`PDF Downloaded: ${fileName} (${filePath})`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pdf_download', {
                'event_category': 'engagement',
                'event_label': fileName,
                'value': 1
            });
        }
    }
}

// ========== UI UTILITIES ==========
class UI {
    static showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${this.getToastColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            font-weight: 500;
        `;
        
        toast.innerHTML = `
            <i class="fas ${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    static getToastColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }
    
    static getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    static initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }
    
    static initializeActiveNavigation() {
        const currentPagePath = window.location.pathname.split('/').pop();
        
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (currentPagePath === '' && linkHref === 'index.html') {
                link.classList.add('active');
            } else if (linkHref === currentPagePath) {
                link.classList.add('active');
            } else if (currentPagePath === '' && linkHref === '#home') {
                link.classList.add('active');
            }
        });
        
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.semester-section');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.semester-nav a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
    
    static adjustForMobile() {
        const isMobile = window.innerWidth < 768;
        
        document.querySelectorAll('.notes-table th:nth-child(2), .notes-table td:nth-child(2)').forEach(el => {
            el.style.display = isMobile ? 'none' : '';
        });
    }
    
    static initializeDownloadTracking() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const fileName = this.getAttribute('download') || 'file.pdf';
                UI.showToast(`Downloading ${fileName}...`, 'info');
            });
        });
    }
    
    static fixAllPDFPaths() {
        // Fix all onclick handlers in the document
        document.querySelectorAll('[onclick*="openPDFViewer"]').forEach(element => {
            const onclick = element.getAttribute('onclick');
            if (onclick) {
                // Replace paths with normalized paths
                const fixedOnclick = onclick.replace(
                    /openPDFViewer\('([^']+)',\s*'([^']+)'\)/g,
                    (match, path, title) => {
                        const normalizedPath = PathUtil.normalizePath(path);
                        return `openPDFViewer('${normalizedPath}', '${title}')`;
                    }
                );
                element.setAttribute('onclick', fixedOnclick);
            }
        });
    }
}

// ========== NAVIGATION MANAGER ==========
class NavigationManager {
    static init() {
        this.setupHashLinks();
        this.setupSectionLinks();
        this.setupScrollTracking();
        this.highlightCurrentPage();
    }
    
    static setupHashLinks() {
        document.querySelectorAll('nav a[href^="#"], .footer a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            });
        });
    }
    
    static setupSectionLinks() {
        document.querySelectorAll('nav a[href*="#"], .footer a[href*="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.includes('index.html#')) {
                    e.preventDefault();
                    
                    const targetId = '#' + href.split('#')[1];
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                        
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                }
            });
        });
    }
    
    static setupScrollTracking() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    document.querySelector(`nav a[href="#${sectionId}"], nav a[href="index.html#${sectionId}"]`)?.classList.add('active');
                }
            });
        });
    }
    
    static highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'index.html' || currentPage === '') {
            document.querySelector('nav a[href="index.html"], nav a[href="index.html#home"]')?.classList.add('active');
        } else if (currentPage === 'becomputer.html') {
            document.querySelector('nav a[href="becomputer.html"]')?.classList.add('active');
        } else if (currentPage === 'syllabus.html') {
            document.querySelector('nav a[href="syllabus.html"]')?.classList.add('active');
        } else if (currentPage === 'oldisgold.html') {
            document.querySelector('nav a[href="oldisgold.html"]')?.classList.add('active');
        } else if (currentPage === 'internalpaper.html') {
            document.querySelector('nav a[href="internalpaper.html"]')?.classList.add('active');
        }
    }
}

// ========== KNOWLEDGE WAVE TRANSITION ==========
class KnowledgeWaveTransition {
    static init() {
        this.createTransition();
        this.setupNavigation();
    }
    
    static createTransition() {
        this.container = document.createElement('div');
        this.container.id = 'knowledge-wave-transition';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            overflow: hidden;
        `;
        
        this.wave = document.createElement('div');
        this.wave.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
                rgba(26, 27, 48, 0.98) 0%,
                rgba(26, 27, 48, 0.9) 30%,
                rgba(203, 85, 34, 0.7) 70%,
                rgba(203, 85, 34, 0.5) 100%);
            clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
            transform: translateX(-100%);
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform;
        `;
        
        const lines = document.createElement('div');
        lines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 24px,
                rgba(255, 255, 255, 0.05) 24px,
                rgba(255, 255, 255, 0.05) 25px
            );
            opacity: 0.3;
        `;
        
        const emblem = document.createElement('div');
        emblem.style.cssText = `
            position: absolute;
            top: 50%;
            left: 20%;
            transform: translate(-50%, -30%);
            width: 80px;
            height: 80px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(26, 27, 48, 0.3);
        `;
        
        const emblemIcon = document.createElement('div');
        emblemIcon.innerHTML = '📚';
        emblemIcon.style.cssText = 'font-size: 60px; opacity: 2;';
        
        emblem.appendChild(emblemIcon);
        this.wave.appendChild(lines);
        this.wave.appendChild(emblem);
        this.container.appendChild(this.wave);
        document.body.appendChild(this.container);
    }
    
    static setupNavigation() {
        document.querySelectorAll('nav a[href], .footer a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    const currentPage = window.location.pathname.split('/').pop();
                    if (href !== currentPage) {
                        e.preventDefault();
                        
                        link.style.transform = 'rotateY(13deg)';
                        link.style.transition = 'transform 0.9s ease';
                        
                        setTimeout(() => {
                            link.style.transform = '';
                        }, 300);
                        
                        this.startWaveTransition(() => {
                            window.location.href = href;
                        });
                    }
                });
            }
        });
    }
    
    static startWaveTransition(callback) {
        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
        this.container.style.pointerEvents = 'auto';
        
        setTimeout(() => {
            this.wave.style.transform = 'translateX(100%)';
        }, 10);
        
        document.querySelector('main').style.transition = 'transform 0.8s ease, opacity 0.5s ease';
        document.querySelector('main').style.transform = 'perspective(1000px) rotateY(-10deg)';
        document.querySelector('main').style.opacity = '0.9';
        
        setTimeout(() => {
            callback();
        }, 800);
    }
    
    static endWaveTransition() {
        this.wave.style.transform = 'translateX(-100%)';
        
        if (document.querySelector('main')) {
            document.querySelector('main').style.transform = '';
            document.querySelector('main').style.opacity = '';
        }
        
        setTimeout(() => {
            this.container.style.opacity = '0';
            this.container.style.visibility = 'hidden';
            this.container.style.pointerEvents = 'none';
        }, 800);
    }
}

// ========== MAIN INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // FIX PDF PATHS FIRST (Important!)
    AutoPathFixer.fixAllOnClickHandlers();
    
    // Initialize beautiful animations
    if (document.getElementById('dotsContainer')) {
        new AnimatedDots('dotsContainer');
    }
    
    if (document.getElementById('fingerprintContainer')) {
        new FingerprintGenerator('fingerprintContainer');
    }
    
    // Initialize PDF type filtering
    if (document.querySelector('.sidebar')) {
        new PDFTypeFilter();
    }
    
    // Initialize navigation
    NavigationManager.init();
    UI.initializeSmoothScrolling();
    UI.initializeActiveNavigation();
    UI.initializeDownloadTracking();
    
    // Fix all PDF paths for GitHub Pages compatibility
    UI.fixAllPDFPaths();
    
    // Setup PDF modal events
    const pdfModal = document.getElementById('pdfViewerModal');
    const closePdfBtn = document.querySelector('.close-pdf-modal');
    
    if (closePdfBtn) {
        closePdfBtn.addEventListener('click', PDFViewerModule.closeViewer);
    }
    
    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                PDFViewerModule.closeViewer();
            }
        });
    }
    
    // Setup keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal && pdfModal.style.display === 'block') {
            PDFViewerModule.closeViewer();
        }
    });
    
    // Initialize mobile adjustments
    UI.adjustForMobile();
    window.addEventListener('resize', UI.adjustForMobile);
    
    // Initialize knowledge wave transition
    KnowledgeWaveTransition.init();
    setTimeout(() => KnowledgeWaveTransition.endWaveTransition(), 100);
    
    // Log environment info
    console.log('🌍 Environment Info:');
    console.log('- Host:', window.location.host);
    console.log('- Protocol:', window.location.protocol);
    console.log('- Path:', window.location.pathname);
    console.log('- Is GitHub Pages:', GITHUB_CONFIG.isGitHubPages);
    console.log('- Base URL:', PathUtil.getBaseUrl());
    console.log('- Is Local Development:', PathUtil.isLocalDevelopment());
});

// ========== GLOBAL EXPORTS ==========
window.openPDFViewer = PDFViewerModule.openViewer;
window.openEmbeddedPDF = PDFViewerModule.openEmbedded;
window.closePDFViewer = PDFViewerModule.closeViewer;
window.showToast = UI.showToast;
window.PathUtil = PathUtil;
window.normalizePDFPath = PathUtil.normalizePath;

// Add toast animations
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%) translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%) translateY(-20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Test function to verify PDF URLs
function testPDFPaths() {
    console.log('🔍 Testing PDF paths...');
    console.log('GitHub Pages:', GITHUB_CONFIG.isGitHubPages);
    console.log('Base URL:', GITHUB_CONFIG.baseUrl);
    
    // Test a sample path
    const testPath = '/Files/notes/semester1/calculus_1.pdf';
    console.log('Sample Test:');
    console.log('  Input:', testPath);
    console.log('  Normalized:', PathUtil.normalizePath(testPath));
    
    // Test all buttons
    const buttons = document.querySelectorAll('[onclick*="openPDFViewer"]');
    console.log(`Found ${buttons.length} PDF buttons`);
    
    buttons.forEach((btn, index) => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/openPDFViewer\('([^']+)',\s*'([^']+)'\)/);
        if (match && index < 3) { // Test first 3 only
            const path = match[1];
            console.log(`Button ${index + 1}: ${path}`);
        }
    });
}

window.testPDFPaths = testPDFPaths;

// ========== DEBUG FUNCTION ==========
function debugPDFLoading() {
    console.log('🔍 DEBUG: Checking PDF setup...');
    console.log('1. Is GitHub Pages:', GITHUB_CONFIG.isGitHubPages);
    console.log('2. Base URL:', GITHUB_CONFIG.baseUrl);
    
    // Test a sample path
    const testPath = '/Files/notes/semester1/calculus_1.pdf';
    console.log('3. Sample path normalization:');
    console.log('   Input:', testPath);
    console.log('   Output:', PathUtil.normalizePath(testPath));
    
    // Check first PDF button
    const firstBtn = document.querySelector('[onclick*="openPDFViewer"]');
    if (firstBtn) {
        const onclick = firstBtn.getAttribute('onclick');
        console.log('4. First button onclick:', onclick);
        
        // Extract and test the path
        const match = onclick.match(/openPDFViewer\('([^']+)',\s*'([^']+)'\)/);
        if (match) {
            const path = match[1];
            console.log('   Extracted path:', path);
            console.log('   Normalized:', PathUtil.normalizePath(path));
            
            // Test if the URL exists
            const finalUrl = PathUtil.normalizePath(path);
            fetch(finalUrl, { method: 'HEAD' })
                .then(response => {
                    console.log(`✅ URL accessible: ${response.status} ${response.statusText}`);
                })
                .catch(error => {
                    console.log(`❌ URL not accessible: ${error.message}`);
                    console.log('   Try opening directly:', finalUrl);
                });
        }
    }
}

window.debugPDFLoading = debugPDFLoading;


// ========== RESPONSIVE NAVIGATION MENUBAR ==========
class ResponsiveNavbar {
    constructor() {
        this.nav = document.querySelector('nav');
        this.navLists = document.querySelectorAll('nav > ul');
        this.mobileMenuBtn = null;
        this.mobileMenu = null;
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.createMobileMenu();
        this.setupEventListeners();
        this.checkViewport();
    }
    
    createMobileMenu() {
        // Create mobile menu button
        this.mobileMenuBtn = document.createElement('div');
        this.mobileMenuBtn.className = 'mobile-menu-btn';
        this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Create mobile menu container
        this.mobileMenu = document.createElement('div');
        this.mobileMenu.className = 'mobile-menu';
        
        // Clone navigation links for mobile
        const mobileNavContent = document.createElement('div');
        mobileNavContent.className = 'mobile-nav-content';
        
        // Create logo and title for mobile
        const logoContainer = document.createElement('div');
        logoContainer.className = 'mobile-logo-container';
        const logoImg = this.nav.querySelector('.logo')?.cloneNode(true);
        const titleLink = this.nav.querySelector('.tittle')?.cloneNode(true);
        
        if (logoImg && titleLink) {
            logoContainer.appendChild(logoImg);
            logoContainer.appendChild(titleLink);
            mobileNavContent.appendChild(logoContainer);
        }
        
        // Add all navigation links
        this.navLists.forEach((navList, index) => {
            const mobileList = document.createElement('ul');
            mobileList.className = 'mobile-nav-list';
            
            // Add each link
            navList.querySelectorAll('li').forEach(li => {
                const clonedLi = li.cloneNode(true);
                mobileList.appendChild(clonedLi);
            });
            
            mobileNavContent.appendChild(mobileList);
            
            // Add divider between groups
            if (index < this.navLists.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'mobile-divider';
                mobileNavContent.appendChild(divider);
            }
        });
        
        this.mobileMenu.appendChild(mobileNavContent);
        
        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.mobileMenu.appendChild(closeBtn);
        
        // Add to body
        document.body.appendChild(this.mobileMenuBtn);
        document.body.appendChild(this.mobileMenu);
    }
    
    setupEventListeners() {
        // Mobile menu button click
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close button click
        this.mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => this.closeMobileMenu());
        
        // Close menu when clicking on links
        this.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu when clicking outside
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeMobileMenu();
            }
        });
        
        // Keyboard support (Escape key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.checkViewport();
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.mobileMenu.classList.add('active');
        this.mobileMenuBtn.classList.add('active');
        this.isMobileMenuOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = this.mobileMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
            item.classList.add('slide-in');
        });
    }
    
    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
        this.isMobileMenuOpen = false;
        document.body.style.overflow = '';
        
        // Reset animations
        const menuItems = this.mobileMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.classList.remove('slide-in');
        });
    }
    
    checkViewport() {
        if (window.innerWidth <= 768) {
            this.nav.style.display = 'none';
            this.mobileMenuBtn.style.display = 'flex';
        } else {
            this.nav.style.display = '';
            this.mobileMenuBtn.style.display = 'none';
            this.closeMobileMenu();
        }
    }
}

// ========== MAIN INITIALIZATION FOR NAVBAR ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive navbar
    new ResponsiveNavbar();
    
    // Add the CSS for mobile navbar
    addMobileNavbarStyles();
});

// ========== ADD MOBILE NAVBAR STYLES ==========
function addMobileNavbarStyles() {
    if (!document.querySelector('#mobile-navbar-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-navbar-styles';
        style.textContent = `
            /* Mobile Menu Button */
            .mobile-menu-btn {
                position: fixed;
                top: 15px;
                right: 15px;
                width: 50px;
                height: 50px;
                background: #cb5522;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                z-index: 1001;
                box-shadow: 0 4px 15px rgba(203, 85, 34, 0.3);
                transition: all 0.3s ease;
            }
            
            .mobile-menu-btn:hover {
                background: #ff6b35;
                transform: scale(1.1);
            }
            
            .mobile-menu-btn.active {
                background: #ff6b35;
            }
            
            /* Mobile Menu Overlay */
            .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(26, 27, 48, 0.98);
                backdrop-filter: blur(10px);
                z-index: 1002;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .mobile-menu.active {
                display: flex;
                flex-direction: column;
                opacity: 1;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Mobile Menu Content */
            .mobile-nav-content {
                flex: 1;
                overflow-y: auto;
                padding: 80px 20px 40px;
                display: flex;
                flex-direction: column;
                gap: 30px;
            }
            
            .mobile-logo-container {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(203, 85, 34, 0.3);
            }
            
            .mobile-logo-container img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #cb5522;
            }
            
            .mobile-logo-container .tittle {
                font-size: 1.4rem;
                color: white;
                text-decoration: none;
                font-weight: bold;
            }
            
            /* Mobile Navigation Lists */
            .mobile-nav-list {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .mobile-nav-list li {
                opacity: 0;
                transform: translateX(-20px);
            }
            
            .mobile-nav-list li.slide-in {
                animation: slideInLeft 0.3s ease forwards;
            }
            
            @keyframes slideInLeft {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .mobile-nav-list li a {
                display: block;
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: white;
                text-decoration: none;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .mobile-nav-list li a:hover,
            .mobile-nav-list li a.active {
                background: rgba(203, 85, 34, 0.2);
                border-color: #cb5522;
                transform: translateX(10px);
                color: #ff6b35;
            }
            
            /* Mobile Divider */
            .mobile-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 10px 0;
            }
            
            /* Mobile Close Button */
            .mobile-menu-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .mobile-menu-close:hover {
                background: #cb5522;
                transform: rotate(90deg);
            }
            
            /* Desktop Navbar Responsive Adjustments */
            @media (max-width: 768px) {
                nav {
                    display: none !important;
                }
                
                .mobile-menu-btn {
                    display: flex;
                }
            }
            
            /* Tablet Adjustments */
            @media (min-width: 769px) and (max-width: 992px) {
                nav {
                    padding: 0 10px;
                }
                
                nav ul {
                    gap: 15px;
                }
                
                .tittle {
                    font-size: 1.1rem;
                }
            }
            
            /* Smooth Scroll for Mobile */
            html {
                scroll-behavior: smooth;
            }
            
            /* Prevent body scroll when menu is open */
            body.no-scroll {
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}

// ========== ENHANCED NAVIGATION SCROLLING ==========
class EnhancedNavScrolling {
    constructor() {
        this.navLinks = document.querySelectorAll('nav a, .mobile-nav-list a');
        this.sections = document.querySelectorAll('section[id]');
        this.navHeight = 70;
        
        this.init();
    }
    
    init() {
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.highlightCurrentSection();
    }
    
    setupScrollSpy() {
        window.addEventListener('scroll', () => {
            this.highlightCurrentSection();
        });
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle internal links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = targetPosition - this.navHeight;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update URL hash
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }
                }
            });
        });
    }
    
    highlightCurrentSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + this.navHeight + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Highlight current section link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href && href.includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize enhanced navigation scrolling
document.addEventListener('DOMContentLoaded', function() {
    new EnhancedNavScrolling();
});