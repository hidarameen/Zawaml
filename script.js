class FantasyMusicPlayer {
    constructor() {
        this.currentSong = null;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeated = false;
        this.volume = 0.5;
        this.currentPlaylist = [];
        this.allSongs = this.initializeSampleSongs();
        this.artists = this.initializeArtists();
        this.uploadedFiles = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadSection('home');
        this.populateSongs();
    }

    initializeElements() {
        // Audio elements
        this.audioPlayer = document.getElementById('audioPlayer');
        
        // Player controls
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Player info
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentArtist = document.getElementById('currentArtist');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.progress = document.getElementById('progress');
        this.progressBar = document.querySelector('.progress-bar');
        
        // Player options
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.playlistBtn = document.getElementById('playlistBtn');
        
        // Playlist panel
        this.playlistPanel = document.getElementById('playlistPanel');
        this.playlistSongs = document.getElementById('playlistSongs');
        this.closePlaylistBtn = document.getElementById('closePlaylistBtn');
        
        // Navigation
        this.navLinks = document.querySelectorAll('.nav a');
        this.sections = document.querySelectorAll('.section');
        
        // Upload elements
        this.uploadBox = document.getElementById('uploadBox');
        this.audioFileInput = document.getElementById('audioFileInput');
        this.uploadForm = document.getElementById('uploadForm');
        this.songInfoForm = document.getElementById('songInfoForm');
        this.uploadedFilesContainer = document.getElementById('uploadedFiles');
        
        // Artists elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.addArtistModal = document.getElementById('addArtistModal');
        this.addArtistForm = document.getElementById('addArtistForm');
        this.closeArtistModal = document.getElementById('closeArtistModal');
    }

    initializeSampleSongs() {
        return [
            {
                id: 1,
                title: "لما بدا يتثنى",
                artist: "فيروز",
                album: "الأسود يليق بك",
                duration: "4:32",
                plays: 1200000,
                dateAdded: new Date('2023-01-15'),
                audioUrl: null,
                isUploaded: false
            },
            {
                id: 2,
                title: "الف ليلة وليلة",
                artist: "أم كلثوم",
                album: "كلاسيكيات",
                duration: "6:45",
                plays: 2100000,
                dateAdded: new Date('2023-02-20'),
                audioUrl: null,
                isUploaded: false
            },
            {
                id: 3,
                title: "ليلة حب",
                artist: "محمد عبد الوهاب",
                album: "الموسيقار",
                duration: "5:18",
                plays: 950000,
                dateAdded: new Date('2023-03-10'),
                audioUrl: null,
                isUploaded: false
            },
            {
                id: 4,
                title: "زهرة المدائن",
                artist: "فيروز",
                album: "فلسطين في القلب",
                duration: "3:56",
                plays: 1800000,
                dateAdded: new Date('2023-04-05'),
                audioUrl: null,
                isUploaded: false
            },
            {
                id: 5,
                title: "أنت عمري",
                artist: "أم كلثوم",
                album: "خالدة",
                duration: "7:22",
                plays: 2500000,
                dateAdded: new Date('2023-05-12'),
                audioUrl: null,
                isUploaded: false
            }
        ];
    }

    initializeArtists() {
        return {
            'fairuz': {
                name: 'فيروز',
                bio: 'أيقونة الموسيقى العربية',
                songs: this.allSongs.filter(song => song.artist === 'فيروز')
            },
            'umm-kulthum': {
                name: 'أم كلثوم',
                bio: 'كوكب الشرق',
                songs: this.allSongs.filter(song => song.artist === 'أم كلثوم')
            },
            'mohammed-abdel-wahab': {
                name: 'محمد عبد الوهاب',
                bio: 'موسيقار الأجيال',
                songs: this.allSongs.filter(song => song.artist === 'محمد عبد الوهاب')
            }
        };
    }

    bindEvents() {
        // Navigation events
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.loadSection(section);
            });
        });

        // Player control events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());

        // Audio events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.handleSongEnd());

        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));

        // Player options events
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.playlistBtn.addEventListener('click', () => this.togglePlaylistPanel());
        this.closePlaylistBtn.addEventListener('click', () => this.togglePlaylistPanel());

        // Upload events
        this.uploadBox.addEventListener('click', () => this.audioFileInput.click());
        this.uploadBox.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadBox.addEventListener('drop', (e) => this.handleDrop(e));
        this.audioFileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.songInfoForm.addEventListener('submit', (e) => this.handleSongInfoSubmit(e));

        // Artist events
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });
        this.addArtistForm.addEventListener('submit', (e) => this.handleAddArtist(e));
        this.closeArtistModal.addEventListener('click', () => this.closeModal());

        // Set initial volume
        this.audioPlayer.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
    }

    loadSection(sectionName) {
        // Hide all sections
        this.sections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionName) {
                link.style.color = '#8A2BE2';
            } else {
                link.style.color = '';
            }
        });

        // Load section-specific content
        switch(sectionName) {
            case 'most-played':
                this.populateMostPlayed();
                break;
            case 'latest':
                this.populateLatest();
                break;
            case 'artists':
                this.populateArtists();
                break;
        }
    }

    populateSongs() {
        this.populateMostPlayed();
        this.populateLatest();
        this.updatePlaylist();
    }

    populateMostPlayed() {
        const mostPlayedSection = document.querySelector('#most-played .songs-list');
        const sortedSongs = [...this.allSongs].sort((a, b) => b.plays - a.plays);
        
        mostPlayedSection.innerHTML = '';
        sortedSongs.forEach((song, index) => {
            const songElement = this.createSongElement(song, index + 1);
            mostPlayedSection.appendChild(songElement);
        });
    }

    populateLatest() {
        const latestSection = document.querySelector('#latest .songs-list');
        const sortedSongs = [...this.allSongs].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        latestSection.innerHTML = '';
        sortedSongs.forEach((song, index) => {
            const songElement = this.createSongElement(song, index + 1);
            latestSection.appendChild(songElement);
        });
    }

    populateArtists() {
        const artistsGrid = document.querySelector('.artists-grid');
        artistsGrid.innerHTML = '';

        Object.values(this.artists).forEach(artist => {
            const artistElement = this.createArtistElement(artist);
            artistsGrid.appendChild(artistElement);
        });
    }

    createSongElement(song, number) {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <div class="song-number">${number}</div>
            <div class="song-cover">
                <i class="fas fa-music"></i>
            </div>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
            <div class="song-plays">${this.formatPlays(song.plays)}</div>
        `;

        songItem.addEventListener('click', () => this.playSong(song));
        return songItem;
    }

    createArtistElement(artist) {
        const artistCard = document.createElement('div');
        artistCard.className = 'artist-card';
        artistCard.innerHTML = `
            <div class="artist-image">
                <i class="fas fa-user-music"></i>
            </div>
            <h4>${artist.name}</h4>
            <p>${artist.bio}</p>
            <div class="artist-stats">
                <span><i class="fas fa-music"></i> ${artist.songs.length} أغنية</span>
                <span><i class="fas fa-play"></i> ${this.formatPlays(this.calculateTotalPlays(artist.songs))}</span>
            </div>
        `;

        artistCard.addEventListener('click', () => this.showArtistSongs(artist));
        return artistCard;
    }

    calculateTotalPlays(songs) {
        return songs.reduce((total, song) => total + song.plays, 0);
    }

    formatPlays(plays) {
        if (plays >= 1000000) {
            return (plays / 1000000).toFixed(1) + 'M';
        } else if (plays >= 1000) {
            return (plays / 1000).toFixed(0) + 'K';
        }
        return plays.toString();
    }

    showArtistSongs(artist) {
        this.currentPlaylist = artist.songs;
        this.updatePlaylist();
        this.togglePlaylistPanel();
    }

    playSong(song) {
        this.currentSong = song;
        this.currentIndex = this.allSongs.findIndex(s => s.id === song.id);
        this.currentPlaylist = this.allSongs;

        // Update player UI
        this.currentSongTitle.textContent = song.title;
        this.currentArtist.textContent = song.artist;

        // If song has audio URL (uploaded), play it
        if (song.audioUrl) {
            this.audioPlayer.src = song.audioUrl;
            this.audioPlayer.load();
            this.play();
        } else {
            // For demo songs without actual audio files
            this.simulatePlayback(song);
        }

        this.updatePlaylist();
        this.updatePlaylistHighlight();
    }

    simulatePlayback(song) {
        // Simulate playback for demo songs
        const durationParts = song.duration.split(':');
        const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        let currentSeconds = 0;
        this.simulationInterval = setInterval(() => {
            currentSeconds++;
            if (currentSeconds >= totalSeconds) {
                this.handleSongEnd();
                return;
            }
            
            const progress = (currentSeconds / totalSeconds) * 100;
            this.progress.style.width = progress + '%';
            this.currentTime.textContent = this.formatTime(currentSeconds);
        }, 1000);
        
        this.duration.textContent = song.duration;
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.currentSong) {
            if (this.currentSong.audioUrl) {
                this.audioPlayer.play();
            }
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    pause() {
        if (this.currentSong) {
            if (this.currentSong.audioUrl) {
                this.audioPlayer.pause();
            } else {
                clearInterval(this.simulationInterval);
            }
            this.isPlaying = false;
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    previousSong() {
        if (this.currentPlaylist.length === 0) return;
        
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.currentPlaylist.length - 1;
        this.playSong(this.currentPlaylist[this.currentIndex]);
    }

    nextSong() {
        if (this.currentPlaylist.length === 0) return;
        
        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            this.currentIndex = this.currentIndex < this.currentPlaylist.length - 1 ? this.currentIndex + 1 : 0;
        }
        this.playSong(this.currentPlaylist[this.currentIndex]);
    }

    handleSongEnd() {
        if (this.isRepeated) {
            this.playSong(this.currentSong);
        } else {
            this.nextSong();
        }
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progress.style.width = progress + '%';
            this.currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }

    updateDuration() {
        if (this.audioPlayer.duration) {
            this.duration.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    seekTo(e) {
        if (this.audioPlayer.duration) {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            this.audioPlayer.currentTime = percentage * this.audioPlayer.duration;
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        this.repeatBtn.classList.toggle('active', this.isRepeated);
    }

    setVolume(value) {
        this.volume = value / 100;
        this.audioPlayer.volume = this.volume;
        
        // Update volume icon
        if (this.volume === 0) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (this.volume < 0.5) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    togglePlaylistPanel() {
        this.playlistPanel.classList.toggle('show');
    }

    updatePlaylist() {
        this.playlistSongs.innerHTML = '';
        this.currentPlaylist.forEach((song, index) => {
            const playlistSong = document.createElement('div');
            playlistSong.className = 'playlist-song';
            if (this.currentSong && this.currentSong.id === song.id) {
                playlistSong.classList.add('active');
            }
            
            playlistSong.innerHTML = `
                <div class="playlist-song-cover">
                    <i class="fas fa-music"></i>
                </div>
                <div class="playlist-song-info">
                    <div class="playlist-song-title">${song.title}</div>
                    <div class="playlist-song-artist">${song.artist}</div>
                </div>
            `;
            
            playlistSong.addEventListener('click', () => {
                this.currentIndex = index;
                this.playSong(song);
            });
            
            this.playlistSongs.appendChild(playlistSong);
        });
    }

    updatePlaylistHighlight() {
        const playlistSongs = document.querySelectorAll('.playlist-song');
        playlistSongs.forEach((song, index) => {
            song.classList.toggle('active', this.currentSong && this.currentIndex === index);
        });
    }

    // Upload functionality
    handleDragOver(e) {
        e.preventDefault();
        this.uploadBox.style.borderColor = '#8A2BE2';
        this.uploadBox.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadBox.style.borderColor = '';
        this.uploadBox.style.backgroundColor = '';
        
        const files = Array.from(e.dataTransfer.files);
        this.processAudioFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processAudioFiles(files);
    }

    processAudioFiles(files) {
        const audioFiles = files.filter(file => file.type.startsWith('audio/'));
        
        if (audioFiles.length === 0) {
            this.showNotification('يرجى اختيار ملفات صوتية صالحة', 'error');
            return;
        }

        audioFiles.forEach(file => {
            this.addUploadedFile(file);
        });

        this.uploadForm.style.display = 'block';
        this.uploadBox.style.display = 'none';
    }

    addUploadedFile(file) {
        const fileInfo = {
            file: file,
            name: file.name,
            size: this.formatFileSize(file.size),
            type: file.type,
            url: URL.createObjectURL(file)
        };

        this.uploadedFiles.push(fileInfo);
        this.displayUploadedFile(fileInfo);
    }

    displayUploadedFile(fileInfo) {
        const filesListContainer = this.uploadedFilesContainer.querySelector('.files-list');
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="file-details">
                    <h4>${fileInfo.name}</h4>
                    <p>${fileInfo.size} • ${fileInfo.type}</p>
                </div>
            </div>
            <div class="file-actions">
                <button onclick="musicPlayer.playUploadedFile('${fileInfo.url}')">تشغيل</button>
                <button onclick="musicPlayer.removeUploadedFile('${fileInfo.name}')">حذف</button>
            </div>
        `;

        filesListContainer.appendChild(fileItem);
    }

    handleSongInfoSubmit(e) {
        e.preventDefault();
        
        const songTitle = document.getElementById('songTitle').value;
        const artistName = document.getElementById('artistName').value;
        const albumName = document.getElementById('albumName').value;

        if (this.uploadedFiles.length === 0) {
            this.showNotification('يرجى رفع ملف صوتي أولاً', 'error');
            return;
        }

        // Create new song from uploaded file
        const uploadedFile = this.uploadedFiles[this.uploadedFiles.length - 1];
        const newSong = {
            id: Date.now(),
            title: songTitle,
            artist: artistName,
            album: albumName || 'غير محدد',
            duration: '0:00', // Will be updated when audio loads
            plays: 0,
            dateAdded: new Date(),
            audioUrl: uploadedFile.url,
            isUploaded: true
        };

        this.allSongs.push(newSong);
        
        // Add to artist if not exists
        if (!this.artists[artistName.toLowerCase().replace(/\s+/g, '-')]) {
            this.addNewArtist(artistName, `فنان موهوب`);
        }

        this.populateSongs();
        this.showNotification('تم إضافة الأغنية بنجاح!', 'success');
        
        // Reset form
        this.songInfoForm.reset();
        this.uploadForm.style.display = 'none';
        this.uploadBox.style.display = 'block';
    }

    playUploadedFile(url) {
        // Find the song with this URL
        const song = this.allSongs.find(s => s.audioUrl === url);
        if (song) {
            this.playSong(song);
        }
    }

    removeUploadedFile(fileName) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
        
        // Remove from UI
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            if (item.querySelector('h4').textContent === fileName) {
                item.remove();
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Artist functionality
    handleTabClick(e) {
        const artistName = e.target.getAttribute('data-artist');
        
        // Remove active class from all tabs
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        if (artistName === 'add-artist') {
            this.showAddArtistModal();
        } else if (artistName === 'all') {
            this.populateArtists();
        } else {
            this.showArtistSongs(this.artists[artistName]);
        }
    }

    showAddArtistModal() {
        this.addArtistModal.classList.add('show');
    }

    closeModal() {
        this.addArtistModal.classList.remove('show');
    }

    handleAddArtist(e) {
        e.preventDefault();
        
        const artistName = document.getElementById('newArtistName').value;
        const artistBio = document.getElementById('artistBio').value;

        this.addNewArtist(artistName, artistBio);
        
        this.addArtistForm.reset();
        this.closeModal();
        this.showNotification('تم إضافة الفنان بنجاح!', 'success');
    }

    addNewArtist(name, bio) {
        const artistKey = name.toLowerCase().replace(/\s+/g, '-');
        
        this.artists[artistKey] = {
            name: name,
            bio: bio,
            songs: this.allSongs.filter(song => song.artist === name)
        };

        // Add new tab button
        const tabButtonsContainer = document.querySelector('.tab-buttons');
        const addButton = document.querySelector('[data-artist="add-artist"]');
        
        const newTabButton = document.createElement('button');
        newTabButton.className = 'tab-btn';
        newTabButton.setAttribute('data-artist', artistKey);
        newTabButton.textContent = name;
        newTabButton.addEventListener('click', (e) => this.handleTabClick(e));
        
        tabButtonsContainer.insertBefore(newTabButton, addButton);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ECDC4' : type === 'error' ? '#FF6B6B' : '#8A2BE2'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new FantasyMusicPlayer();
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Floating music notes animation
    function createFloatingNote() {
        const note = document.createElement('div');
        note.innerHTML = '♪';
        note.style.cssText = `
            position: fixed;
            font-size: 20px;
            color: rgba(138, 43, 226, 0.3);
            pointer-events: none;
            z-index: 1;
            animation: float 6s linear infinite;
        `;
        
        note.style.left = Math.random() * window.innerWidth + 'px';
        note.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(note);
        
        setTimeout(() => {
            document.body.removeChild(note);
        }, 6000);
    }

    // Create floating notes periodically
    setInterval(createFloatingNote, 3000);

    // Add CSS animation for floating notes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});