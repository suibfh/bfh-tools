// BFH API型定義

export interface Hero {
  hero_id: number;
  hero_type_id: number;
  level: number;
  hp: number;
  phy: number;
  int: number;
  agi: number;
  spr: number;
  def: number;
  rarity: number;
  brave_burst_id?: number;
  art_skill_id?: number;
  ex_ascension_phase?: number;
  ex_ascension_level?: number;
}

export interface Sphere {
  sphere_id: number;
  sphere_type_id: number;
  level: number;
  rarity: number;
  skill_ids: number[];
}

export interface UserInfo {
  uid: number;
  name: string;
  wallet_address: string;
  level: number;
  exp: number;
  total_win: number;
  total_lose: number;
  guild_id?: number;
  guild_name?: string;
  has_land: boolean;
}

export interface RankMatchHistory {
  uid: number;
  win: number;
  lose: number;
  rate: number;
  results: RankMatchResult[];
  opponent: {
    at: string;
    uids: number[];
  };
}

export interface RankMatchResult {
  at: string;
  battle_id: number;
  win: boolean;
  attacker: number;
  defender: number;
  new_rate: number;
  last_rate: number;
  added_damage: number;
  taken_damage: number;
  win_uft: number;
}
