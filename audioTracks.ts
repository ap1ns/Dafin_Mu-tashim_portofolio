export type AudioTrack = {
    url: string;
    title: string;
    artist?: string;
    cover?: string;
};

const track = (
    fileName: string,
    title: string,
    artist?: string,
    cover?: string,
): AudioTrack => ({
    url: `/music/${fileName}.mp3`,
    title,
    artist,
    cover,
});

export const AUDIO_TRACKS: AudioTrack[] = [
    track(
        'MikiMatsubari_Staywithme',
        'Stay With Me',
        'Miki Matsubara',
        'https://i.pinimg.com/1200x/23/98/95/239895d8673e26e15f7bde2bc8af28c1.jpg',
    ),
    track(
        '20201203_MacDeMarco',
        '20201203',
        'Mac De Marco',
        'https://i.pinimg.com/736x/c0/45/0a/c0450a2479d0c69d12871fde511bd9a9.jpg',
    ),
    track(
        'Amigdala_KukiraKauRumah',
        'Kukira Kau Rumah',
        'Amigdala',
        'https://i.pinimg.com/736x/fe/cb/46/fecb465913b702bb60da4cc576022cbd.jpg',
    ),
    track(
        'Slank_Maafkan',
        'Maafkan',
        'Slank',
        'https://i.pinimg.com/1200x/f2/f1/2c/f2f12c28eeb4baf7223b771b768a5809.jpg',
    ),


];
