# Mobile Web Specialist Certification Course

---
#### _1st Stage of Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

### Instructions
#### For view only 
0. Clone repo
    ```
    git clone https://github.com/Zydnar/mws-restaurant-stage-1.git
    ```
1. Set your working directory to /public folder inside project
    ```
    $ cd ./public
    ```
2. Run server of your choice
    ```
    //Python 2.x
    python -m SimpleHTTPServer
    //Python 3.x
    python -m http.server
    //Ruby
    ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 8000, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"
    //node.js
    npm install http-server -g
    http-server . -p 8000
    //php
    php -S localhost:8000
    ```
#### For develop purpose
0. Follow instructions from "For view only" section
1. Install dependencies
    ```
    yarn
    ```
    Or if you're using npm
    ```
    npm install
    ```
