---
id: task-2
title: Manual testing newsletter signups on all sites
status: To Do
assignee: ['@jeff']
created_date: '2025-12-23'
labels: [newsletter, testing, qa]
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Manually test the newsletter signup flow on all 8 websites to verify the user experience works correctly end-to-end. API testing passed, but need human verification of the actual site forms and welcome emails.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Test mycofi.earth newsletter signup - verify form works and welcome email received
- [ ] #2 Test compostcapitalism.xyz newsletter signup
- [ ] #3 Test trippinballs.lol newsletter signup
- [ ] #4 Test undernet.earth newsletter signup
- [ ] #5 Test psilo-cyber.net/ics newsletter signup
- [ ] #6 Test rspace.app newsletter signup
- [ ] #7 Test post-appitalism.app newsletter signup
- [ ] #8 Test alltor.net newsletter signup
- [ ] #9 Verify welcome email content matches expected messages
- [ ] #10 Check that success message displays correctly on each site
<!-- AC:END -->

## Notes

### Test Procedure
1. Visit each site's newsletter signup section
2. Enter a real email address
3. Click Subscribe
4. Verify success message appears on site
5. Check email inbox for welcome email
6. Verify welcome email has correct branding/message

### Expected Welcome Messages

| Site | Expected Message |
|------|------------------|
| MycoFi | "Merge in to the mesh. The mycelium remembers." |
| Compost Capitalism | "Welcome to the heap. Decomposition takes time." |
| Trippin | "The doors are open. Keep trippin'." |
| Undernet | ">_> UnderNet Access Granted. You're part of the underground now." |
| Psilo Cybernetics | "Welcome to a more adaptive future. The network grows." |
| rSpace | "Welcome to (you)rSpace. See you there." |
| Post-Appitalism | "Welcome to the post-app era. Big things loading..." |
| Alltornet | "Connect to the Alltor.net. Something's emerging." |

### API Testing Results (2025-12-23)
All 8 newsletter APIs tested successfully via curl. Subscribers created and welcome emails triggered.
