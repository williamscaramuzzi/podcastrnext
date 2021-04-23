import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodeList: Array<Episode>,
    currentEpisodeIndex: number,    
    isPlaying: boolean,
    isShuffling: boolean,
    setIsPlaying: Dispatch<SetStateAction<boolean>>,
    playList: (list: Array<Episode>, index: number) => void,
    play: (episode: Episode) => void,
    toggleShuffling: () => void,
    togglePlay: () => void,    
    toggleLoop: ()=> void,
    playNext: () => void,
    playPrevious: ()=> void,
    hasNext: boolean,
    hasPrevious: boolean,
    isLooping: boolean,
    clearPlayerState: ()=> void
}
let obj: PlayerContextData;
export const PlayerContext = createContext(obj); //eu obrigo o meu PlayerContext a usar esse formato de objeto com dois params: episodeList e currentEpisodeIndex

type PlayerContextProviderProps = {
    children: ReactNode
}
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false)
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function play(episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }
    function playList(list: Array<Episode>, index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }
    function toggleLoop() {
        setIsLooping(!isLooping);
    }
    function toggleShuffling() {
        setIsShuffling(!isShuffling);
    }
    function playNext() {
        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }
    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }
    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
   }
    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            isPlaying,
            setIsPlaying,
            playList,
            togglePlay,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            isShuffling,
            toggleShuffling,
            toggleLoop,
            clearPlayerState
        }}>

            { children}

        </PlayerContext.Provider>
    )
}

export const usePlayer = ()=>{
    return useContext(PlayerContext);
}