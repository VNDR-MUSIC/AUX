
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Image from 'next/image';
import Head from 'next/head';

interface NDRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NDRadioModal({ isOpen, onClose }: NDRadioModalProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Dynamically load the Font Awesome stylesheet
      const fontAwesome = document.createElement('link');
      fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
      fontAwesome.rel = "stylesheet";
      fontAwesome.integrity = "sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==";
      fontAwesome.crossOrigin = "anonymous";
      fontAwesome.referrerPolicy = "no-referrer";
      document.head.appendChild(fontAwesome);

      // --- RadioPlayer Class Definition ---
      class RadioPlayer {
        container: HTMLElement;
        config: { streamUrl: string; apiUrl: string; borderColor: string; };
        audio: HTMLAudioElement;
        isPlaying: boolean;
        currentVolume: number;
        elapsed: number;
        metadata: any;
        lastFetchTime: number;
        fetchInProgress: boolean;
        artworkImage: HTMLImageElement | null;
        artworkPlaceholder: HTMLDivElement | null;
        songNameDiv: HTMLDivElement | null;
        artistNameDiv: HTMLDivElement | null;
        radioNameDiv: HTMLDivElement | null;
        liveContainer: HTMLDivElement | null;
        playButton: HTMLButtonElement | null;
        volumeButton: HTMLButtonElement | null;
        volumeSlider: HTMLInputElement | null;
        timeBarProgress: HTMLDivElement | null;
        elapsedTimeSpan: HTMLSpanElement | null;
        durationTimeSpan: HTMLSpanElement | null;
        isMuted: boolean;
        preMuteVolume: number;
        elapsedInterval: NodeJS.Timeout | null;
        metadataInterval: NodeJS.Timeout | null;

        constructor(container: HTMLElement, config: { streamUrl: string; apiUrl: string; borderColor: string; }) {
            this.container = container;
            this.config = config;
            this.audio = new Audio();
            this.isPlaying = false;
            this.currentVolume = 1;
            this.elapsed = 0;
            this.metadata = null;
            this.lastFetchTime = 0;
            this.fetchInProgress = false;
            this.elapsedInterval = null;
            this.metadataInterval = null;

            this.artworkImage = null;
            this.artworkPlaceholder = null;
            this.songNameDiv = null;
            this.artistNameDiv = null;
            this.radioNameDiv = null;
            this.liveContainer = null;
            this.playButton = null;
            this.volumeButton = null;
            this.volumeSlider = null;
            this.timeBarProgress = null;
            this.elapsedTimeSpan = null;
            this.durationTimeSpan = null;
            this.isMuted = false;
            this.preMuteVolume = 1;


            this.init();
        }

        init() {
            this.audio.src = this.config.streamUrl;
            this.audio.preload = 'none';

            this.setupElements();
            this.attachEventListeners();
            this.startMetadataPolling();
            this.startTimeTracking();
        }

        setupElements() {
            this.artworkImage = this.container.querySelector('.artwork-image');
            this.artworkPlaceholder = this.container.querySelector('.artwork-placeholder');
            this.songNameDiv = this.container.querySelector('.song-name');
            this.artistNameDiv = this.container.querySelector('.artist-name');
            this.radioNameDiv = this.container.querySelector('.radio-name');
            if (this.radioNameDiv) {
                this.radioNameDiv.style.fontWeight = '600';
            }
            this.liveContainer = this.container.querySelector('.live-container');
            this.playButton = this.container.querySelector('.play-button');
            this.volumeButton = this.container.querySelector('.volume-button');
            this.volumeSlider = this.container.querySelector('.volume-slider');
            this.timeBarProgress = this.container.querySelector('.time-bar-progress');
            this.elapsedTimeSpan = this.container.querySelector('.elapsed-time');
            this.durationTimeSpan = this.container.querySelector('.duration-time');

            if (this.volumeSlider) {
                this.volumeSlider.value = "100";
                this.isMuted = false;
                this.preMuteVolume = 1;
            }

            if (this.config.borderColor) {
                this.container.style.borderColor = this.config.borderColor;
            }

            if (this.volumeButton && this.volumeSlider) {
                this.setupVolumeControls();
            }
        }

        setupVolumeControls() {
            const volumeContainer = this.container.querySelector('.volume-bar-container') as HTMLDivElement;
            if(!volumeContainer) return;

            let hideTimeout: NodeJS.Timeout;

            const showVolume = () => {
                clearTimeout(hideTimeout);
                volumeContainer.classList.add('show');
            };

            const hideVolume = () => {
                hideTimeout = setTimeout(() => {
                    volumeContainer.classList.remove('show');
                }, 200);
            };
            
            this.volumeButton?.addEventListener('mouseenter', showVolume);
            this.volumeButton?.addEventListener('mouseleave', hideVolume);
            volumeContainer.addEventListener('mouseenter', showVolume);
            volumeContainer.addEventListener('mouseleave', hideVolume);

            this.volumeButton?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute();
            });

            this.volumeSlider?.addEventListener('input', (e) => {
                const value = parseFloat((e.target as HTMLInputElement).value) / 100;
                this.setVolume(value);
                if (value > 0 && this.isMuted) {
                    this.isMuted = false;
                }
            });
        }

        attachEventListeners() {
            this.audio.addEventListener('play', () => this.updatePlayState());
            this.audio.addEventListener('pause', () => this.updatePlayState());
            this.audio.addEventListener('volumechange', () => this.updateVolumeState());

            if (this.playButton) {
                this.playButton.addEventListener('click', () => this.togglePlay());
            }
        }

        startMetadataPolling() {
            this.fetchMetadata();
            this.metadataInterval = setInterval(() => this.fetchMetadata(), 10000);
        }

        startTimeTracking() {
            this.elapsedInterval = setInterval(() => {
                this.elapsed++;
                this.updateTimeDisplay();
            }, 1000);
        }

        async fetchMetadata() {
            if (this.fetchInProgress || Date.now() - this.lastFetchTime < 2000) return;
            this.fetchInProgress = true;

            try {
                const response = await fetch(this.config.apiUrl);
                const data = await response.json();
                this.metadata = data;
                this.updateMetadata(data);
                this.lastFetchTime = Date.now();
            } catch (error) {
                console.error('Error fetching metadata:', error);
            } finally {
                this.fetchInProgress = false;
            }
        }

        async togglePlay() {
            try {
                if (this.isPlaying) {
                    this.audio.pause();
                } else {
                    await this.audio.play();
                }
                this.isPlaying = !this.isPlaying;
                this.updatePlayState();
            } catch (error) {
                console.error('Error toggling play state:', error);
            }
        }

        updatePlayState() {
            if (this.playButton) {
                this.playButton.innerHTML = `<i class="fas fa-${this.isPlaying ? 'pause' : 'play'}"></i>`;
            }
        }

        setVolume(value: number) {
            this.audio.volume = value;
            this.currentVolume = value;
            this.isMuted = value === 0;
            this.updateVolumeState();
        }

        toggleMute() {
            if (this.audio.volume > 0) {
                this.preMuteVolume = this.audio.volume;
                this.setVolume(0);
            } else {
                this.setVolume(this.preMuteVolume);
            }
        }

        updateVolumeState() {
            if (this.volumeButton && this.volumeSlider) {
                const volume = this.audio.volume;
                this.volumeSlider.value = String(volume * 100);
                
                let icon = 'volume-up';
                if (volume === 0) icon = 'volume-mute';
                else if (volume < 0.33) icon = 'volume-off';
                else if (volume < 0.66) icon = 'volume-down';

                this.volumeButton.innerHTML = `<i class="fas fa-${icon}"></i>`;
            }
        }

        formatTime(seconds: number) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${String(secs).padStart(2, '0')}`;
        }

        updateTimeDisplay() {
            if (this.timeBarProgress && this.metadata?.now_playing) {
                const duration = this.metadata.now_playing.duration || 0;
                const progress = duration > 0 ? (this.elapsed / duration) * 100 : 0;
                this.timeBarProgress.style.width = `${Math.min(progress, 100)}%`;
            }
            
            if (this.elapsedTimeSpan) {
                this.elapsedTimeSpan.textContent = this.formatTime(this.elapsed);
            }
            if (this.durationTimeSpan && this.metadata?.now_playing) {
                this.durationTimeSpan.textContent = this.formatTime(this.metadata.now_playing.duration || 0);
            }
        }

        updateMetadata(data: any) {
            const nowPlaying = data.now_playing;
            if (!nowPlaying) return;

            this.elapsed = Math.max(0, data.now_playing.elapsed || 0);

            if (this.artworkImage && nowPlaying.song.art) {
                this.artworkImage.src = nowPlaying.song.art;
                this.artworkImage.style.display = 'block';
                if(this.artworkPlaceholder) this.artworkPlaceholder.style.display = 'none';
            } else if (this.artworkImage) {
                this.artworkImage.style.display = 'none';
                if(this.artworkPlaceholder) this.artworkPlaceholder.style.display = 'flex';
            }

            if (this.songNameDiv) this.songNameDiv.textContent = nowPlaying.song.title || '';
            if (this.artistNameDiv) this.artistNameDiv.textContent = nowPlaying.song.artist || '';
            if (this.radioNameDiv && data.station?.name) this.radioNameDiv.textContent = data.station.name;
            if (this.liveContainer) {
                const isLive = data.live?.is_live || false;
                this.liveContainer.style.display = isLive ? 'flex' : 'none';
                const liveText = this.liveContainer.querySelector('.live-text');
                if (liveText && isLive) {
                    liveText.textContent = data.live?.streamer_name || 'LIVE';
                }
            }
        }

        cleanup() {
            if (this.elapsedInterval) clearInterval(this.elapsedInterval);
            if (this.metadataInterval) clearInterval(this.metadataInterval);
            this.audio.pause();
            this.audio.src = '';
        }
      }

      playerRef.current = new RadioPlayer(containerRef.current, {
        streamUrl: 'https://s123.radiolize.com:8070/radio.mp3',
        apiUrl: 'https://s123.radiolize.com/api/nowplaying/13',
        borderColor: 'transparent'
      });

      return () => {
        playerRef.current?.cleanup();
        if (fontAwesome.parentNode) {
            document.head.removeChild(fontAwesome);
        }
      };
    }
  }, [isOpen]);


  return (
    <>
    <style jsx global>{`
        /* Font imports */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        .radio-player {
            font-family: 'Poppins', sans-serif;
            position: relative;
            width: 300px;
            height: auto;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 8px;
            border: 0px solid rgba(0, 0, 0, 0.8);
            padding: 15px;
            margin: 0 auto;
            box-sizing: border-box;
            box-shadow: -2.82842712474619px 2.8284271247461903px 15px rgba(0, 0, 0, 0.2);
            color: #ffffff;
            overflow: hidden;
        }

        .player-content {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .album-artwork {
            width: 100%;
            aspect-ratio: 1;
            position: relative;
            overflow: hidden;
        }

        .artwork-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .artwork-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(51, 51, 51, 0.2);
            color: #ffffff;
        }

        .time-bar-container {
            width: 100%;
            padding: 5px 0;
            position: relative;
        }

        .time-bar {
            width: 100%;
            height: 4px;
            background: #ffffff33;
            border-radius: 2px;
            overflow: hidden;
            position: relative;
        }

        .time-bar-progress {
            height: 100%;
            background: #ffffff;
            width: 0;
            border-radius: 2px;
            transition: width 0.1s linear;
        }

        .time-info {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
            color: #ffffff !important;
            width: 100%;
        }

        .elapsed-time {
            text-align: left;
        }

        .duration-time {
            text-align: right;
        }

        .station-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 10px 0;
        }

        .radio-name {
            font-size: 12px;
            font-weight: 600;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .live-container {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .live-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #FF0000;
            animation: pulse 2s infinite;
        }

        .live-text {
            font-size: 12px;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .song-info {
            width: 100%;
            padding: 15px 0;
            text-align: center;
        }

        .song-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .artist-name {
            font-size: 12px;
            opacity: 0.8;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .controls-container {
            position: relative;
            width: 100%;
        }

        .controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            padding: 15px 20px;
        }

        .control-button {
            background: transparent;
            border: none;
            color: #ffffff !important;
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: normal;
            box-shadow: -1.414213562373095px 1.4142135623730951px 4px rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            min-width: 36px;
            width: 36px;
            height: 36px;
            aspect-ratio: 1;
            text-transform: none;
            transition: color 0.1s ease;
        }

        .control-button:hover {
            color: #4AE66E !important;
        }

        .volume-bar-container {
            position: absolute;
            bottom: calc(100% + 5px);
            left: 50%;
            transform: translate(170%, 15px);
            background: rgba(0, 0, 0, 0.8);
            padding: 12px 8px;
            border-radius: 8px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: default;
            height: 100px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .volume-bar-container:before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid rgba(0, 0, 0, 0.8);
        }

        .volume-bar-container.show {
            opacity: 1;
            visibility: visible;
        }

        .volume-slider {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 80px !important;
            height: 4px !important;
            background: #ffffff40 !important;
            border-radius: 2px !important;
            outline: none !important;
            transform: rotate(-90deg) !important;
            transform-origin: center !important;
            margin: 0 !important;
            cursor: pointer !important;
            position: absolute !important;
            border: none !important;
            box-shadow: none !important;
        }

        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 12px !important;
            height: 12px !important;
            background: #ffffff !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
            transform-origin: center !important;
            border: none !important;
            margin-top: -4px !important;
            box-shadow: none !important;
        }

        .volume-slider::-moz-range-thumb {
            width: 12px !important;
            height: 12px !important;
            background: #ffffff !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
            transform-origin: center !important;
            border: none !important;
            margin-top: -4px !important;
            box-shadow: none !important;
        }

        .volume-slider::-webkit-slider-runnable-track {
            height: 4px !important;
            border-radius: 2px !important;
            background: inherit !important;
            border: none !important;
            box-shadow: none !important;
        }

        .volume-slider::-moz-range-track {
            height: 4px !important;
            border-radius: 2px !important;
            background: inherit !important;
            border: none !important;
            box-shadow: none !important;
        }

        .volume-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2) !important;
        }

        .volume-slider::-moz-range-thumb:hover {
            transform: scale(1.2) !important;
        }

        .volume-button:hover .volume-bar-container,
        .volume-bar-container:hover {
            opacity: 1;
            visibility: visible;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .radio-player .control-button {
            padding: 5px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }

        .radio-player .control-button.play-button {
            width: calc(36px * 1.3);
            height: calc(36px * 1.3);
            font-size: 1.5rem;
        }

        .radio-player .control-button .fa-play {
            margin-left: 2px;
            font-size: inherit;
        }

        .radio-player .control-button .fa-pause {
            font-size: inherit;
        }


        .radio-player.square {
            position: relative;
            aspect-ratio: 1;
            height: 300px;
            padding: 15px;
            margin: 0 auto;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .radio-player.square .album-artwork {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            z-index: 1;
        }

        .radio-player.square .album-artwork img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }

        .radio-player.square .artwork-overlay {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
            z-index: 2;
        }

        .radio-player.square .player-content {
            position: relative;
            z-index: 3;
            padding: 10px 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            height: 100%;
        }

        .radio-player.square .station-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding-top: 5px;
        }

        .radio-player.square .radio-name {
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .radio-player.square .live-container {
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border-radius: 12px;
            backdrop-filter: blur(4px);
        }

        .radio-player.square .live-text {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .radio-player.square .song-info {
            padding: 0;
            margin-bottom: 20px;
            text-align: center;
            margin-top: auto;
        }

        .radio-player.square .song-name {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            font-size: 16px;
            margin-bottom: 4px;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .radio-player.square .artist-name {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            font-size: 14px;
            opacity: 0.8;
            color: #ffffff !important;
            letter-spacing: 0px;
            line-height: 1.5em;
            word-spacing: 0px;
        }

        .radio-player.square .controls-container {
            width: 100%;
            margin-bottom: 30px;
        }

        .radio-player.square .controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            padding: 0;
        }

        .radio-player.square .control-button {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .radio-player.square .control-button.play-button {
            font-size: 1.5rem;
        }

        .radio-player.square .time-bar-container {
            position: absolute;
            bottom: 0;
            left: 0;
            padding: 0;
            width: 100%;
            z-index: 3;
        }

        .radio-player.square .time-bar {
            border-radius: 0;
        }

        .radio-player.square .time-bar-progress {
            border-radius: 0;
        }

        .radio-player.square .time-info {
            position: absolute;
            bottom: 4px;
            left: 0;
            width: 100%;
            padding: 0 10px;
            z-index: 4;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            color: #ffffff !important;
        }

        .radio-player.square .volume-bar-container {
            bottom: 100%;
            right: 0;
            transform: translate(170%, 0px);
            background: rgba(0, 0, 0, 0.8);
            padding: 12px 8px;
            border-radius: 8px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: default;
            height: 100px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `}</style>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground p-0 border-0 w-auto">
        <div id="radio-player" className="radio-player square" ref={containerRef}>
          <div className="album-artwork">
            <img className="artwork-image" src="" alt="Album Art" style={{ display: 'none' }} />
            <div className="artwork-placeholder">ALBUM ARTWORK AREA</div>
            <div className="artwork-overlay"></div>
          </div>
          <div className="player-content">
            <div className="station-info">
              <div className="radio-name"></div>
              <div className="live-container">
                <div className="live-indicator"></div>
                <div className="live-text">LIVE</div>
              </div>
            </div>
            <div className="song-info">
              <div className="song-name"></div>
              <div className="artist-name"></div>
            </div>
            <div className="controls-container">
              <div className="controls">
                <button className="control-button play-button">
                  <i className="fas fa-play"></i>
                </button>
                <button className="control-button volume-button">
                  <i className="fas fa-volume-up"></i>
                </button>
                <div className="volume-bar-container">
                  <input type="range" className="volume-slider" min="0" max="100" defaultValue="100" />
                </div>
              </div>
            </div>
            <div className="time-info">
              <span className="elapsed-time">0:00</span>
              <span className="duration-time">0:00</span>
            </div>
            <div className="time-bar-container">
              <div className="time-bar">
                <div className="time-bar-progress"></div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="absolute bottom-4 right-4 sm:justify-between items-center gap-4">
          <Button asChild>
            <Link href="https://indieradio.live" target="_blank" rel="noopener noreferrer">
              Submit Your Music
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
