# Backend-user
Backend user

# pgAdmin setup

This looks daunting, but it's not too bad. I just really tried to cut it out so it should be as simple as possible.

1. Download pgAdmin (https://www.pgadmin.org/).

2. Download postgresgl (https://www.postgresql.org/download/).

3. You probably need to restart your computer here.

4. Make sure you have a .env file. If you don't currently have one, ask someone for it or create one yourself later, there should be a guide somewhere in this file. You'll just have to come up with your own name and password in some of these steps if you create your own.

5. Open pgAdmin and right-click on the ***Servers*** icon. In the new tab, under ***Register***, click ***Server***.

6. The name can be whatever, that's just for your own organizing.

7. At the top, there are multiple tabs, one of which is ***Connection***. Click on that.

8. There you want to add what matches with *DATABASE_IP* in the .env file in the ***Host name/address*** field.

9. Remember to set the password further down in the ***connection*** tab. This can be whatever, though you will need to remeber for your own sake.

10. Just hit ***save*** and you're through the first part. Some computers will get an error here, most likely macOS, I can't help you there, sooooo... good luck!

11. In the new server we've just made, fold it out and right-click on the "Login/Group Roles". Under ***Create***, click on ***Login/Group Role...***.

12. Set the name to match the *DATABASE_USER* from the .env file.

13. Go to the ***Definition*** tab at the top to set the password. This should match the *DATABASE_PASSWORD* from the .env file.

14. Go to the next tab at the top, ***Privileges***, where you'll set it to check the ***Superuser*** and the ***Can login***.

15. Click ***save***. Almost done.

16. Fold out the ***Databases*** tab and right-click the postgres tab and select ***Properties***.

17. Go to the ***Security*** tab at the top and under the ***Privileges*** click on the plus all the way to the right.

18. In the new item that was just created, select the user we just created (the *DATABASE_USER* from the .env).

19. In the field in the middle that is empty, the ***Privileges*** column, click it and tick the box for ***ALL***.

20. Then click ***save***. That should be it :D.


# Backend setup

1. If you haven't already, make sure to setup pgAdmin.

2. Make sure you have NodeJS installed (https://nodejs.org/en/download).

3. First, run the command ***npm install***. This should download all dependencies.

4. Make sure you have a .env file in your root folder before you go onto the next step. If you don't have one, you can ask someone for one or make one pretty easily. I'll write a short tutorial for it.

5. (This step not strictly necessary, but it's good to know). Run the command ***npx prisma generate --schema=./prisma/schema.prisma***. This is to update the prisma schema if any changes was made to it from you (or the person who pushed code previously changed it and forgot run this command).

6. You then need to run this command ***npx prisma migrate dev***. This will migrate the prisma schema to the database we made in pgAdmin. You'll be promted to write something, this just like a commit message on github, so you can track changes later.

7. You can open a visual interface to interact with the database through the command ***npx prisma studio***.


# .env file

1. To setup the environment parameters, you'll first need to make the .env file.

2. Create a file called *.env* in the root folder for the project.

3. In this folder there (currently) only strictly need to be one line *DATABASE_URL*, but that line is kinda complicated, so lets make it a bit more simple.

4. First lets create the line *DATABASE_USER*. This should be the name of the ***Login/Group roles*** we set in pgAdmin. Let's say that would be *test_user* so the line would look like *DATABASE_USER = 'test_user'*.

5. The next line should be the password (*DATABASE_PASSWORD*) we set for the user we created in ***Login/Group roles***. Let's say that would be *0000* so the line would look like *DATABASE_PASSWORD = '0000'*.

6. Then the line *DATABASE_IP*. This should be the ***Host name/address*** we set in pgAdmin. Let's say that would be *localhost* so the line would look like *DATABASE_IP = 'localhost'*.

7. The next line should be *DATABASE_PORT* which is the port for the server. This one we didn't touch in the guide while creating the database server (unless you of course changed it). The default is *5432*, so the line would look like *DATABASE_PORT = '5432'*.

8. The next line should be *DATABASE_NAME*. We didn't touch this one either and the default name is *postgres*, so the line would look like *DATABASE_NAME = 'postgres'*.

9. The final line for the database setup, which is essentially the only line that is strictly nessesary, is a combination of them all. The parameter is *DATABASE_URL* and starts with *postgresql://* just as a standard. Then attached to that should be the user the server should use to interact with the database, which should have the structure of the value of the *DATABASE_USER* followed by a *:* and the *DATABASE_PASSWORD*. Then should be the path to the endpoint for the database. This should start with an *@* symbol followed by the value of the *DATABASE_IP* followed by a *:* and then the value of *DATABASE_PORT*, then a */* and lastly the value of *DATABASE_NAME*. The round it of we'll need to attach *?schema=public* to the end. I know this is confusing, but the end result with the examples I've used should look like: *'postgresql://test_user:0000@localhost:5432/postgres?schema=public'*



