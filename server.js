const express = require('express');
const cors = require('cors');
const { execFile, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

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

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Spidey script runner listening on http://localhost:${PORT}`);
});
