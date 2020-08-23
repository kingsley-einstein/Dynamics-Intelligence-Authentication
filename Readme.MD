Dynamics Intelligence Authentication Microservice
==================================================

*Install dependencies:*
```sh
# Shell environment
sudo npm install
```

```batch
<!-- Window's CMD -->
npm install
```

##### Instructions to run service in specific environments

**Note:** This sections assumes you're running on a unix environment. For Windows, check the ` Running in Windows` section

###### Running in development mode

To run the application in development mode, use the following command in the shell environment:
```sh
npm run dev
```
Please refer to the API specification section for routes that are accessible in this app.

###### Running in test mode

To run the application in test mode:
```sh
npm run test:local
```

###### Running in production mode

To run in production mode:
```sh
npm run prod
```

**Important notice:** Please refer to the `.env.sample` file or any of the files prefixed with `.env` for environment variables to be used in any of the modes. These environment variables are important and without them, certain features might not work as desired in every mode. Once you have accessed any of these files, copy their entire content and save them in a `.env` file and edit them if you will as they would be useful in test and development modes. Your production server should have a way of saving or configuring any of these variables.

##### Running in Windows

This section assumes you are running on a Windows environment

###### Running in test mode

To run in test mode on Windows:
```batch
npm run test:windows
```

###### Running in development mode

To run in development mode on Windows:
```batch
npm run dev:windows
```

##### API specification
**Prefix:** /api/v1/auth

**Routes:**
| Route [ METHOD ]               | Parameters                                                                      |
|--------------------------------|---------------------------------------------------------------------------------|
| /create [ POST ]               |body:  <br/><table><tr><td>email</td><td>User's email</td></tr><tr><td>firstName</td><td>User's first name</td></tr><tr><td>lastName</td><td>User's last name</td></tr><tr><td>phoneNumber</td><td>User's phone number</td></tr><tr><td>password</td><td>User's password</td></tr></table>|
| /login [ POST ]                | body: <br/><table><tr><td>email</td><td>User's email</td></tr><tr><td>password</td><td>User's password</td></tr> </table> |
| /verify?token=${token} [ GET ] | query: <br/>  <table><tr><td>token</td><td>Json token generated during registration. Would be sent alongside verification email.</td></tr></table> |
| /request_ver_link [ GET ]      | body: <br/> <table><tr><td>email</td><td>User's email where new verification link would be sent to</td></tr></table> |
| /getloggeduser [ GET ]         | headers: <br/> <table><tr><td>Authorization</td><td>A bearer token generated during login.</td></tr></table> |
| /users [ GET ]                 | null                         |
| /logout [ GET ]                | Same as /getloggeduser above |
| /update [ PATCH ]              | Could be any number of request body parameters that are same as those sent during registration |

**Routes details:**

*/create:* Register a new user.

*/login:* Log a user in.

*/verify:* Verify a new user. This would be sent to user's email for them to click on. Expires in 7 days.

*/request_ver_link:* Request new verification link.

*/getloggeduser:* Get signed in user details along with session id.

*/users:* Get all users.

*/logout:* Log user out.

*/update:* Update user details.