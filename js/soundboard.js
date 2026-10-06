/**
 * js/soundboard.js — Hệ thống Bàn Phím Sound 3D Instant & Truy Vết Vị Trí Nhạc
 * Nâng cấp: Nút 3D to rõ hơn, thanh Style tự bọc không bị khuất, chế độ xem 3D Pad & Thẻ Danh Sách
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
        selectedSound: null,
        viewMode: 'grid' // 'grid' hoặc 'list'
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
        // Reset all playing states
        document.querySelectorAll('.sb-btn').forEach(btn => btn.classList.remove('playing'));
        document.querySelectorAll('.sb-button-wrapper').forEach(w => w.classList.remove('is-playing'));
        document.querySelectorAll('.sb-item').forEach(item => item.classList.remove('is-active-item'));
        document.querySelectorAll('.sb-list-card').forEach(card => card.classList.remove('is-playing'));
        document.querySelectorAll('.sb-list-play-btn i').forEach(icon => {
            icon.className = 'fa-solid fa-play';
        });

        // Add to active grid item
        const btn = document.getElementById(`sb-btn-${sound.id}`);
        const wrapper = document.getElementById(`sb-wrapper-${sound.id}`);
        const item = document.getElementById(`sb-item-${sound.id}`);
        if (btn) btn.classList.add('playing');
        if (wrapper) wrapper.classList.add('is-playing');
        if (item) item.classList.add('is-active-item');

        // Add to active list card
        const listCard = document.getElementById(`sb-list-card-${sound.id}`);
        const listIcon = document.getElementById(`sb-list-icon-${sound.id}`);
        if (listCard) listCard.classList.add('is-playing');
        if (listIcon) listIcon.className = 'fa-solid fa-pause';

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
        document.querySelectorAll('.sb-item').forEach(item => item.classList.remove('is-active-item'));
        document.querySelectorAll('.sb-list-card').forEach(card => card.classList.remove('is-playing'));
        document.querySelectorAll('.sb-list-play-btn i').forEach(icon => {
            icon.className = 'fa-solid fa-play';
        });

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
        if (event) event.stopPropagation();
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
        const isFav = SoundboardState.favorites.has(id);
        // Grid button
        const heartBtn = document.getElementById(`sb-heart-${id}`);
        if (heartBtn) {
            if (isFav) {
                heartBtn.classList.add('favorited');
                heartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                heartBtn.classList.remove('favorited');
                heartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        }
        // List button
        const listHeartBtn = document.getElementById(`sb-list-heart-${id}`);
        if (listHeartBtn) {
            if (isFav) {
                listHeartBtn.classList.add('favorited');
                listHeartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                listHeartBtn.classList.remove('favorited');
                listHeartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
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

    // Copy track flag helper
    window.copySbTrackFlag = function(id) {
        const sound = SOUNDBOARD_DATA.find(s => s.id === id);
        if (sound && sound.flag) {
            copySbText(sound.flag, `🎬 Đã sao chép cờ: ${sound.flag}`);
        }
    };

    // Copy to clipboard utilities
    window.copySbText = function(elementIdOrText, successMsg) {
        const el = document.getElementById(elementIdOrText);
        const text = el ? (el.value || el.textContent) : elementIdOrText;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            showSbToast(successMsg || '📋 Đã sao chép thành công!');
        }).catch(() => {
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

        if (sound.link && sound.link.startsWith('http')) {
            window.open(sound.link, '_blank');
        } else {
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

        // Tự động cuộn tab đang chọn ra giữa thanh trượt menu ở dưới
        const activeBottomTab = document.querySelector(`#sbBottomSliderTrack .sb-cat-tab[data-cat="${catCode}"]`);
        if (activeBottomTab) {
            activeBottomTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        renderSoundboardGrid();
    };

    // Nút cuộn trượt trái / phải cho thanh menu ở dưới
    window.scrollSbBottomSlider = function(offset) {
        const track = document.getElementById('sbBottomSliderTrack');
        if (track) {
            track.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Search filter
    window.handleSbSearch = function(query) {
        SoundboardState.searchQuery = (query || '').trim().toLowerCase();
        renderSoundboardGrid();
    };

    // View Mode Switcher: 'grid' (3D Buttons) | 'list' (Detail Cards)
    window.setSbViewMode = function(mode) {
        SoundboardState.viewMode = mode;
        const btnGrid = document.getElementById('sbBtnViewGrid');
        const btnList = document.getElementById('sbBtnViewList');
        if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');
        if (btnList) btnList.classList.toggle('active', mode === 'list');
        renderSoundboardGrid();
    };

    function updateCategoryCountBadges() {
        const favCount = SoundboardState.favorites.size;
        const favBadge = document.getElementById('sbFavCountBadge');
        if (favBadge) favBadge.textContent = favCount;
        const bFavBadge = document.getElementById('sbBottomFavCountBadge');
        if (bFavBadge) bFavBadge.textContent = favCount;

        const totalEl = document.getElementById('sbTotalCountBadge');
        if (totalEl && Array.isArray(SOUNDBOARD_DATA)) totalEl.textContent = SOUNDBOARD_DATA.length;
        const bTotalEl = document.getElementById('sbBottomTotalCountBadge');
        if (bTotalEl && Array.isArray(SOUNDBOARD_DATA)) bTotalEl.textContent = SOUNDBOARD_DATA.length;

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

    // Render Grid or List
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
            container.className = 'w-full py-16 text-center text-gray-400';
            container.innerHTML = `
                <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/80 flex items-center justify-center text-2xl text-gray-500">
                    <i class="fa-solid fa-music-slash"></i>
                </div>
                <p class="font-bold text-gray-300">Không tìm thấy sound nào phù hợp</p>
                <p class="text-xs text-gray-500 mt-1">Hãy thử tìm từ khoá khác hoặc đổi chuyên mục</p>
            `;
            return;
        }

        // ==========================================
        // CHẾ ĐỘ 1: BÀN PHÍM NÚT 3D (MYINSTANTS PAD)
        // ==========================================
        if (SoundboardState.viewMode === 'grid') {
            container.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-2';
            let html = '';
            filtered.forEach(sound => {
                const isFav = SoundboardState.favorites.has(sound.id);
                const isPlaying = SoundboardState.currentPlayingId === sound.id;
                const colorClass = sound.color || 'red';

                html += `
                    <div class="sb-item ${isPlaying ? 'is-active-item' : ''}" id="sb-item-${sound.id}">
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
                                    title="Truy vết vị trí file MP3 & lấy cờ --nhac">
                                <i class="fa-solid fa-link"></i>
                            </button>

                            <!-- MỞ TIKTOK / SHARE -->
                            <button class="sb-act-btn sb-act-share" 
                                    onclick="openSbTikTok(event, '${sound.id}')"
                                    title="Mở video TikTok gốc">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        } 
        // ==========================================
        // CHẾ ĐỘ 2: THẺ DANH SÁCH CHI TIẾT (LIST CARDS)
        // ==========================================
        else {
            container.className = 'grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2';
            let html = '';
            filtered.forEach(sound => {
                const isFav = SoundboardState.favorites.has(sound.id);
                const isPlaying = SoundboardState.currentPlayingId === sound.id;
                const colorClass = sound.color || 'blue';
                const durStr = sound.duration ? `${Math.round(sound.duration)}s` : '';

                html += `
                    <div class="sb-list-card ${isPlaying ? 'is-playing' : ''}" id="sb-list-card-${sound.id}">
                        <!-- Nút Play Tròn To -->
                        <div class="sb-button-wrapper !w-12 !h-12 !p-1.5 flex-shrink-0" onclick="togglePlaySound('${sound.id}')">
                            <button class="sb-btn ${colorClass} ${isPlaying ? 'playing' : ''} flex items-center justify-center text-white text-xs">
                                <i id="sb-list-icon-${sound.id}" class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                        </div>

                        <!-- Thông tin Sound -->
                        <div class="flex-1 min-w-0 pr-2">
                            <div class="text-xs font-bold text-white truncate cursor-pointer hover:text-cyan-400" 
                                 onclick="openSbLocationModal(null, '${sound.id}')"
                                 title="${sound.title}">
                                ${sound.title}
                            </div>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-[10px] font-semibold text-slate-400 truncate max-w-[140px]">
                                    <i class="fa-solid fa-user-tag text-[9px] mr-0.5"></i> ${sound.author || 'TikTok'}
                                </span>
                                <span class="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                                    ${durStr || sound.catName}
                                </span>
                            </div>
                        </div>

                        <!-- Nút Thao tác -->
                        <div class="flex items-center gap-1.5 flex-shrink-0">
                            <!-- Sao chép cờ --nhac -->
                            <button onclick="copySbText('${sound.flag.replace(/"/g, '&quot;')}', '🎬 Đã sao chép cờ --nhac!')" 
                                    class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center text-xs transition border border-slate-700" 
                                    title="Sao chép cờ: ${sound.flag}">
                                <i class="fa-solid fa-terminal text-[10px]"></i>
                            </button>

                            <!-- Thả tim -->
                            <button class="sb-act-btn sb-act-heart ${isFav ? 'favorited' : ''}" 
                                    id="sb-list-heart-${sound.id}"
                                    onclick="toggleSbFavorite(event, '${sound.id}')"
                                    title="${isFav ? 'Bỏ thích' : 'Thả tim'}">
                                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            </button>

                            <!-- Truy vết -->
                            <button class="sb-act-btn sb-act-link" 
                                    onclick="openSbLocationModal(event, '${sound.id}')"
                                    title="Truy vết folder & đường dẫn">
                                <i class="fa-solid fa-link"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    }

    // Volume control
    window.setSbVolume = function(val) {
        SoundboardState.volume = parseFloat(val);
        if (SoundboardState.currentAudio) {
            SoundboardState.currentAudio.volume = SoundboardState.volume;
        }
    };

    window.renderSoundboardGrid = renderSoundboardGrid;

    // Điều khiển hiển thị và tương tác thanh trượt menu ở dưới
    window.updateSbBottomBarVisibility = function(show) {
        const bottomBar = document.getElementById('sbBottomStyleBar');
        if (bottomBar) {
            bottomBar.classList.toggle('hidden', !show);
        }
    };

    function initBottomSliderUI() {
        const track = document.getElementById('sbBottomSliderTrack');
        if (track && !track._hasInitSliderEvents) {
            track._hasInitSliderEvents = true;

            // Lăn chuột ngang để trượt style nhanh
            track.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    track.scrollLeft += e.deltaY * 0.9;
                }
            }, { passive: false });

            // Kéo chuột trượt (drag-to-scroll) trên máy tính
            let isDown = false;
            let startX, scrollLeft;
            track.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
            });
            window.addEventListener('mouseup', () => { isDown = false; });
            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 1.5;
                track.scrollLeft = scrollLeft - walk;
            });
        }

        // Tự động kiểm tra hiển thị theo màn viewSoundboard
        const sbView = document.getElementById('viewSoundboard');
        const bottomBar = document.getElementById('sbBottomStyleBar');
        if (sbView && bottomBar && !sbView._hasObserver) {
            sbView._hasObserver = true;
            const updateVisibility = () => {
                const isActive = !sbView.classList.contains('hidden') && sbView.classList.contains('active');
                bottomBar.classList.toggle('hidden', !isActive);
            };
            const obs = new MutationObserver(updateVisibility);
            obs.observe(sbView, { attributes: true, attributeFilter: ['class'] });
            updateVisibility();
        }
    }

    // Init on DOM ready
    function initSoundboard() {
        loadFavorites();
        updateCategoryCountBadges();
        renderSoundboardGrid();
        initBottomSliderUI();

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
