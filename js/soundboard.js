/**
 * js/soundboard.js — Hệ thống Bàn Phím Sound 3D Instant & Truy Vết Vị Trí Nhạc
 * Phong cách Myinstants với nút bấm 3D bóng bẩy, nghe thử trực tiếp, thả tim và truy vết folder
 */

(function() {
    // State
    const SoundboardState = {
        currentAudio: null,
        currentPlayingId: null,
        favorites: new Set(),
        activeCategory: 'ALL',
        searchQuery: '',
        volume: 0.85,
        selectedSound: null
    };

    // Load favorites from localStorage
    function loadFavorites() {
        try {
            const raw = localStorage.getItem('soundboard_favorites_11a11');
            if (raw) {
                SoundboardState.favorites = new Set(JSON.parse(raw));
            }
        } catch (e) {
            console.error('Lỗi load favorites:', e);
        }
    }

    // Save favorites to localStorage
    function saveFavorites() {
        try {
            localStorage.setItem('soundboard_favorites_11a11', JSON.stringify([...SoundboardState.favorites]));
        } catch (e) {
            console.error('Lỗi save favorites:', e);
        }
    }

    // Init Audio Engine
    function initAudio() {
        if (!SoundboardState.currentAudio) {
            SoundboardState.currentAudio = new Audio();
            SoundboardState.currentAudio.volume = SoundboardState.volume;

            SoundboardState.currentAudio.addEventListener('ended', () => {
                stopPlayingUI();
            });

            SoundboardState.currentAudio.addEventListener('timeupdate', () => {
                updatePlayerProgress();
            });

            SoundboardState.currentAudio.addEventListener('error', (e) => {
                console.warn('Audio playback error:', e);
                showSbToast('⚠️ Không thể phát file âm thanh này.');
                stopPlayingUI();
            });
        }
    }

    // Toggle Play / Pause Sound
    window.togglePlaySound = function(id) {
        initAudio();
        const sound = SOUNDBOARD_DATA.find(s => s.id === id);
        if (!sound) return;

        if (SoundboardState.currentPlayingId === id && !SoundboardState.currentAudio.paused) {
            SoundboardState.currentAudio.pause();
            stopPlayingUI();
            return;
        }

        // New sound or resume
        SoundboardState.currentPlayingId = id;
        SoundboardState.currentAudio.src = sound.relPath;
        SoundboardState.currentAudio.currentTime = 0;
        
        const playPromise = SoundboardState.currentAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updatePlayingUI(sound);
            }).catch(err => {
                console.warn('Lỗi autoplay hoặc đường dẫn:', err);
                // Thử fallback sang absPath nếu cần
                SoundboardState.currentAudio.src = sound.relPath;
            });
        }
    };

    // Stop Playing
    window.stopSoundboardAudio = function() {
        if (SoundboardState.currentAudio) {
            SoundboardState.currentAudio.pause();
            SoundboardState.currentAudio.currentTime = 0;
        }
        stopPlayingUI();
    };

    function updatePlayingUI(sound) {
        // Remove active class from all buttons
        document.querySelectorAll('.sb-btn').forEach(btn => btn.classList.remove('playing'));
        document.querySelectorAll('.sb-button-wrapper').forEach(w => w.classList.remove('is-playing'));

        // Add to active
        const btn = document.getElementById(`sb-btn-${sound.id}`);
        const wrapper = document.getElementById(`sb-wrapper-${sound.id}`);
        if (btn) btn.classList.add('playing');
        if (wrapper) wrapper.classList.add('is-playing');

        // Update floating player
        const player = document.getElementById('sbFloatingPlayer');
        if (player) {
            player.classList.remove('hidden');
            const titleEl = document.getElementById('sbPlayerTitle');
            const catEl = document.getElementById('sbPlayerCategory');
            const playBtn = document.getElementById('sbPlayerPlayIcon');
            if (titleEl) titleEl.textContent = sound.title;
            if (catEl) catEl.textContent = sound.catName;
            if (playBtn) playBtn.className = 'fa-solid fa-pause';
        }
    }

    function stopPlayingUI() {
        SoundboardState.currentPlayingId = null;
        document.querySelectorAll('.sb-btn').forEach(btn => btn.classList.remove('playing'));
        document.querySelectorAll('.sb-button-wrapper').forEach(w => w.classList.remove('is-playing'));

        const playBtn = document.getElementById('sbPlayerPlayIcon');
        if (playBtn) playBtn.className = 'fa-solid fa-play';

        const prog = document.getElementById('sbPlayerProgressBar');
        if (prog) prog.style.width = '0%';
    }

    function updatePlayerProgress() {
        if (!SoundboardState.currentAudio) return;
        const dur = SoundboardState.currentAudio.duration || 1;
        const cur = SoundboardState.currentAudio.currentTime || 0;
        const pct = Math.min(100, (cur / dur) * 100);

        const prog = document.getElementById('sbPlayerProgressBar');
        const timeEl = document.getElementById('sbPlayerTime');
        if (prog) prog.style.width = `${pct}%`;
        if (timeEl) {
            const curM = Math.floor(cur / 60);
            const curS = Math.floor(cur % 60).toString().padStart(2, '0');
            const durM = Math.floor(dur / 60);
            const durS = Math.floor(dur % 60).toString().padStart(2, '0');
            timeEl.textContent = `${curM}:${curS} / ${durM}:${durS}`;
        }
    }

    // Toggle Favorite
    window.toggleSbFavorite = function(event, id) {
        event.stopPropagation();
        if (SoundboardState.favorites.has(id)) {
            SoundboardState.favorites.delete(id);
            showSbToast('💔 Đã bỏ khỏi danh sách Yêu Thích');
        } else {
            SoundboardState.favorites.add(id);
            showSbToast('❤️ Đã lưu vào danh sách Yêu Thích!');
        }
        saveFavorites();
        updateFavoriteButtonUI(id);
        updateCategoryCountBadges();
        
        // If current filter is FAVORITES, re-render
        if (SoundboardState.activeCategory === 'FAVORITES') {
            renderSoundboardGrid();
        }
    };

    function updateFavoriteButtonUI(id) {
        const heartBtn = document.getElementById(`sb-heart-${id}`);
        if (heartBtn) {
            if (SoundboardState.favorites.has(id)) {
                heartBtn.classList.add('favorited');
                heartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                heartBtn.classList.remove('favorited');
                heartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        }
    }

    // Modal: Truy Vết Vị Trí Sound Trong Máy
    window.openSbLocationModal = function(event, id) {
        if (event) event.stopPropagation();
        const sound = SOUNDBOARD_DATA.find(s => s.id === id);
        if (!sound) return;
        SoundboardState.selectedSound = sound;

        const modal = document.getElementById('sbLocationModal');
        if (!modal) return;

        document.getElementById('sbModalTitle').textContent = sound.title;
        document.getElementById('sbModalCategory').textContent = sound.catName;
        document.getElementById('sbModalFolder').textContent = sound.folder;
        document.getElementById('sbModalAbsPath').value = sound.absPath;
        document.getElementById('sbModalCommandFlag').value = sound.flag;
        document.getElementById('sbModalDuration').textContent = sound.duration ? `${Math.round(sound.duration)}s` : '--';
        document.getElementById('sbModalAuthor').textContent = sound.author || 'TikTok';

        const tiktokBtn = document.getElementById('sbModalTiktokLink');
        if (tiktokBtn) {
            if (sound.link) {
                tiktokBtn.href = sound.link;
                tiktokBtn.classList.remove('hidden');
            } else {
                tiktokBtn.classList.add('hidden');
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closeSbLocationModal = function() {
        const modal = document.getElementById('sbLocationModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    // Copy to clipboard utilities
    window.copySbText = function(elementId, successMsg) {
        const el = document.getElementById(elementId);
        const text = el ? (el.value || el.textContent) : elementId;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            showSbToast(successMsg || '📋 Đã sao chép thành công!');
        }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showSbToast(successMsg || '📋 Đã sao chép!');
        });
    };

    // Share / Open TikTok
    window.openSbTikTok = function(event, id) {
        if (event) event.stopPropagation();
        const sound = SOUNDBOARD_DATA.find(s => s.id === id);
        if (!sound) return;

        if (sound.link) {
            window.open(sound.link, '_blank');
        } else {
            // Nếu không có link TikTok thì mở modal vị trí file
            window.openSbLocationModal(null, id);
        }
    };

    // Toast notification
    function showSbToast(msg) {
        let toast = document.getElementById('sbToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sbToast';
            toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-gray-900/95 text-white text-xs font-bold rounded-full shadow-2xl backdrop-blur-md border border-white/20 transition-all pointer-events-none transform scale-95 opacity-0';
            document.body.appendChild(toast);
        }
        toast.innerHTML = msg;
        toast.classList.remove('scale-95', 'opacity-0');
        toast.classList.add('scale-100', 'opacity-100');

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('scale-100', 'opacity-100');
            toast.classList.add('scale-95', 'opacity-0');
        }, 2200);
    }

    // Filter by Category
    window.filterSbCategory = function(catCode) {
        SoundboardState.activeCategory = catCode;
        document.querySelectorAll('.sb-cat-tab').forEach(tab => {
            if (tab.dataset.cat === catCode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        renderSoundboardGrid();
    };

    // Search filter
    window.handleSbSearch = function(query) {
        SoundboardState.searchQuery = (query || '').trim().toLowerCase();
        renderSoundboardGrid();
    };

    function updateCategoryCountBadges() {
        const favCount = SoundboardState.favorites.size;
        const favBadge = document.getElementById('sbFavCountBadge');
        if (favBadge) favBadge.textContent = favCount;

        const totalEl = document.getElementById('sbTotalCountBadge');
        if (totalEl && Array.isArray(SOUNDBOARD_DATA)) totalEl.textContent = SOUNDBOARD_DATA.length;

        if (Array.isArray(SOUNDBOARD_DATA)) {
            const counts = {};
            SOUNDBOARD_DATA.forEach(s => {
                counts[s.category] = (counts[s.category] || 0) + 1;
            });
            document.querySelectorAll('.sb-cat-tab').forEach(tab => {
                const cat = tab.dataset.cat;
                if (cat && cat !== 'ALL' && cat !== 'FAVORITES') {
                    const numSpan = tab.querySelector('.sb-cat-num');
                    if (numSpan && counts[cat] !== undefined) {
                        numSpan.textContent = counts[cat];
                    }
                }
            });
        }
    }

    // Render Grid
    function renderSoundboardGrid() {
        const container = document.getElementById('sbGridContainer');
        if (!container) return;

        let filtered = SOUNDBOARD_DATA.filter(sound => {
            // Category filter
            if (SoundboardState.activeCategory === 'FAVORITES') {
                if (!SoundboardState.favorites.has(sound.id)) return false;
            } else if (SoundboardState.activeCategory !== 'ALL') {
                if (sound.category !== SoundboardState.activeCategory) return false;
            }

            // Search query filter
            if (SoundboardState.searchQuery) {
                const searchStr = `${sound.title} ${sound.catName} ${sound.author} ${sound.folder}`.toLowerCase();
                if (!searchStr.includes(SoundboardState.searchQuery)) return false;
            }

            return true;
        });

        // Count display
        const countDisplay = document.getElementById('sbFilterResultCount');
        if (countDisplay) {
            countDisplay.textContent = `Hiển thị ${filtered.length} / ${SOUNDBOARD_DATA.length} sound`;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-16 text-center text-gray-400">
                    <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/80 flex items-center justify-center text-2xl text-gray-500">
                        <i class="fa-solid fa-music-slash"></i>
                    </div>
                    <p class="font-bold text-gray-300">Không tìm thấy sound nào phù hợp</p>
                    <p class="text-xs text-gray-500 mt-1">Hãy thử tìm từ khoá khác hoặc đổi chuyên mục</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(sound => {
            const isFav = SoundboardState.favorites.has(sound.id);
            const isPlaying = SoundboardState.currentPlayingId === sound.id;
            const colorClass = sound.color || 'red';

            html += `
                <div class="sb-item" id="sb-item-${sound.id}">
                    <!-- 3D PUSH BUTTON (MYINSTANTS STYLE) -->
                    <div class="sb-button-wrapper ${isPlaying ? 'is-playing' : ''}" 
                         id="sb-wrapper-${sound.id}"
                         onclick="togglePlaySound('${sound.id}')"
                         title="Nhấp để nghe thử: ${sound.title}">
                        <button class="sb-btn ${colorClass} ${isPlaying ? 'playing' : ''}" 
                                id="sb-btn-${sound.id}">
                        </button>
                    </div>

                    <!-- SOUND TITLE -->
                    <div class="sb-title" 
                         onclick="openSbLocationModal(null, '${sound.id}')"
                         title="${sound.title} (${sound.catName})">
                        ${sound.title}
                    </div>

                    <!-- ACTION BUTTONS: [❤️] [🔗] [↗️] -->
                    <div class="sb-actions">
                        <!-- THẢ TIM -->
                        <button class="sb-act-btn sb-act-heart ${isFav ? 'favorited' : ''}" 
                                id="sb-heart-${sound.id}"
                                onclick="toggleSbFavorite(event, '${sound.id}')"
                                title="${isFav ? 'Bỏ thích' : 'Thả tim để lưu vào Yêu Thích'}">
                            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>

                        <!-- TRUY VẾT LINK / FOLDER -->
                        <button class="sb-act-btn sb-act-link" 
                                onclick="openSbLocationModal(event, '${sound.id}')"
                                title="Truy vết vị trí nhạc trong folder máy & lấy lệnh --nhac">
                            <i class="fa-solid fa-link"></i>
                        </button>

                        <!-- MỞ TIKTOK / SHARE -->
                        <button class="sb-act-btn sb-act-share" 
                                onclick="openSbTikTok(event, '${sound.id}')"
                                title="Mở video TikTok gốc chứa sound này">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Volume control
    window.setSbVolume = function(val) {
        SoundboardState.volume = parseFloat(val);
        if (SoundboardState.currentAudio) {
            SoundboardState.currentAudio.volume = SoundboardState.volume;
        }
    };

    window.renderSoundboardGrid = renderSoundboardGrid;

    // Init on DOM ready
    function initSoundboard() {
        loadFavorites();
        updateCategoryCountBadges();
        renderSoundboardGrid();

        // Keyboard navigation (Space to pause/play, Escape to stop)
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space') {
                if (SoundboardState.currentPlayingId) {
                    e.preventDefault();
                    window.togglePlaySound(SoundboardState.currentPlayingId);
                }
            } else if (e.code === 'Escape') {
                window.stopSoundboardAudio();
                window.closeSbLocationModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSoundboard);
    } else {
        initSoundboard();
    }

})();
