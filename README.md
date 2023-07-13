# Documentation

## Installation

1. Download the repository from Git-Hub
2. Downlaod and install the lastest version of Visual Studio Code
3. Download and install Node.js
4. Create a new .env file by copying the .env.example file
5. In the new .env file, add the database link and GitHub Client Authentication
GITHUB_CLIENT_ID="1c0c448d94dd6fc85469"
GITHUB_CLIENT_SECRET="1972da0b3e2377d01d22a51f48bbc425ccf7261e"
6. Install packages with the following command in the terminal: npm install
7. Use npx prisma generate to genereate a new prisma client

8. Start the website with npm run dev
9. open localhost:3000 in your browser

## Project Structure

This paragraph is supposed to give you a rough idea of the projekt strukture. Important files are being listed and described here.

- prisma
  - schema.prisma               
  Contains all models used for data struktures
- src
    - common
        - database
            - ...               
            Contains the schemas of the database tables
        - filter        
            - filter.ts        
             Contains the structure of the filter object
        - validation   
            - validation.ts     
            Contains the schema for the login and signup
        - types.ts              
        Contains the strukture for the optional and mandatory funcitonality
    - components
        - home                  
        Contains the elements of the Home Page
        - overall               
        Contains the baisc elements of the Search
        - search
            - expert            
            Contains the elements unique for the expert search
            - normal            
            Contains the elements unique for the nornmal search
            - header.tsx        
            The Header
            - table.tsx         
            The table being displayed on the expert and normal search
    - pages                     
    Contains all pages used in this project 
    - server
    Backend of the project
        - api
        Contains all api functionality
            - routers
            The controllers managing api requests
            - root.ts
            Used to register api controllers
        - auth.ts
        Used to add providers for authentication
- .env
Contains basic settings for the project

## Tech List

The following list containst all used technologies and their license

- @builder.io/react MIT
- @hookstate/core MIT
- @next-auth/prisma-adapter ISC
- @nextui-org/react MIT
- @prisma/client    Apache-2.0
- @tanstack/react-query MIT
- @trendyol-js/react-carousel MIT
- @trpc/client MIT
- @trpc/next MIT
- @trpc/react-query MIT
- @trpc/server MIT
- @types/crypto-js MIT
- @types/react-native-snap-carousel MIT
- caniuse-lite  CC-BY-4.0
- crypto-js MIT
- next MIT
- next-auth ISC
- react MIT
- react-bootstrap MIT
- react-dom MIT
- react-icons MIT
- react-slick MIT
- slick-carousel MIT
- superjson MIT
- zod MIT
- zod-prisma-types MIT
- @types/eslint MIT
- @types/node MIT
- @types/prettier MIT
- @types/react MIT
- @types/react-dom MIT
- @types/react-slick MIT
- @typescript-eslint/eslint-plugin MIT
- @typescript-eslint/parser BSD-2-Clause
- autoprefixer MIT
- eslint MIT
- eslint-config-next MIT
- postcss MIT
- prettier MIT
- prettier-plugin-tailwindcss MIT
- prisma Apache-2.0
- tailwindcss MIT
- typescript Apache-2.0



