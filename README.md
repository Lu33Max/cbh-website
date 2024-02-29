# Documentation

## Installation

1. Clone the Git repository: Open your command-line interface (e.g., Terminal) and navigate to the directory where you want to download the project. Then, run the following command to clone the repository:

```
git clone <repository-url>
```


2. Navigate to the project directory: Once the repository is cloned, navigate to the project directory using the following command:

```
cd <project-directory>
```


3. Install Node.js: Ensure that you have Node.js installed on your machine. If you haven't installed it already, follow these steps:

    1. Visit the official Node.js website [https://nodejs.org](https://nodejs.org) in your web browser.
    2. Download the appropriate version of Node.js for your operating system (e.g., Windows, macOS, Linux).
    3. Run the installer and follow the on-screen instructions to complete the installation.

4. Install project dependencies: Run the following command to install the project dependencies specified in the `package.json` file:
```
npm install
```
This command will download and install all the required libraries and dependencies mentioned in the `package.json` file.

5. Configure environment variables: If your project requires any environment variables (such as API keys or database credentials), make sure to set them up in the `.env` file.

6. Start the project: Once the dependencies are installed, start the project using the appropriate command.

```
npm run dev
```

7. Access the project: After starting the project, open your web browser and navigate to the URL provided by the project, which is [http://localhost:3000].


## Project Structure

This paragraph is supposed to give you a rough idea of the projekt structure. Important files are being listed and described here.

- prisma
  - schema.prisma               
  Contains all models used for data structures
    - generated
    contains automatically generated files from the database; Types or schemes for the database entries
    - zod
    contains schema for the entries, users, filters and everything

- public
    - Contains all graphics, logos and pictures 

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

    - context
        - cart.tsx
        - settigs.tsx

    - pages                     
        - Contains all pages used in this project 

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

    - styles
    contains style of the pages

    - utils
    contains smaller scripts that are used again and again in different places

- .env
    - Contains basic settings for the project 

## Tech List

The following list containst all used technologies and their license

- @hookstate/core@4.0.1                     MIT
- @next-auth/prisma-adapter@1.0.7           ISC
- @nextui-org/react@1.0.0-beta.9-dbg2       MIT
- @preact/signals-react@1.3.8               MIT
- @prisma/client@4.16.2                     Apache-2.0
- @tanstack/react-query@4.36.1              MIT
- @trendyol-js/react-carousel@3.0.2         MIT
- @trpc/client@10.45.1                      MIT
- @trpc/next@10.45.1                        MIT
- @trpc/react-query@10.45.1                 MIT
- @trpc/server@10.45.1                      MIT
- @types/crypto-js@4.2.2                    MIT
- @types/eslint@8.56.3                      MIT
- @types/node@18.19.18                      MIT
- @types/prettier@2.7.3                     MIT
- @types/react-dom@18.2.19                  MIT
- @types/react-native-snap-carousel@3.8.10  MIT
- @types/react-slick@0.23.13                MIT
- @types/react@18.2.58                      MIT
- @typescript-eslint/eslint-plugin@5.62.0   MIT
- @typescript-eslint/parser@5.62.0          BSD-2-Clause
- autoprefixer@10.4.17                      MIT
- caniuse-lite@1.0.30001589                 CC-BY-4.0
- crypto-js@4.2.0                           MIT
- eslint-config-next@13.5.6                 MIT
- eslint@8.57.0                             MIT
- next-auth@4.24.6                          ISC
- next@13.5.6                               MIT
- postcss@8.4.35                            MIT
- prettier-plugin-tailwindcss@0.2.8         MIT
- prettier@2.8.8                            MIT
- prisma@4.16.2                             Apache-2.0
- react-bootstrap@2.10.1                    MIT
- react-dom@18.2.0                          MIT
- react-icons@4.12.0                        MIT
- react-slick@0.29.0                        MIT
- react@18.2.0                              MIT
- slick-carousel@1.8.1                      MIT
- superjson@1.12.2                          MIT
- tailwindcss@3.4.1                         MIT
- typescript@5.3.3                          Apache-2.0
- zod-prisma-types@2.8.1                    MIT
- zod@3.22.4                                MIT



