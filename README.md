## EduLearn
**Next-Generation Multi-Tenant Learning Management System (LMS)**

An organization-first LMS built to bridge the gap between **Teachers, Students, and Parents**. Featuring granular Role-Based Access Control (RBAC), cohort grouping, customizable assessment rules, and dedicated parental monitoring loops.

 
Key Features

**Multi-Tenant Architecture:** Users do not just create generic accounts; they register under verified **Organizations** (Schools, Bootcamps, or Universities), keeping data strictly compartmentalized.
**Deep Curriculum Hierarchy:** Teachers can author structured learning tracks: $$\text{Organization} \longrightarrow \text{Modules} \longrightarrow \text{Topics} \longrightarrow \text{Assessments}$$
**Advanced Test Engine:** Create highly configurable assessments. Support custom constraints per test, including **hard time limits, maximum retry thresholds, auto-grading, and cooldown periods** between retakes.
**Cohort & Group Management:** Group students into distinct classes (e.g., *"Fall 2026 - CS101 Section A"*). Teachers can bulk-assign Modules or specific Tests to an entire cohort with a single action.
**The "Parent Loop" Portal:** Give parents visibility without giving them system control. Dedicated read-only dashboards tracking a student's attendance, test attempt histories, score trajectories, and overdue topics.
**Strict RBAC Security:** Hard API authorization boundaries. Teachers hold CRUD authority over content; Students consume and submit; Parents monitor; Org Admins govern the tenant.

---

Role & Permissions Matrix

| Capability | Org Admin | Teacher | Student | Parent |
| :--- | :---: | :---: | :---: | :---: |
| **Create / Edit Modules & Topics** | ✅ | ✅ | ❌ | ❌ |
| **Configure Test Rules & Timers** | ✅ | ✅ | ❌ | ❌ |
| **Take Assessments** | ❌ | ❌ | ✅ | ❌ |
| **View Group Analytics** | ✅ | ✅ (Assigned Groups) | ❌ | ❌ |
| **View Student Score Report** | ✅ | ✅ | ✅ (Self Only) | ✅ (Linked Child Only) |

---

 Domain Relationship Model

```text
       ┌────────────────────────────────────────────────────────┐
       │                      ORGANIZATION                      │
       └─────┬───────────────────────┬────────────────────┬─────┘
             │                       │                    │
        (Employs)               (Enrolls)             (Registers)
             │                       │                    │
             ▼                       ▼                    ▼
        [ Teacher ]             [ Student ] ◄──(Links)──► [ Parent ]
             │                       │
         (Authors)             (Assigned To)
             │                       │
             ▼                       ▼
        [ Module ] ────────────► [ Group ]
             │
             ├─► Topic 1..N
             └─► Test (Timer: 45m | Retries: 2)
