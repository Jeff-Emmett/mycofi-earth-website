---
id: task-1
title: Integrate newsletter across all myco-themed websites
status: Done
assignee: ['@claude']
created_date: '2025-12-04 10:23'
completed_date: '2025-12-23'
labels: [newsletter, infrastructure]
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up consistent newsletter integration across all myco-themed sites and related properties. Using Listmonk (self-hosted) with custom newsletter-api for immediate welcome emails.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Newsletter service selected and configured (Listmonk + newsletter-api)
- [x] #2 mycofi.earth has newsletter signup
- [x] #3 mycopunk.xyz has newsletter signup
- [x] #4 Subscriber lists unified or properly segmented (8 separate lists)
<!-- AC:END -->

## Notes

Newsletter integration completed for all 8 sites:
- MycoFi (mycofi.earth)
- Compost Capitalism (compostcapitalism.xyz)
- Trippin (trippinballs.lol)
- Undernet (undernet.earth)
- Psilo Cybernetics (psilo-cyber.net/ics)
- rSpace (rspace.app)
- Post-Appitalism (post-appitalism.app)
- Alltornet (alltor.net)

### Implementation Details

- **Newsletter Service**: Listmonk v5.1.0 (self-hosted at newsletter.jeffemmett.com)
- **API Layer**: Custom FastAPI newsletter-api service handles subscription + immediate welcome email
- **Welcome Messages**: Each site has unique on-brand welcome message
- **Opt-in**: Single opt-in (immediate subscription, no confirmation required)

### Welcome Messages by Site

| Site | Message |
|------|---------|
| MycoFi | "Merge in to the mesh. The mycelium remembers." |
| Compost Capitalism | "Welcome to the heap. Decomposition takes time." |
| Trippin | "The doors are open. Keep trippin'." |
| Undernet | ">_> UnderNet Access Granted. You're part of the underground now." |
| Psilo Cybernetics | "Welcome to a more adaptive future. The network grows." |
| rSpace | "Welcome to (you)rSpace. See you there." |
| Post-Appitalism | "Welcome to the post-app era. Big things loading..." |
| Alltornet | "Connect to the Alltor.net. Something's emerging." |

All repos pushed and API tested successfully on 2025-12-23.
