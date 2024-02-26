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

This paragraph is supposed to give you a rough idea of the projekt strukture. Important files are being listed and described here.

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



