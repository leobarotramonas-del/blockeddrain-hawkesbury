export const suburbClips = [
  {
    "slug": "excavation-detail",
    "duration": 3,
    "width": 480,
    "height": 400,
    "title": "Excavation work in progress",
    "video": "excavation-detail.mp4",
    "poster": "excavation-detail.webp",
    "silent": true,
    "uploadDate": "2026-11-18T07:36:09Z"
  },
  {
    "slug": "drain-access-setup",
    "duration": 7,
    "width": 480,
    "height": 388,
    "title": "Drain-access equipment on site",
    "video": "drain-access-setup.mp4",
    "poster": "drain-access-setup.webp",
    "silent": true,
    "uploadDate": "2026-11-18T07:36:09Z"
  },
  {
    "slug": "team-on-site",
    "duration": 7,
    "width": 480,
    "height": 848,
    "title": "Meet the team on site",
    "video": "team-on-site.mp4",
    "poster": "team-on-site.webp",
    "silent": true,
    "uploadDate": "2026-11-18T07:36:09Z"
  },
  {
    "slug": "drain-work-montage",
    "duration": 13,
    "width": 480,
    "height": 848,
    "title": "Drainage work and access",
    "video": "drain-work-montage.mp4",
    "poster": "drain-work-montage.webp",
    "silent": true,
    "uploadDate": "2026-11-18T07:36:09Z"
  }
];
export const projectProfiles = {
  "access": {
    "layout": "paired",
    "intro": "Equipment needs a workable route to the drain. These examples show the setup and access involved in the wider team’s Sydney work.",
    "items": [
      {
        "slug": "drain-access-setup",
        "caption": "Drain-access equipment, a hose reel and tools are arranged on a paved driveway beside a home. The setup shows why clear working space matters when planning a drainage visit."
      },
      {
        "slug": "drain-work-montage",
        "caption": "This montage moves between a bathroom, outdoor drain access and the team working around homes. It shows the different spaces that may need to be reached during drainage work."
      }
    ]
  },
  "excavation": {
    "layout": "lead",
    "intro": "Reaching buried pipework can shape a repair plan. This footage from the wider team shows excavation and equipment setup during work across Sydney.",
    "items": [
      {
        "slug": "excavation-detail",
        "caption": "Digging is underway in an open trench beside a brick wall, with an orange hose nearby. The close view shows the space involved in reaching buried pipework."
      },
      {
        "slug": "drain-access-setup",
        "caption": "A hose reel, tools and drain-access equipment sit on wet paving beside the house. Keeping the route to that working area clear helps the team plan equipment access."
      }
    ]
  },
  "planning": {
    "layout": "notes",
    "intro": "A visit starts with the people and equipment needed for the job. These wider-team examples help explain what to discuss when arranging access.",
    "items": [
      {
        "slug": "team-on-site",
        "caption": "A team member introduces the work from a driveway beside a home, with a hose reel and drain-access equipment visible. This is a brief look at the team on site."
      },
      {
        "slug": "excavation-detail",
        "caption": "The camera looks into an open trench while digging continues beside a brick wall. Work is underway, showing the access needed before buried pipework can be reached."
      }
    ]
  },
  "household": {
    "layout": "single",
    "intro": "Indoor symptoms and outdoor access both matter when arranging drain help. This selection shows the wider Antons team working across Sydney homes.",
    "items": [
      {
        "slug": "drain-work-montage",
        "caption": "Equipment appears inside a bathroom before the montage moves outdoors to drain access and the team at work. The scenes show several parts of the working setup around homes."
      }
    ]
  }
};
export const suburbAssignments: Record<string, keyof typeof projectProfiles> = {
  "richmond": "access",
  "windsor": "access",
  "north-richmond": "access",
  "south-windsor": "access",
  "mcgraths-hill": "access",
  "hobartville": "access",
  "pitt-town": "excavation",
  "wilberforce": "excavation",
  "glossodia": "excavation",
  "freemans-reach": "excavation",
  "agnes-banks": "excavation",
  "grose-vale": "planning",
  "bowen-mountain": "planning",
  "yarramundi": "planning",
  "bligh-park": "household",
  "kurrajong": "household"
};
