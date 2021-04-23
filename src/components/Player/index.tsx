import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss"
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
export function Player() {
     const [progress, setProgress] = useState(0);
     function setupProgressListener(){
          audioref.current.currentTime = 0;
          audioref.current.addEventListener('timeupdate', event => {
               setProgress(Math.floor(audioref.current.currentTime));
          });
     }
     function handleSeek(amount: number){
          audioref.current.currentTime = amount;
          setProgress(amount);
     }
     
     function handleEpisodeEnded(){
          if(hasNext){
               playNext();
          } else {
               clearPlayerState();
          }
     }
     //esse aqui é tipo o getElementById do react, a variavel audioref vai receber um Audio Element do HTML
     const audioref = useRef<HTMLAudioElement>(null);
     const {
          episodeList,
          currentEpisodeIndex,
          isPlaying,
          setIsPlaying,
          togglePlay,
          playNext,
          playPrevious,
          hasPrevious,
          hasNext,
          isLooping,
          toggleLoop,
          isShuffling,
          toggleShuffling,
          clearPlayerState,
          playList } = usePlayer();

     useEffect(() => {
          if (!audioref.current) { return }
          if (isPlaying) {
               audioref.current.play();
          } else {
               audioref.current.pause();
          }
     }, [isPlaying])
     const episode = episodeList[currentEpisodeIndex];
     return (
          <div className={styles.playerContainer}>
               <header>
                    <img src="/playing.svg" alt="Tocando agora" />
                    <strong>Tocando agora</strong>
               </header>
               { episode ? (
                    <div className={styles.currentEpisode}>
                         <Image
                              width={592}
                              height={592}
                              src={episode.thumbnail}
                              objectFit="cover" />
                         <strong>{episode.title}</strong>
                         <span>{episode.members}</span>
                    </div>
               ) : (
                    <div className={styles.emptyPlayer}>
                         <strong>Selecione um podcast para ouvir</strong>
                    </div>
               )}
               <footer className={episode ? '' : styles.empty}>
                    <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                         <div className={styles.slider}>
                              {episode ? (
                                   <Slider
                                   max={episode.duration} //retorna o numero de segundos, não é string
                                   value={progress}
                                   onChange={handleSeek}
                                        trackStyle={{ backgroundColor: '#84d361' }}
                                        railStyle={{ backgroundColor: '#9f75ff' }}
                                        handleStyle={{ borderColor: '#84d361', borderWidth: 4 }}
                                   />
                              ) : (
                                   <div className={styles.emptySlider}></div>
                              )}
                         </div>
                         <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    </div>

                    {episode && (
                         <audio src={episode.url}
                              ref={audioref}
                              autoPlay
                              onEnded={handleEpisodeEnded}
                              loop={isLooping}
                              onLoadedMetadata={setupProgressListener}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)} />
                    )}

                    <div className={styles.buttons}>
                         <button type="button" onClick={toggleShuffling} 
                         className={isShuffling? styles.isActive : ''}
                         disabled={!episode || (episodeList.length === 1)}>
                              <img src="/shuffle.svg" alt="Aleatório" />
                         </button>
                         <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                              <img src="/play-previous.svg" alt="Tocar anterior" />
                         </button>
                         <button type="button" disabled={!episode} className={styles.playButton}
                              onClick={togglePlay}>
                              {isPlaying ?
                                   <img src="/pause.svg" alt="Tocar" />
                                   : <img src="/play.svg" alt="Tocar" />}
                         </button>
                         <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                              <img src="/play-next.svg" alt="Tocar próxima" />
                         </button>
                         <button type="button" onClick={toggleLoop} className={isLooping? styles.isActive : ''} disabled={!episode}>
                              <img src="/repeat.svg" alt="Repetir" />
                         </button>
                    </div>
               </footer>
          </div>
     );
}