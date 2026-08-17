const express = require('express');
const cors = require('cors');
const { execFile, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { MongoClient } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/api/run-script', (req, res) => {
  const { script } = req.body;
  if (!script) {
    return res.status(400).json({ error: 'No script provided' });
  }

  // Write script to a temp file and execute it
  const tmpFile = path.join(os.tmpdir(), `spidey-script-${Date.now()}.sh`);
  fs.writeFileSync(tmpFile, script, { mode: 0o755 });

  execFile('/bin/bash', [tmpFile], {
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, HOME: os.homedir() },
  }, (error, stdout, stderr) => {
    // Clean up temp file
    try { fs.unlinkSync(tmpFile); } catch {}

    res.json({
      success: !error,
      stdout: stdout || '',
      stderr: stderr || '',
      exitCode: error?.code ?? 0,
      error: error?.message ?? null,
    });
  });
});

app.post('/api/mongo-aggregate', async (req, res) => {
  const { mongoUrl, database, collection, pipeline } = req.body || {};
  if (!mongoUrl || !database || !collection || !Array.isArray(pipeline)) {
    return res.status(400).json({ error: 'mongoUrl, database, collection, and pipeline (array) are required.' });
  }

  let client;
  try {
    client = new MongoClient(mongoUrl);
    await client.connect();
    const results = await client.db(database).collection(collection).aggregate(pipeline).toArray();
    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Spidey script runner listening on http://localhost:${PORT}`);
});
