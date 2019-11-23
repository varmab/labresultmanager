This program downloads hl7 files from a secure ftp, parsing the hl7 files then fetching the values and insert them into tables.
# Node modules to be installed before running the program
	1. Run: "npm install"
	2. Run: "npm i forever -g"
# To run the program
	1. Open command prompt from inside the folder with the file service.js
	2- Run command to run forever: "forever start service.js"
	3. Run command to run one time: "node service.js"
    4. To check the logs, open "combined.log" file
    5. To check the error logs, open "error.log" file
	6. To get the list of servers running: "forever list"
    7. To stop server run "forever stop 0"
# To update credentials of secure sftp and database
	1. Open ".env" file.
	2. In the .env file, simply update the values of SFTP and Database credentials.

# To change freequency of schedule
    1. Simply goto end of "service.js" file
    2. You can find the cron job set for every 10-mins (eg: "*/10 * * * *")
    3. Eg: To change the freequency to 5-mins modify it to "*/5 * * * *"
    
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    |
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    
    
## Process of checking the printable report pdf
    1. Updated PrintableReport in xrxQuestResultTransaction with binary generated from base64 string.
    2. Implemented creteFile function, to create pdf file with PrintableReport binary.
    3. You can find it under project root folder with the name "binary_result.pdf". You can see it once the program is executed successfully.