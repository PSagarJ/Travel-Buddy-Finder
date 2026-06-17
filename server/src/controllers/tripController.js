import Trip from '../models/Trip.js';
import User from '../models/User.js';

// POST: Create a new trip
export const createTrip = async (req, res) => {
  try {
    // 1. Log exactly what React is sending us so we aren't flying blind!
    console.log("📥 Incoming Trip Data from React:", req.body); 

    // 2. Create the new trip using our Mongoose schema
    const newTrip = new Trip(req.body);
    
    // 3. Save it to MongoDB
    const savedTrip = await newTrip.save();
    
    console.log("✅ Trip successfully saved to MongoDB!");
    res.status(201).json(savedTrip);
  } catch (error) {
    // 💥 4. If it fails, scream the EXACT error into the terminal
    console.error("❌ CRITICAL ERROR SAVING TRIP:");
    console.error(error.message);
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
};

// GET all trips for the Community Board
export const getAllTrips = async (req, res) => {
  try {
    // .find() grabs all trips from MongoDB
    // .sort({ createdAt: -1 }) ensures the newest trips show up at the top
    const trips = await Trip.find().sort({ createdAt: -1 }); 
    
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};


// GET a single trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching single trip:", error);
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};

// POST: Apply to join a trip
export const applyForTrip = async (req, res) => {
  try {
    const { id } = req.params; // Trip ID
    const { userId } = req.body; // Applicant User ID

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if the user already applied
    const alreadyApplied = trip.applicants.some(app => app.userId === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this trip!' });
    }

    // 💥 FIX 1: Look up the real user details from your database!
    const user = await User.findById(userId);
    const applicantName = user ? user.name : 'Explorer';
    const applicantStyle = user ? user.travelStyle : 'Chill';

    // Push their real info straight into the trip document
    trip.applicants.push({ 
      userId, 
      name: applicantName, 
      travelStyle: applicantStyle, 
      status: 'pending' 
    });
    
    await trip.save();
    res.status(200).json({ message: 'Application successful!', trip });
  } catch (error) {
    console.error("Error applying for trip:", error);
    res.status(500).json({ message: 'Error applying for trip', error: error.message });
  }
};

// PUT: Update application status (Approve / Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // Trip ID
    const { userId, status } = req.body; // 'approved' or 'rejected'

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // 1. Find the applicant inside the subdocument array
    const applicant = trip.applicants.find(app => app.userId === userId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found on this trip' });
    }

    // Update their internal queue status
    applicant.status = status;

    // 💥 FIX 2: Permanently update the approvedMembers array in MongoDB!
    if (status === 'approved') {
      // Ensure they aren't already added to prevent duplicates
      const alreadyApproved = trip.approvedMembers.some(m => m.userId === userId);
      if (!alreadyApproved) {
        trip.approvedMembers.push({
          userId: applicant.userId,
          name: applicant.name
        });
      }
    } else if (status === 'rejected') {
      // If rejected, ensure they are cleared out of the approved pool
      trip.approvedMembers = trip.approvedMembers.filter(m => m.userId !== userId);
    }

    // Save changes completely to MongoDB
    await trip.save();

    res.status(200).json({ message: `Applicant successfully ${status}!`, trip });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

// GET all trips created by a specific user
export const getUserTrips = async (req, res) => {
  try {
    // Find trips where the creatorId matches the ID in the URL
    const trips = await Trip.find({ creatorId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};