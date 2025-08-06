import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// In-memory storage of commands (you can later use MongoDB)
const deviceCommands = new Map();

app.use(cors());
app.use(express.json());

// Endpoint the device polls
app.get('/mdm/command', (req, res) => {
  const deviceId = req.query.id || 'default';

  const command = deviceCommands.get(deviceId) || 'none';
  console.log(`Device ${deviceId} polled. Sending command: ${command}`);

  // Reset command to avoid repeated execution
  deviceCommands.set(deviceId, 'none');

  res.json({ command });
});

// Admin can send a command to lock/unlock a device
app.post('/mdm/command', (req, res) => {
  const { deviceId, command } = req.body;

  if (!deviceId || !['lock', 'unlock'].includes(command)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  deviceCommands.set(deviceId, command);
  console.log(`Set command for device ${deviceId}: ${command}`);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`✅ MDM Server running at http://localhost:${port}`);
});
