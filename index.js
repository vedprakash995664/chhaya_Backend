const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require('./Routes/adminRoutes');
app.use('/api/admin', adminRoutes);


const StaffHeadRoutes = require('./Routes/staffHeadRoutes');
app.use('/api/staff-heads', StaffHeadRoutes);


const PreVisaRoutes = require('./Routes/PreVisaRoutes');
app.use('/api/pre-visa', PreVisaRoutes);

const InterviewManager = require('./Routes/InterviewManagerRoute');
app.use('/api/interview-manager', InterviewManager);

const FinalVisaRoutes = require('./Routes/FinalVisaRoutes');
app.use('/api/final-visa', FinalVisaRoutes);

const SMMRoutes = require('./Routes/smmRoute');
app.use('/api/smm', SMMRoutes);


const ContactsRoutes = require('./Routes/ContactRoutes');
app.use('/api/contact', ContactsRoutes);
const PaymentBook = require('./Routes/PaymentBookRoutes');
app.use('/api/payment', PaymentBook);


const CallingTeam = require('./Routes/callingTeamRoutes');
app.use('/api/calling-team', CallingTeam);


const ClientForm = require('./Routes/CLientFormRoutes');
app.use('/api/client-form', ClientForm);




//settings/zone


const ZoneRoutes = require('./Routes/SettingsRoutes/ZoneRoutes');
app.use('/api/setting/zone', ZoneRoutes);


app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
