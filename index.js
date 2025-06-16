const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Helper function to get file path
function getFilePath(fileName) {
  return path.join(__dirname, 'files', fileName);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // true = parse query string
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Ensure files directory exists
  const filesDir = path.join(__dirname, 'files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
  }

  // Route: Create File - http://localhost:3000/create?name=test.txt&content=Hello
  if (pathname === '/create') {
    const filePath = getFilePath(query.name);
    fs.writeFile(filePath, query.content || '', (err) => {
      if (err) {
        res.writeHead(500);
        res.end('Error creating file');
      } else {
        res.end(`File '${query.name}' created successfully.`);
      }
    });

  // Route: Read File - http://localhost:3000/read?name=test.txt
  } else if (pathname === '/read') {
    const filePath = getFilePath(query.name);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.end(`Content of '${query.name}':\n${data}`);
      }
    });

  // Route: Delete File - http://localhost:3000/delete?name=test.txt
  } else if (pathname === '/delete') {
    const filePath = getFilePath(query.name);
    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found or cannot delete');
      } else {
        res.end(`File '${query.name}' deleted successfully.`);
      }
    });

  // Route: Home or invalid path
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h2>Simple File Manager</h2>
      <ul>
        <li>Create: /create?name=test.txt&content=Hello</li>
        <li>Read: /read?name=test.txt</li>
        <li>Delete: /delete?name=test.txt</li>
      </ul>
    `);
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
