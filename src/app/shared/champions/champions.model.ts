export interface Champion {
    id: string;
    name: string;
    key: number;
    blurb: string;
    info: ChampionInfo;
    image: ChampionImage;
    tags: string[];
    title: string;
}

export interface ChampionInfo {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
}

export interface ChampionImage {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
