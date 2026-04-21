require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const MentorshipRequest = require('./models/MentorshipRequest');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Opportunity.deleteMany({});
    await MentorshipRequest.deleteMany({});

    const users = await User.create([
      // Admin
      { name: 'Admin User', email: 'admin@alumnisphere.com', password: 'password123', role: 'admin', headline: 'Platform Administrator', skills: ['Management', 'Analytics'], industry: 'Technology', course: 'MBA in IT', location: 'San Francisco, USA', avatar: '', bio: 'Managing AlumniSphere platform.', experience: 10, company: 'AlumniSphere', graduationYear: 2010 },
      
      // Alumni - CSE / IT
      { name: 'Priya Sharma', email: 'priya@alumni.com', password: 'password123', role: 'alumni', headline: 'Senior Software Engineer at Google', skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'System Design'], industry: 'Technology', course: 'B.Tech Computer Science (CSE)', location: 'Bangalore, India', bio: 'Passionate about mentoring the next generation of engineers.', experience: 8, company: 'Google', graduationYear: 2016 },
      { name: 'Sneha Reddy', email: 'sneha@alumni.com', password: 'password123', role: 'alumni', headline: 'Full Stack Developer at Netflix', skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'], industry: 'Technology', course: 'B.Tech Information Technology', location: 'Pune, India', bio: 'Code, coffee, repeat.', experience: 4, company: 'Netflix', graduationYear: 2020 },
      { name: 'Divya Gupta', email: 'divya@alumni.com', password: 'password123', role: 'alumni', headline: 'Engineering Manager at Meta', skills: ['Leadership', 'System Design', 'React', 'Node.js', 'Mentoring'], industry: 'Technology', course: 'B.Tech Computer Science (CSE)', location: 'London, UK', bio: 'Leading teams to build impactful products.', experience: 12, company: 'Meta', graduationYear: 2012 },

      // Alumni - Mechanical / Civil
      { name: 'Rajesh Khanna', email: 'rajesh@alumni.com', password: 'password123', role: 'alumni', headline: 'Senior Mechanical Engineer at Tesla', skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics', 'Manufacturing'], industry: 'Automotive', course: 'B.Tech Mechanical Engineering', location: 'Fremont, USA', bio: 'Designing the future of sustainable transport.', experience: 9, company: 'Tesla', graduationYear: 2015 },
      { name: 'Siddharth Rao', email: 'siddharth@alumni.com', password: 'password123', role: 'alumni', headline: 'Project Manager at L&T Construction', skills: ['Project Management', 'Structural Analysis', 'AutoCAD Civil 3D'], industry: 'Construction', course: 'B.Tech Civil Engineering', location: 'Mumbai, India', bio: 'Building infrastructure that lasts generations.', experience: 11, company: 'L&T Construction', graduationYear: 2013 },

      // Alumni - ECE / Electrical
      { name: 'Amit Kumar', email: 'amit@alumni.com', password: 'password123', role: 'alumni', headline: 'Hardware Design Engineer at Intel', skills: ['VLSI Design', 'Verilog', 'Embedded Systems', 'IoT'], industry: 'Electronics', course: 'B.Tech Electronics & Comm. (ECE)', location: 'Santa Clara, USA', bio: 'Pushing the boundaries of chip design.', experience: 6, company: 'Intel', graduationYear: 2018 },
      { name: 'Neha Singh', email: 'neha@alumni.com', password: 'password123', role: 'alumni', headline: 'Telecom Architect at Ericsson', skills: ['5G Networks', 'Wireless Comm', 'Signal Processing'], industry: 'Telecommunications', course: 'M.Tech ECE', location: 'Stockholm, Sweden', bio: 'Connecting the world through advanced telecom architecture.', experience: 8, company: 'Ericsson', graduationYear: 2016 },

      // Alumni - Data / Business / Design
      { name: 'Vikram Singh', email: 'vikram@alumni.com', password: 'password123', role: 'alumni', headline: 'Data Scientist at Amazon', skills: ['Python', 'Machine Learning', 'Deep Learning', 'SQL', 'TensorFlow'], industry: 'Technology', course: 'M.Tech Data Science', location: 'Delhi, India', bio: 'Turning data into insights.', experience: 7, company: 'Amazon', graduationYear: 2017 },
      { name: 'Rahul Verma', email: 'rahul@alumni.com', password: 'password123', role: 'alumni', headline: 'Product Manager at Microsoft', skills: ['Product Management', 'Agile', 'Data Analytics', 'Strategy'], industry: 'Technology', course: 'MBA in Marketing', location: 'Hyderabad, India', bio: 'Building products that matter.', experience: 6, company: 'Microsoft', graduationYear: 2018 },
      { name: 'Ananya Patel', email: 'ananya@alumni.com', password: 'password123', role: 'alumni', headline: 'UX Designer at Apple', skills: ['UI/UX', 'Figma', 'Design Systems', 'User Research'], industry: 'Design', course: 'B.Des User Experience', location: 'Sydney, Australia', bio: 'Design is not just what it looks like, it is how it works.', experience: 5, company: 'Apple', graduationYear: 2019 },

      // Students
      { name: 'Arjun Kumar', email: 'arjun@student.com', password: 'password123', role: 'student', headline: 'Computer Science Student at IIT Madras', skills: ['React', 'JavaScript', 'Python', 'Java'], industry: 'Technology', course: 'B.Tech Computer Science (CSE)', location: 'Chennai, India', bio: 'Aspiring software engineer looking for mentorship.', experience: 0, graduationYear: 2025 },
      { name: 'Rohan Mehta', email: 'rohan@student.com', password: 'password123', role: 'student', headline: 'Mechanical Engineering Student at MIT', skills: ['AutoCAD', 'SolidWorks', 'Robotics'], industry: 'Automotive', course: 'B.Tech Mechanical Engineering', location: 'Boston, USA', bio: 'Fascinated by robotics and automation.', experience: 0, graduationYear: 2025 },
      { name: 'Kavya Nair', email: 'kavya@student.com', password: 'password123', role: 'student', headline: 'ECE Student at NIT Trichy', skills: ['Embedded Systems', 'IoT', 'C++'], industry: 'Electronics', course: 'B.Tech Electronics & Comm. (ECE)', location: 'Trichy, India', bio: 'Electronics enthusiast keen on IoT projects.', experience: 0, graduationYear: 2026 },
      { name: 'Tariq Ali', email: 'tariq@student.com', password: 'password123', role: 'student', headline: 'Civil Engineering Student at SRM', skills: ['AutoCAD Civil 3D', 'Project Management'], industry: 'Construction', course: 'B.Tech Civil Engineering', location: 'Chennai, India', bio: 'Looking to learn about modern structural engineering.', experience: 0, graduationYear: 2026 },
      { name: 'Meera Joshi', email: 'meera@student.com', password: 'password123', role: 'student', headline: 'Data Science Master\'s Student', skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'], industry: 'Technology', course: 'M.S. Data Science', location: 'New York, USA', bio: 'Passionate about AI and big data analytics.', experience: 0, graduationYear: 2025 },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create opportunities
    const opps = await Opportunity.create([
      { title: 'Frontend Engineer Intern', company: 'Google', description: 'Join our team to build world-class web applications using React and modern JavaScript. Work closely with senior engineers.', type: 'internship', skills: ['React', 'JavaScript', 'TypeScript'], location: 'Bangalore, India', salary: '₹80,000/month', postedBy: users[1]._id },
      { title: 'Mechanical Design Engineer', company: 'Tesla', description: 'Work on cutting-edge EV component design. Experience with CAD required.', type: 'job', skills: ['SolidWorks', 'Manufacturing', 'Thermodynamics'], location: 'Fremont, USA', salary: '$110,000/year', postedBy: users[4]._id },
      { title: 'Civil Site Engineer', company: 'L&T Construction', description: 'Supervise large scale commercial infrastructure projects.', type: 'job', skills: ['Project Management', 'Structural Analysis'], location: 'Mumbai, India', salary: '₹8-12 LPA', postedBy: users[5]._id },
      { title: 'VLSI Design Intern', company: 'Intel', description: 'Assist in designing and verifying digital circuits for next-gen processors.', type: 'internship', skills: ['Verilog', 'VLSI Design', 'Embedded Systems'], location: 'Santa Clara, USA', salary: '$6,000/month', postedBy: users[6]._id },
      { title: 'Product Management Associate', company: 'Microsoft', description: 'Drive product strategy and work with cross-functional teams to ship features.', type: 'job', skills: ['Product Management', 'Agile', 'Analytics'], location: 'Hyderabad, India', salary: '₹18-25 LPA', postedBy: users[9]._id },
      { title: 'UX Design Intern', company: 'Apple', description: 'Help design intuitive user experiences for Apple products. Portfolio required.', type: 'internship', skills: ['UI/UX', 'Figma', 'User Research'], location: 'Sydney, Australia', salary: '$5,000/month', postedBy: users[10]._id },
      { title: 'ML Engineer', company: 'Amazon', description: 'Build and deploy machine learning models at scale for e-commerce personalization.', type: 'job', skills: ['Python', 'Machine Learning', 'AWS', 'TensorFlow'], location: 'Delhi, India', salary: '₹25-40 LPA', postedBy: users[8]._id },
      { title: 'Freelance AutoCAD Drafter', company: 'BuildRight Architects', description: 'Need an experienced drafter for residential floor plans.', type: 'freelance', skills: ['AutoCAD', 'Structural Analysis'], location: 'Remote', salary: '₹25,000 per project', postedBy: users[5]._id },
      { title: 'IoT Systems Developer', company: 'Ericsson', description: 'Develop embedded software for smart city networking infrastructure.', type: 'job', skills: ['C++', 'IoT', 'Wireless Comm'], location: 'Stockholm, Sweden', salary: '€60,000/year', postedBy: users[7]._id },
    ]);

    console.log(`✅ Created ${opps.length} opportunities`);

    // Create some mentorship connections
    await MentorshipRequest.create([
      { from: users[11]._id, to: users[1]._id, status: 'accepted', message: 'Hello Priya, I am a CSE student aiming for FAANG. Would love your guidance on DSA and React!' }, // Arjun (CSE) -> Priya (Google)
      { from: users[12]._id, to: users[4]._id, status: 'accepted', message: 'Hi Rajesh! As a Mechanical engineering student at MIT, I deeply admire your work at Tesla. Could you share some insights on EV design?' }, // Rohan (Mech) -> Rajesh (Tesla)
      { from: users[13]._id, to: users[6]._id, status: 'pending', message: 'Hi Amit, I am pursuing ECE and want to get into core hardware roles like Intel. Seeking your mentorship!' }, // Kavya (ECE) -> Amit (Intel)
      { from: users[14]._id, to: users[5]._id, status: 'accepted', message: 'Dear Siddharth, I am studying Civil Engineering and would like to learn about project management in large construction firms like L&T.' }, // Tariq (Civil) -> Siddharth (L&T)
      { from: users[15]._id, to: users[8]._id, status: 'pending', message: 'Hello Vikram, I am doing my Master\'s in Data Science and looking for tips to crack Amazon ML interviews.' }, // Meera (Data) -> Vikram (Amazon)
    ]);

    // Add connections for accepted mentorships
    await User.findByIdAndUpdate(users[11]._id, { $addToSet: { connections: [users[1]._id] } });
    await User.findByIdAndUpdate(users[1]._id, { $addToSet: { connections: [users[11]._id] } });
    
    await User.findByIdAndUpdate(users[12]._id, { $addToSet: { connections: [users[4]._id] } });
    await User.findByIdAndUpdate(users[4]._id, { $addToSet: { connections: [users[12]._id] } });

    await User.findByIdAndUpdate(users[14]._id, { $addToSet: { connections: [users[5]._id] } });
    await User.findByIdAndUpdate(users[5]._id, { $addToSet: { connections: [users[14]._id] } });

    console.log('✅ Created mentorship requests and connections');
    console.log('\n🎉 Seed complete! Sample logins:');
    console.log('  Admin:   admin@alumnisphere.com / password123');
    console.log('  Alumni (CSE):  priya@alumni.com / password123');
    console.log('  Student (CSE): arjun@student.com / password123');
    console.log('  Student (Mech): rohan@student.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
