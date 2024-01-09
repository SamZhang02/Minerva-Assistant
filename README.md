# Minerva-Assistant

Automated browser tool to help you automate course registration on Minerva.

## Dependencies 

Make sure to download the dependencies with 

```javascript
npm i 
```

## Configurations

Add your desired courses' CRN and the timeout duration (milliseconds) between every round of registration in `config.json`.


## Running

Run the program with

```
npm run start
```

It will prompt you into Minerva's login page. Given that Minerva uses 2FA, the first login must be done manually. 
Make sure to select Yes on the "Stay Signed In?" page, as the application runs subsequently on the same browser with login information cached.

The default timeout for every round of registration is 2 minutes. 

## Disclaimers

This program does not check for whether registration was successful, it simply automates the filling and submissions of CRN in quick add/drop.

The author is not responsible for any kind of rate limit, IP ban, or other potential consequences from using this program.
