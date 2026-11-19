# Frequently Asked Questions

### Does Orbit store passwords in plain text?
No. All user passwords are salted and hashed using bcrypt with work factor 12.

### Are Agent Studio tokens shared with the client?
Never. All external requests are mediated server-to-server by Orbit Node.

### How are foreign user IDs mapped?
Orbit uses `orbit-user-<userId>` deterministic references to prevent cross-account impersonation.
