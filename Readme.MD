Dynamics Intelligence Authentication Microservice
==================================================
##### API specification
**Prefix:** /api/v1/auth

**Routes:**
| Route   | Parameters |
|---------|-----------------|
| /create |body: <br/><table><tr><td>email</td><td>User's email</td></tr><tr><td>firstName</td><td>User's first name</td></tr><tr><td>lastName</td><td>User's last name</td></tr><tr><td>phoneNumber</td><td>User's phone number</td></tr><tr><td>password</td><td>User's password</td></tr></table>|
| /login