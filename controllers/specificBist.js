import axios from "axios";
import Bist from "./../models/Bist.js";

export const specificBist = async (req, res) => {
  const hisse = req.params.id;
  try {
    const bist = await Bist.find({ hisse: hisse.toUpperCase() });
    res.status(200).json(bist);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
