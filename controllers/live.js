import Live from "../models/Live.js";

export const createLive = async (req, res) => {
  try {
    const { name, liveLink, coverPhoto } = req.body;

    const live = new Live({
      name,
      liveLink,
      coverPhoto,
      status: "active",
    });

    await live.save();

    return res.json({ live });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const finishLive = async (req, res) => {
  try {
    const live = await Live.findById(req.params.id);

    if (!live) {
      return res.status(404).json({ msg: "Live not found" });
    }

    live.status = "inactive";
    await live.save();

    return res.json({ msg: "Live finished successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

export const deleteLive = async (req, res) => {
  try {
    const live = await Live.findById(req.params.id);

    if (!live) {
      return res.status(404).json({ msg: "Live not found" });
    }

    await live.remove();

    return res.json({ msg: "Live deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

export const getLiveHistory = async (req, res) => {
  try {
    const liveHistory = await Live.find({ status: "inactive" }).sort({
      date: -1,
    });

    return res.json(liveHistory);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

export const getActiveLive = async (req, res) => {
  try {
    const activeLive = await Live.findOne({ status: "active" });

    if (!activeLive) {
      return res.status(404).json({ msg: "No active live found" });
    }

    return res.json(activeLive);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};
