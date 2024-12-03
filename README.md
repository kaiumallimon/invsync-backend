# Invsync

`InvSync` is an inventory management system, designed to help business track, manage and organize inventory effectively.

### Features
1. Login/Registration
2. Add new items
3. Update existing product
4. Delete existing product
5. Search products
6. View inventory
7. Generate operation report (log)

### Project Structure

```bash
[invsync]-->
            src/
                config/ #contains the configerations
                features/ #contains features
                models/ #contains mongodb models
                utils/ #conains util functions
                index.js #server startup file
                server.js #express server configerations file
            .env
            .gitignore
            package-lock.json
            package.json
            README.md

```

### Prerequisites
- Latest version of node.js and npm installed and configured on your pc.

## Get Started

1. Open terminal and hit the command below to clone the repository:

```bash
git clone https://github.com/kaiumallimon/invsync.git
```

2. Go to the directory and open with an editor (i.e. vs code):

```bash
cd invsync
code .
```

3. Install the necessary dependencies 

```bash
npm install
```

4. Configure a `.env` file

```bash
MONGODB_URI = your_mongo_url_string
PORT = 3000
SESSION_SECRET = your_complex_session_secret
```

5. Run the server manually with each changes

```bash
node src/index.js
```

or with `nodemon` for auto refresh the server with any changes:

```bash
npm i nodemon -g # install nodemon
nodemon src/index.js 
```


**Happy Coding Buddy! 😊✨**