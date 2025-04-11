const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Contract = require('./models/Contract');
const Payable = require('./models/Payable');
const Countdown = require('./models/Countdown');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Endpoints

// Initialize contracts and payables
app.get('/api/initialize', async (req, res) => {
  try {
    const categories = ['Parity', 'Sapre', 'Bcone', 'Emerd'];
    for (let category of categories) {
      let contract = await Contract.findOne({ category });
      if (!contract) {
        contract = new Contract({ category });
        await contract.save();
      }
      let payable = await Payable.findOne({ category });
      if (!payable) {
        payable = new Payable({ category });
        await payable.save();
      }
    }
    res.status(200).json({ message: 'Initialized contracts and payables' });
  } catch (error) {
    console.error('Error initializing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all contracts and payables
app.get('/api/initialize', async (req, res) => {
  try {
    const categories = ['Parity', 'Sapre', 'Bcone', 'Emerd'];
    for (let category of categories) {
      let contract = await Contract.findOne({ category });
      if (!contract) {
        contract = new Contract({ category });
        await contract.save();
      }
      let payable = await Payable.findOne({ category });
      if (!payable) {
        payable = new Payable({ category });
        await payable.save();
      }
    }
    res.status(200).json({ message: 'Initialized contracts and payables' });
  } catch (error) {
    console.error('Error initializing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add contract money and update payables
app.post('/api/contract', async (req, res) => {
  try {
    const { category, option, amount } = req.body;
    if (!['Parity', 'Sapre', 'Bcone', 'Emerd'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const adjustedAmount = Math.floor(amount * 0.98);
    let updateField = {};
    switch (option) {
      case 'Join Green':
        updateField.greenContract = adjustedAmount;
        break;
      case 'Join Red':
        updateField.redContract = adjustedAmount;
        break;
      case 'Join Violet':
        updateField.violetContract = adjustedAmount;
        break;
      default:
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(option)) {
          updateField[`contract${option}`] = adjustedAmount;
        } else {
          return res.status(400).json({ error: 'Invalid option' });
        }
    }

    const contract = await Contract.findOneAndUpdate(
      { category },
      { $inc: updateField },
      { new: true, upsert: true }
    );

    const updatedContract = await Contract.findOne({ category });
    const payableUpdates = {
      payable0: Math.floor((updatedContract.redContract * 1.5) + (updatedContract.violetContract * 4.5) + (updatedContract.contract0 * 9)),
      payable1: Math.floor((updatedContract.greenContract * 2) + (updatedContract.contract1 * 9)),
      payable2: Math.floor((updatedContract.redContract * 2) + (updatedContract.contract2 * 9)),
      payable3: Math.floor((updatedContract.greenContract * 2) + (updatedContract.contract3 * 9)),
      payable4: Math.floor((updatedContract.redContract * 2) + (updatedContract.contract4 * 9)),
      payable5: Math.floor((updatedContract.greenContract * 1.5) + (updatedContract.violetContract * 4.5) + (updatedContract.contract5 * 9)),
      payable6: Math.floor((updatedContract.redContract * 2) + (updatedContract.contract6 * 9)),
      payable7: Math.floor((updatedContract.greenContract * 2) + (updatedContract.contract7 * 9)),
      payable8: Math.floor((updatedContract.redContract * 2) + (updatedContract.contract8 * 9)),
      payable9: Math.floor((updatedContract.greenContract * 2) + (updatedContract.contract9 * 9)),
    };

    const payable = await Payable.findOneAndUpdate(
      { category },
      { $set: payableUpdates },
      { new: true, upsert: true }
    );

    res.status(200).json({ contract, payable });
  } catch (error) {
    console.error('Error adding contract:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset all contracts and payables
app.post('/api/reset', async (req, res) => {
  try {
    await Contract.updateMany({}, {
      greenContract: 0, redContract: 0, violetContract: 0,
      contract0: 0, contract1: 0, contract2: 0, contract3: 0, contract4: 0,
      contract5: 0, contract6: 0, contract7: 0, contract8: 0, contract9: 0,
    });
    await Payable.updateMany({}, {
      payable0: 0, payable1: 0, payable2: 0, payable3: 0, payable4: 0,
      payable5: 0, payable6: 0, payable7: 0, payable8: 0, payable9: 0,
    });
    res.status(200).json({ message: 'All contracts and payables reset' });
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get or set countdown end time
app.get('/api/countdown', async (req, res) => {
  try {
    let countdown = await Countdown.findOne();
    const now = Date.now();
    if (!countdown || countdown.endTime <= now) {
      const newEndTime = now + 180000; // 3 minutes
      if (!countdown) {
        countdown = new Countdown({ endTime: newEndTime });
      } else {
        countdown.endTime = newEndTime;
      }
      await countdown.save();
    }
    res.status(200).json({ endTime: countdown.endTime });
  } catch (error) {
    console.error('Error fetching countdown:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});