import Trip from '../models/Trip.js';

export const createTrip = async (req, res) => {
  try {
    const { 
      title, 
      destination, 
      startDate, 
      endDate, 
      estimatedBudget, 
      travelStyle, 
      targetVibe, 
      creatorId // We need to know who is making the trip!
    } = req.body;

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      estimatedBudget,
      travelStyle,
      targetVibe,
      creator: creatorId,
      participants: [creatorId] // The creator is automatically the first participant
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};