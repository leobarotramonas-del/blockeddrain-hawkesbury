export interface Project { slug: string; title: string; caption: string; width: number; height: number; video?: string; poster?: string; duration?: number; image?: string; silent?: boolean; uploadDate?: string; link?: string; }
export const projects: Project[] = [
  { slug: 'hot-water-replacement', title: 'Hot-water replacement by the wider Antons team', caption: 'The wider Antons Plumbing & Gas team completed this hot-water replacement. The footage shows a grey storage cylinder beside a brick wall, with insulated pipework and valves visible.', width: 540, height: 960, video: 'hot-water-replacement.mp4', poster: 'hot-water-replacement.webp', duration: 8, silent: true, uploadDate: '2026-11-17', link: 'https://antonsplumbingandgas.com.au/service/hot-water-system-replacement/' },
  {
    "slug": "sewer-jetting",
    "title": "Sewer drain jetting",
    "caption": "A technician handles the jetting hose during a sewer drain clearing job.",
    "duration": 12,
    "width": 540,
    "height": 960,
    "video": "sewer-jetting.mp4",
    "poster": "sewer-jetting.webp",
    "silent": true
  },
  {
    "slug": "sewer-clearing",
    "title": "Blocked sewer clearing",
    "caption": "Drainage equipment and hose access are shown around a home during sewer clearing.",
    "duration": 20,
    "width": 540,
    "height": 960,
    "video": "sewer-clearing.mp4",
    "poster": "sewer-clearing.webp",
    "silent": true
  },
  {
    "slug": "drain-overflow-response",
    "title": "Drain overflow response",
    "caption": "A site walkthrough shows the outdoor access route during a blocked drain callout.",
    "duration": 24,
    "width": 540,
    "height": 750,
    "video": "drain-overflow-response.mp4",
    "poster": "drain-overflow-response.webp",
    "silent": true
  },
  {
    "slug": "drain-pipework-installation",
    "title": "Drain pipework installation",
    "caption": "New pipework and a drainage pit are shown during installation beside a boundary wall.",
    "image": "drain-pipework-installation.webp",
    "width": 900,
    "height": 1200
  },
  {
    "slug": "restricted-access-excavation",
    "title": "Excavation beside a home",
    "caption": "A team member excavates a narrow side passage to access underground pipework.",
    "image": "restricted-access-excavation.webp",
    "width": 900,
    "height": 1200
  }
];
