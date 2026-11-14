# GAC Advisors Security Specification & Invariants

## Phase 0: Data Invariants
1. **User Identity & Role Separation**: User roles (`super_admin`, `staff`, `client`) cannot be self-escalated. New registrants are strictly assigned `client`. Admins are verified against `/admins/{uid}` document existence.
2. **Client Isolation**: Clients can only read and write their own applications, documents, appointments, and payments (`clientId == request.auth.uid`).
3. **Internal Notes Confidentiality**: Internal notes `/internal_notes/{id}` can only be read or written by verified staff or super admin. Under no circumstances can a client access internal notes.
4. **Staff Assignment Scoping**: Staff members can only update applications and review documents assigned to them or unassigned in initial review.
5. **Super Admin Authority**: Super admin (`akashjaffri72@gmail.com` and records in `/admins/{uid}`) has full governance over all collections, services catalog, and company settings.
6. **Immutable Key Enforcement**: Critical relational keys such as `id`, `clientId`, `applicationId`, and `createdAt` are immutable on update.
7. **Document Review Integrity**: Document status changes to `approved` or `rejected` can only be performed by staff or admin, not by the client who uploaded the file.

## The Dirty Dozen Security Payloads
1. **Payload 1 (Self-Privilege Escalation)**: Client registers and sends `{ role: "super_admin" }` to `/users/{uid}`. -> REJECTED.
2. **Payload 2 (Ghost Field Injection)**: Client sends `{ isVerified: true, fakeAdmin: true }` in profile update. -> REJECTED.
3. **Payload 3 (Cross-Client Read)**: Client A attempts to `get` `/applications/{appIdB}` where `clientId == ClientB`. -> REJECTED.
4. **Payload 4 (Client Reads Internal Notes)**: Client queries `/internal_notes` or accesses an internal note document. -> REJECTED.
5. **Payload 5 (Client Approves Own Document)**: Client sends `{ status: "approved" }` on their own document record. -> REJECTED.
6. **Payload 6 (Unauthorized Service Editing)**: Non-admin user tries to modify `/services/{serviceId}` fee or details. -> REJECTED.
7. **Payload 7 (Orphan Application Creation)**: Unauthenticated or mismatched user creates application with spoofed `clientId`. -> REJECTED.
8. **Payload 8 (Large Payload / Wallet Exhaustion)**: Attacker attempts to write a 1MB junk string to `trackingNumber` or `title`. -> REJECTED.
9. **Payload 9 (Unauthenticated Read)**: Public unauthenticated request attempts to list `/documents` or `/users`. -> REJECTED.
10. **Payload 10 (Client Marks Payment Verified)**: Client attempts to update a payment record to `{ status: "verified" }`. -> REJECTED.
11. **Payload 11 (Staff Modifies Company Settings)**: Regular staff member attempts to modify `/company_settings/main`. -> REJECTED.
12. **Payload 12 (Direct Admin Document Creation)**: Normal client attempts to write their own UID directly to `/admins/{uid}`. -> REJECTED.
