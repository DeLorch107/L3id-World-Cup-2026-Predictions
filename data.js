// ============================================================
// FIFA WORLD CUP 2026 — ALL DATA
// ============================================================

const GROUPS = {
  A: { name: 'A', teams:[ { name: 'Mexico', code: 'MX', flag: '🇲🇽', conf: 'CONCACAF' }, { name: 'South Africa', code: 'ZA', flag: '🇿🇦', conf: 'CAF' }, { name: 'South Korea', code: 'KR', flag: '🇰🇷', conf: 'AFC' }, { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', conf: 'UEFA' } ] },
  B: { name: 'B', teams:[ { name: 'Canada', code: 'CA', flag: '🇨🇦', conf: 'CONCACAF' }, { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦', conf: 'UEFA' }, { name: 'Qatar', code: 'QA', flag: '🇶🇦', conf: 'AFC' }, { name: 'Switzerland', code: 'CH', flag: '🇨🇭', conf: 'UEFA' } ] },
  C: { name: 'C', teams:[ { name: 'Brazil', code: 'BR', flag: '🇧🇷', conf: 'CONMEBOL' }, { name: 'Morocco', code: 'MA', flag: '🇲🇦', conf: 'CAF' }, { name: 'Haiti', code: 'HT', flag: '🇭🇹', conf: 'CONCACAF' }, { name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf: 'UEFA' } ] },
  D: { name: 'D', teams:[ { name: 'United States', code: 'US', flag: '🇺🇸', conf: 'CONCACAF' }, { name: 'Paraguay', code: 'PY', flag: '🇵🇾', conf: 'CONMEBOL' }, { name: 'Australia', code: 'AU', flag: '🇦🇺', conf: 'AFC' }, { name: 'Turkey', code: 'TR', flag: '🇹🇷', conf: 'UEFA' } ] },
  E: { name: 'E', teams:[ { name: 'Germany', code: 'DE', flag: '🇩🇪', conf: 'UEFA' }, { name: 'Curaçao', code: 'CW', flag: '🇨🇼', conf: 'CONCACAF' }, { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', conf: 'CAF' }, { name: 'Ecuador', code: 'EC', flag: '🇪🇨', conf: 'CONMEBOL' } ] },
  F: { name: 'F', teams:[ { name: 'Netherlands', code: 'NL', flag: '🇳🇱', conf: 'UEFA' }, { name: 'Japan', code: 'JP', flag: '🇯🇵', conf: 'AFC' }, { name: 'Sweden', code: 'SE', flag: '🇸🇪', conf: 'UEFA' }, { name: 'Tunisia', code: 'TN', flag: '🇹🇳', conf: 'CAF' } ] },
  G: { name: 'G', teams:[ { name: 'Belgium', code: 'BE', flag: '🇧🇪', conf: 'UEFA' }, { name: 'Egypt', code: 'EG', flag: '🇪🇬', conf: 'CAF' }, { name: 'Iran', code: 'IR', flag: '🇮🇷', conf: 'AFC' }, { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', conf: 'OFC' } ] },
  H: { name: 'H', teams:[ { name: 'Spain', code: 'ES', flag: '🇪🇸', conf: 'UEFA' }, { name: 'Cape Verde', code: 'CV', flag: '🇨🇻', conf: 'CAF' }, { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', conf: 'AFC' }, { name: 'Uruguay', code: 'UY', flag: '🇺🇾', conf: 'CONMEBOL' } ] },
  I: { name: 'I', teams:[ { name: 'France', code: 'FR', flag: '🇫🇷', conf: 'UEFA' }, { name: 'Senegal', code: 'SN', flag: '🇸🇳', conf: 'CAF' }, { name: 'Iraq', code: 'IQ', flag: '🇮🇶', conf: 'AFC' }, { name: 'Norway', code: 'NO', flag: '🇳🇴', conf: 'UEFA' } ] },
  J: { name: 'J', teams:[ { name: 'Argentina', code: 'AR', flag: '🇦🇷', conf: 'CONMEBOL' }, { name: 'Algeria', code: 'DZ', flag: '🇩🇿', conf: 'CAF' }, { name: 'Austria', code: 'AT', flag: '🇦🇹', conf: 'UEFA' }, { name: 'Jordan', code: 'JO', flag: '🇯🇴', conf: 'AFC' } ] },
  K: { name: 'K', teams:[ { name: 'Portugal', code: 'PT', flag: '🇵🇹', conf: 'UEFA' }, { name: 'DR Congo', code: 'CD', flag: '🇨🇩', conf: 'CAF' }, { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', conf: 'AFC' }, { name: 'Colombia', code: 'CO', flag: '🇨🇴', conf: 'CONMEBOL' } ] },
  L: { name: 'L', teams:[ { name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA' }, { name: 'Croatia', code: 'HR', flag: '🇭🇷', conf: 'UEFA' }, { name: 'Ghana', code: 'GH', flag: '🇬🇭', conf: 'CAF' }, { name: 'Panama', code: 'PA', flag: '🇵🇦', conf: 'CONCACAF' } ] }
};

const GROUP_NAMES = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// Round of 32 official FIFA fixed matchups
const R32_FIXED = [
  { id: 'm73', teamA: { group:'A', pos:'2nd' }, teamB: { group:'B', pos:'2nd' }, label:'Match 73' },
  { id: 'm74', teamA: { group:'E', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'A/B/C/D/F' }, label:'Match 74' },
  { id: 'm75', teamA: { group:'F', pos:'1st' }, teamB: { group:'C', pos:'2nd' }, label:'Match 75' },
  { id: 'm76', teamA: { group:'C', pos:'1st' }, teamB: { group:'F', pos:'2nd' }, label:'Match 76' },
  { id: 'm77', teamA: { group:'I', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'C/D/F/G/H' }, label:'Match 77' },
  { id: 'm78', teamA: { group:'E', pos:'2nd' }, teamB: { group:'I', pos:'2nd' }, label:'Match 78' },
  { id: 'm79', teamA: { group:'A', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'C/E/F/H/I' }, label:'Match 79' },
  { id: 'm80', teamA: { group:'L', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'E/H/I/J/K' }, label:'Match 80' },
  { id: 'm81', teamA: { group:'D', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'B/E/F/I/J' }, label:'Match 81' },
  { id: 'm82', teamA: { group:'G', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'A/E/H/I/J' }, label:'Match 82' },
  { id: 'm83', teamA: { group:'K', pos:'2nd' }, teamB: { group:'L', pos:'2nd' }, label:'Match 83' },
  { id: 'm84', teamA: { group:'H', pos:'1st' }, teamB: { group:'J', pos:'2nd' }, label:'Match 84' },
  { id: 'm85', teamA: { group:'B', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'E/F/G/I/J' }, label:'Match 85' },
  { id: 'm86', teamA: { group:'J', pos:'1st' }, teamB: { group:'H', pos:'2nd' }, label:'Match 86' },
  { id: 'm87', teamA: { group:'K', pos:'1st' }, teamB: { group:null, pos:'3rd', pool:'D/E/I/J/L' }, label:'Match 87' },
  { id: 'm88', teamA: { group:'D', pos:'2nd' }, teamB: { group:'G', pos:'2nd' }, label:'Match 88' },
];

// R16 Official Matchups — FIXED: each pair on its own line, no merged lines
const R16_PAIRS = [
  ['m73', 'm75'], // Match 89
  ['m74', 'm77'], // Match 90
  ['m76', 'm78'], // Match 91
  ['m79', 'm80'], // Match 92
  ['m83', 'm84'], // Match 93
  ['m81', 'm82'], // Match 94
  ['m86', 'm88'], // Match 95
  ['m85', 'm87'], // Match 96
];

// QF Official Pairs — FIXED: each pair on its own line, no merged lines
const QF_PAIRS = [
  ['r16_0', 'r16_1'], // Match 97
  ['r16_2', 'r16_3'], // Match 98
  ['r16_4', 'r16_5'], // Match 99
  ['r16_6', 'r16_7'], // Match 100
];

// SF Pairs
const SF_PAIRS = [
  ['qf_0', 'qf_1'], // Match 101
  ['qf_2', 'qf_3'], // Match 102
];
