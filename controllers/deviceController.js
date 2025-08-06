import Device from "./models/Device.js";
import { getSocketByDeviceId } from "./../sockets.js"
// Register or update a device (called by MDM-agent)
export const registerDevice = async (req, res) => {
  const { deviceId } = req.body;

  try {
    const device = await Device.findOneAndUpdate(
      { deviceId },
      { lastSeen: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: "Device registered", device });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all devices
export const getAllDevices = async (req, res) => {
  const devices = await Device.find().sort({ lastSeen: -1 });
  res.json(devices);
};

// Lock or unlock a device
export const controlDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { status } = req.body;

  if (!["locked", "unlocked"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    const device = await Device.findOneAndUpdate(
      { deviceId },
      { status },
      { new: true }
    );

    if (!device) return res.status(404).json({ error: "Device not found" });

    // 🔥 Emit socket event to MDM agent
    const socket = getSocketByDeviceId(deviceId);
    if (socket) {
      socket.emit("device-control", { action: status }); // 👈 MDM agent listens to this
    } else {
      console.warn(`No socket connected for device ${deviceId}`);
    }

    res.json({ message: `Device ${status}`, device });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

