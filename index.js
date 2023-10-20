const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Cris_player';

const playBtns = $$('.btn-togger-play');
const nextBtns = $$('.btn-next');
const backBtns = $$('.btn-back');

const headerMusic = $('.header');
const audio = $('#audio');
const playList = $('.playlist');
const playerMini = $('.playermini');
const playerMiniThumb = $('.playermini__thumb');
const playerMiniTitle = $('.playermini__body__title');
const playerMiniAuthor = $('.playermini__body__author');

const switchListUI = $('.btn-down');
const closeList = $('.btn-closelist');
const dashboard = $('.dashboard');
const playlistplus = $('.playlistplus');
const playlistplusHeader = $('.playlistplus__header');

const switchTheme = $('.switchtheme');

const cd = $('.dashboard__cd');
const cdName = $('.dashboard__songname');
const cdThumb = $('.dashboard__cd-thumb');
const cdThumbMini = $('.playermini__thumb');

const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const heartBtn = $('.btn-heart');
const volumeBtn = $('.btn-volume');
const muteVolumeBtn = $('.btn-volume-mute');
const lowVolumeBtn = $('.btn-volume-low');
const highVolumeBtn = $('.btn-volume-high');
const volumeBar = $('.volume-bar');

const timeLeft = $('.time-left');
const timeRight = $('.time-right');
const progress = $('.progress');
const progressMini = $('.playermini__timer');

const app = {
    currentIndex: 0,
    passIndex: [0],
    isMuteVolume: false,
    isLowVolume: false,
    isLightTheme: false,
    isPlaying: false,
    //load infro from json local storage
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
        // currentIndex: 0,
        isRepeat: false,
        isRandom: false,
        isHeart: false,
        currentVolume: 1,
        savedVolume: 1,
    },
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Sunset Avenue',
            singer: 'Charlieonnafriday',
            path: './assets/music/01SunsetAvenueCharlieonnaFriday.mp3',
            image: './assets/img/01.png',
        },
        {
            name: 'Nevada',
            singer: 'Victone',
            path: './assets/music/02Nevada-Vicetone.mp3',
            image: './assets/img/02.png',
        },
        {
            name: 'The nights',
            singer: 'Avicii - Citycreed cover',
            path: './assets/music/03TheNights-Avicii.mp3',
            image: './assets/img/03.png',
        },
        {
            name: "Chillin'",
            singer: 'Charlieonnafriday',
            path: './assets/music/04Chillin.mp3',
            image: './assets/img/04.png',
        },
        {
            name: 'Turn Back Time',
            singer: 'Daniel Schulz',
            path: './assets/music/05.DanielSchulzTurnBackTime.mp3',
            image: './assets/img/05.png',
        },
        {
            name: 'Walk Thru Fire',
            singer: 'Vicetone',
            path: './assets/music/08WalkThruFire-Vicetone.mp3',
            image: './assets/img/08.png',
        },
        {
            name: 'Unity',
            singer: 'Alan Walkers',
            path: 'assets/music/08UnityAlanWalker.mp3',
            image: './assets/img/09.png',
        },
        {
            name: 'Khi  cơn mưa dần phai',
            singer: 'Tez x Myra Trần',
            path: './assets/music/06khiConMuaDanPhai.mp3',
            image: './assets/img/06.png',
        },
        {
            name: 'Truy Lùng Bảo Vật',
            singer: '24K.Right x Sofia',
            path: './assets/music/07TruyLungBaoVat.mp3',
            image: './assets/img/07.png',
        },
        {
            name: 'Ngôi nhà hạnh phúc',
            singer: 'Trung Quân',
            path: './assets/music/10ngoiNhaHanhPhuc.mp3',
            image: './assets/img/10.png',
        },
    ],

    render() {
        const htmls = this.songs.map((song, index) => {
            return ` 
        <div class="song ${this.isLightTheme ? 'light' : ''} ${
                index === this.currentIndex ? 'songplaying' : ''
            }" index="${index}">
            <div>
                <img class="song__thumb" src="${song.image}" alt="" />
                </div>
                <div class="song__body">
                    <h3 class="title">${song.name}</h3>
                    <div class="author">${song.singer}</div>
                </div>
                <i class="fa-solid fa-ellipsis option-btn"></i>
             </div>`;
        });
        playList.innerHTML = htmls.join('');
        playerMiniThumb.src = this.currentSong.image;
        playerMiniTitle.textContent = this.currentSong.name;
        playerMiniAuthor.textContent = this.currentSong.singer;
    },

    defineProperties() {
        // Add key currentSong vao object app: currentSong: get(){}
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents() {
        //Switch theme when click
        switchTheme.onclick = () => {
            this.isLightTheme = !this.isLightTheme;
            switchTheme.classList.toggle('light', this.isLightTheme);
            document.body.classList.toggle('light', this.isLightTheme);
            headerMusic.classList.toggle('light', this.isLightTheme);
            dashboard.classList.toggle('light', this.isLightTheme);
            playlistplus.classList.toggle('light', this.isLightTheme);
            this.render();
        };
        switchListUI.onclick = () => {
            dashboard.style.display = 'none';
            playlistplusHeader.style.display = '';
            playList.classList.add('mini');
            playerMini.classList.add('mini');
            playlistplus.classList.add('mini');
            playerMini.style.display = 'flex';
            this.scrolltoAciveSong();
        };
        closeList.onclick = () => {
            playList.classList.remove('mini');
            playlistplus.classList.remove('mini');
            playerMini.classList.remove('mini');
            dashboard.style.display = '';
            playlistplusHeader.style.display = 'none';
            playerMini.style.display = 'none';
            this.scrolltoAciveSong();
        };

        // // //Zoomin-out CD thumb when scroll
        // const cdWidth = cd.offsetWidth;
        // document.onscroll = () => {
        //     const scrollTop = window.scrollY || document.documentElement.scrollTop;
        //     const newCdWidth = cdWidth - scrollTop;
        //     cd.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0;
        //     cd.style.opacity = newCdWidth / cdWidth;
        // };

        //Handle CD rotate //animate() method: animate([keyframe], {time}
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, //10s 1 period
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        const cdThumbAnimateMini = cdThumbMini.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, //10s 1 period
            iterations: Infinity,
        });
        cdThumbAnimateMini.pause();

        // Click play
        playBtns.forEach(
            (playBtn) =>
                (playBtn.onclick = () => {
                    //arrow function do not create closure => still use this
                    this.isPlaying ? audio.pause() : audio.play();
                }),
        );

        //when audio playing/pause
        audio.onplay = () => {
            this.isPlaying = true;
            playBtns.forEach((playBtn) => {
                playBtn.classList.add('playing');
            });
            cdThumbAnimate.play();
            cdThumbAnimateMini.play();
        };
        audio.onpause = () => {
            this.isPlaying = false;
            playBtns.forEach((playBtn) => {
                playBtn.classList.remove('playing');
            });
            cdThumbAnimate.pause();
            cdThumbAnimateMini.pause();
        };

        //Next/Back/random/rotate song
        nextBtns.forEach((nextBtn) => {
            nextBtn.onclick = () => {
                if (this.isRandom) {
                    this.randomSong();
                } else {
                    this.nextSong();
                }
                audio.play();
                this.render();
                this.scrolltoAciveSong();
            };
        });
        backBtns.forEach((backBtn) => {
            backBtn.onclick = () => {
                if (audio.currentTime < 6) {
                    if (this.isRandom) {
                        this.randomSong();
                    } else {
                        this.backSong();
                    }
                } else {
                    audio.currentTime = 0;
                }
                audio.play();
                this.render();
                this.scrolltoAciveSong();
            };
        });
        randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            this.setConfig('isRandom', this.isRandom);
            randomBtn.classList.toggle('active', this.isRandom);
        };
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat);
            repeatBtn.classList.toggle('active', this.isRepeat);
        };
        heartBtn.onclick = () => {
            this.isHeart = !this.isHeart;
            this.setConfig('isHeart', this.isHeart);
            heartBtn.classList.toggle('active', this.isHeart);
        };

        //Handle volume Adjust area
        highVolumeBtn.onclick = () => {
            this.setConfig('savedVolume', audio.volume);
            audio.volume = 0;
            this.renderVolume();
        };
        lowVolumeBtn.onclick = () => {
            this.setConfig('savedVolume', audio.volume);
            audio.volume = 0;
            this.renderVolume();
        };
        muteVolumeBtn.onclick = () => {
            audio.volume = this.config.savedVolume;
            this.renderVolume();
        };
        volumeBar.onclick = (e) => {
            e.stopPropagation();
        };
        //Handle volume bar
        volumeBar.oninput = (e) => {
            audio.volume = e.target.value / 100;
            this.setConfig('currentVolume', audio.volume);
            this.renderVolume();
        };

        //---in mobile:touch divice
        // let isTouchingVolume = false;
        // volumeBar.ontouchstart = () => {
        //     isTouchingVolume = true;
        // };
        // document.ontouchmove = (e) => {
        //     if (isTouchingVolume) {
        //         e.preventDefault(); // stop scroll when touch move adjust mobile
        //     }
        // };
        // document.ontouchend = (e) => {
        //     isTouchingVolume = false;
        // };
        // // -------------------

        //When audiotime change
        audio.ontimeupdate = () => {
            //when dont load audio: audio.duration = NaN
            if (audio.duration) {
                timeLeft.textContent = this.formatTime(audio.currentTime);
                // const remainTime = this.formatTime(audio.duration) - audio.currentTime;  `-${remainTime}`
                timeRight.textContent = this.formatTime(audio.duration);

                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
                progress.style.background = `linear-gradient(to right, var(--primary-color) ${progressPercent}%, rgb(214, 214, 214) ${progressPercent}%)`;
                progressMini.style.width = progressPercent + '%';
            }
        };
        //Handle seeking audio
        progress.oninput = (e) => {
            const seekingTime = audio.duration * (e.target.value / 100);
            audio.currentTime = Math.floor(seekingTime);
            this.isPlaying ? audio.play() : audio.pause();
        };
        progress.ontouchstart = () => {
            progress.setAttribute = ('style', 'height: 16px');
        };
        progress.ontouchend = () => {
            progress.setAttribute = ('style', '');
        };
        //Handle nextsong when audio.end
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                nextBtns[0].click();
            }
        };

        //active when click to song (throught dedicated from parent)
        playList.onclick = (e) => {
            const songClick = e.target.closest('.song:not(.songplaying)');
            if (songClick) {
                this.currentIndex = +songClick.getAttribute('index');
                this.loadCurrentSong();
                // this.setConfig('currentIndex', this.currentIndex);
                this.render();
                audio.play();
            }
        };
    },

    formatTime(time) {
        let minutes = Math.floor(time / 60);
        let timeForSeconds = time - minutes * 60; // seconds without counted minutes
        let seconds = Math.floor(timeForSeconds);
        let secondsReadable = seconds > 9 ? seconds : `0${seconds}`; // To change 2:2 into 2:02
        return `${minutes}:${secondsReadable}`;
    },

    loadCurrentSong() {
        cdName.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    //Control features of btn
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        // this.setConfig('currentIndex', this.currentIndex);
    },
    backSong() {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        // this.setConfig('currentIndex', this.currentIndex);
    },

    renderVolume() {
        switch (true) {
            case audio.volume <= 0:
                this.isLowVolume = false;
                this.isMuteVolume = true;
                break;
            case audio.volume < 0.4:
                this.isMuteVolume = false;
                this.isLowVolume = true;
                break;
            default:
                this.isLowVolume = false;
                this.isMuteVolume = false;
        }
        volumeBtn.classList.toggle('mute', this.isMuteVolume);
        volumeBtn.classList.toggle('low', this.isLowVolume);
        volumeBar.style.background = `linear-gradient(to right, var(--primary-color) ${
            audio.volume * 100
        }%, rgb(214, 214, 214) ${audio.volume * 100}%`;
        volumeBar.value = audio.volume * 100;
    },
    randomSong() {
        console.log(this.passIndex);
        this.passIndex = this.passIndex.length >= this.songs.length ? [this.currentIndex] : this.passIndex;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.passIndex.indexOf(newIndex) === -1 ? false : true);
        this.passIndex.push(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        // this.setConfig('currentIndex', this.currentIndex);
    },

    scrolltoAciveSong() {
        setTimeout(
            $('.song.songplaying').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            }),
            300,
        );
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.isHeart = this.config.isHeart;
        // this.currentIndex = this.config.currentIndex;
        audio.volume = this.config.currentVolume;
    },

    start() {
        this.loadConfig();
        this.defineProperties();
        this.render();

        this.handleEvents();

        this.loadCurrentSong();

        //DIsplay inital staus
        this.renderVolume();
        heartBtn.classList.toggle('active', this.isHeart);
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },
};

app.start();
