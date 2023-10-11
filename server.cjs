const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const timeZone = require('./files/timeZone.cjs')

const server = http.createServer((req, res) => {
  // Get the requested URL
  const requestUrl = req.url
  // Set the content type based on the file's extension
  let contentType = 'text/html'
  let filePath = __dirname + requestUrl
  switch (requestUrl) {
    case '/favicon.ico':
      filePath = __dirname + '/General_Images_&_Icons/favicon.png'
      break
    case '/':
      filePath = __dirname + '/files/index.html' // Serve index.html by default
      break
  }
  const extname = path.extname(filePath)
  switch (extname) {
    case '.css':
      filePath = __dirname + '/files' + requestUrl
      contentType = 'text/css'
      break
    case '.js':
      filePath = __dirname + '/files' + requestUrl
      contentType = 'text/javascript'
      break
    case '.svg':
      contentType = 'image/svg+xml'
      break
  }
  // Read the file and serve it with the appropriate content type
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.end('Internal Server Error' + err)
    } else {
      res.setHeader('Content-Type', contentType)
      res.statusCode = 200
      res.end(data)
    }
  })

  let parts = url.parse(req.url)
  if (req.method === 'GET') {
    if (parts.pathname === '/all-timezone-cities') {
      console.log(timeZone.allTimeZones());
      defaultHandler(req,res)
    } 
  }
  if (req.method === 'POST') {
    if (parts.pathname === '/hourly-forecast') {
      console.log(timeZone.allTimeZones());
      postHandler(req,res)
    } 
  }
})

const defaultHandler = (request, response) => {
  response.writeHead(200, {
    "Content-Type": "application/json",
  });
  response.write(
    JSON.stringify({
      weatherResult: timeZone.allTimeZones()
    })
  );
  response.end();
};

const postHandler = (req, res) => {
  console.log(req);
  var body = "";
  req.on("data", function (chunk) {
      body += chunk;
  });

  req.on("end", function(){
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(body);
  });
};

const port = 5002

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
