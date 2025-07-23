import { faker } from '@faker-js/faker';

// Helper function to generate a random roll number
const generateRollNumber = (index) => {
  const year = faker.date.between({ from: '2021-01-01', to: '2024-12-31' }).getFullYear();
  const department = 'EUCI';
  const rollNum = String(index).padStart(3, '0');
  return `${year}${department}${rollNum}`;
};

// Generate fake students data
export const generateStudents = (count = 50) => {
  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  const batches = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'];
  const statuses = ['active', 'inactive', 'discontinued'];
  
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const student = {
      id: i,
      name: faker.person.fullName(),
      roll_number: generateRollNumber(i),
      email: faker.internet.email(),
      phone: faker.phone.number('##########'),
      department: faker.helpers.arrayElement(departments),
      batch: faker.helpers.arrayElement(batches),
      address: faker.location.streetAddress({ useFullAddress: true }),
      date_of_birth: faker.date.between({ from: '2000-01-01', to: '2006-12-31' }).toISOString().split('T')[0],
      gender: faker.person.sex(),
      parent_name: faker.person.fullName(),
      parent_phone: faker.phone.number('##########'),
      blood_group: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      status: faker.helpers.arrayElement(statuses),
      admission_date: faker.date.between({ from: '2021-01-01', to: '2024-08-31' }).toISOString().split('T')[0],
      gpa: parseFloat(faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 })),
      semester: faker.number.int({ min: 1, max: 8 }),
      photo_url: `assets/students/student_${i}.jpg` // Placeholder photo path
    };
    students.push(student);
  }
  
  return students;
};

// Generate fake faculty data
export const generateFaculty = (count = 20) => {
  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const specializations = [
    'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Cybersecurity',
    'Software Engineering', 'Computer Networks', 'Database Systems', 'Human Computer Interaction'
  ];
  
  const faculty = [];
  
  for (let i = 1; i <= count; i++) {
    const facultyMember = {
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      employee_id: `FAC${String(i).padStart(3, '0')}`,
      department: faker.helpers.arrayElement(departments),
      designation: faker.helpers.arrayElement(designations),
      phone: faker.phone.number('##########'),
      office: `Room ${faker.number.int({ min: 101, max: 599 })}`,
      qualification: faker.helpers.arrayElement(['Ph.D', 'M.Tech', 'M.E', 'M.S']),
      experience: faker.number.int({ min: 1, max: 25 }) + ' years',
      specialization: faker.helpers.arrayElement(specializations),
      courses_teaching: faker.helpers.arrayElements([
        'Data Structures', 'Algorithms', 'Database Management', 'Web Development',
        'Mobile App Development', 'Computer Networks', 'Operating Systems', 'Software Engineering'
      ], { min: 2, max: 4 }),
      photo_url: `assets/faculty/faculty_${i}.jpg`
    };
    faculty.push(facultyMember);
  }
  
  return faculty;
};

// Generate fake courses data
export const generateCourses = (count = 30) => {
  const courseNames = [
    'Data Structures and Algorithms', 'Database Management Systems', 'Computer Networks',
    'Operating Systems', 'Software Engineering', 'Web Development', 'Mobile App Development',
    'Machine Learning', 'Artificial Intelligence', 'Cybersecurity Fundamentals',
    'Computer Graphics', 'Digital Signal Processing', 'Microprocessors', 'VLSI Design',
    'Control Systems', 'Power Electronics', 'Communication Systems', 'Embedded Systems',
    'Structural Analysis', 'Fluid Mechanics', 'Thermodynamics', 'Manufacturing Processes',
    'Engineering Mathematics', 'Physics', 'Chemistry', 'Environmental Engineering',
    'Project Management', 'Technical Communication', 'Ethics in Engineering', 'Entrepreneurship'
  ];
  
  const courses = [];
  
  for (let i = 1; i <= count; i++) {
    const course = {
      id: i,
      course_code: `CS${String(i).padStart(3, '0')}`,
      course_name: courseNames[i - 1] || faker.lorem.words(3),
      credits: faker.helpers.arrayElement([2, 3, 4]),
      semester: faker.number.int({ min: 1, max: 8 }),
      department: faker.helpers.arrayElement(['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil']),
      faculty_id: faker.number.int({ min: 1, max: 20 }),
      description: faker.lorem.paragraph()
    };
    courses.push(course);
  }
  
  return courses;
};

// Generate fake announcements
export const generateAnnouncements = (count = 15) => {
  const types = ['general', 'academic', 'event', 'urgent', 'holiday'];
  const priorities = ['low', 'medium', 'high'];
  
  const announcements = [];
  
  for (let i = 1; i <= count; i++) {
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const announcementDate = new Date();
    announcementDate.setDate(announcementDate.getDate() - daysAgo);
    
    const announcement = {
      id: i,
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      content: faker.lorem.paragraphs(2),
      type: faker.helpers.arrayElement(types),
      priority: faker.helpers.arrayElement(priorities),
      created_by: faker.person.fullName(),
      created_at: announcementDate.toISOString(),
      is_active: faker.datatype.boolean({ probability: 0.8 }),
      target_audience: faker.helpers.arrayElement(['all', 'students', 'faculty'])
    };
    announcements.push(announcement);
  }
  
  return announcements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// Generate fake attendance records
export const generateAttendance = (studentCount = 50, courseCount = 30) => {
  const attendance = [];
  const statuses = ['present', 'absent', 'late'];
  
  for (let studentId = 1; studentId <= studentCount; studentId++) {
    for (let courseId = 1; courseId <= Math.min(6, courseCount); courseId++) {
      // Generate attendance for last 30 days
      for (let day = 0; day < 30; day++) {
        const attendanceDate = new Date();
        attendanceDate.setDate(attendanceDate.getDate() - day);
        
        // Skip weekends
        if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;
        
        const record = {
          id: attendance.length + 1,
          student_id: studentId,
          course_id: courseId,
          date: attendanceDate.toISOString().split('T')[0],
          status: faker.helpers.arrayElement(statuses),
          marked_by: faker.number.int({ min: 1, max: 20 }),
          marked_at: attendanceDate.toISOString()
        };
        attendance.push(record);
      }
    }
  }
  
  return attendance;
};

// Generate fake grades
export const generateGrades = (studentCount = 50, courseCount = 30) => {
  const grades = [];
  const gradeValues = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
  const examTypes = ['midterm', 'final', 'quiz', 'assignment', 'project'];
  
  for (let studentId = 1; studentId <= studentCount; studentId++) {
    for (let courseId = 1; courseId <= Math.min(6, courseCount); courseId++) {
      // Generate multiple grades per course
      for (let examType of examTypes.slice(0, 3)) {
        const grade = {
          id: grades.length + 1,
          student_id: studentId,
          course_id: courseId,
          exam_type: examType,
          marks: faker.number.int({ min: 40, max: 100 }),
          max_marks: 100,
          grade: faker.helpers.arrayElement(gradeValues),
          credits: faker.helpers.arrayElement([2, 3, 4]),
          date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString().split('T')[0],
          remarks: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
        };
        grades.push(grade);
      }
    }
  }
  
  return grades;
};

// Generate fake timetable
export const generateTimetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-13:15',
    '14:00-15:00', '15:00-16:00', '16:15-17:15'
  ];
  
  const courses = [
    'Data Structures', 'Database Management', 'Computer Networks', 'Operating Systems',
    'Software Engineering', 'Web Development', 'Machine Learning', 'Algorithms'
  ];
  
  const timetable = {};
  
  days.forEach(day => {
    timetable[day] = {};
    timeSlots.forEach(slot => {
      if (Math.random() > 0.3) { // 70% chance of having a class
        timetable[day][slot] = {
          subject: faker.helpers.arrayElement(courses),
          faculty: faker.person.fullName(),
          room: `Room ${faker.number.int({ min: 101, max: 599 })}`,
          type: faker.helpers.arrayElement(['Lecture', 'Lab', 'Tutorial'])
        };
      }
    });
  });
  
  return { timetable };
};

// Generate fake calendar events
export const generateCalendarEvents = (year = 2025, month = 7) => {
  const events = [];
  const eventTypes = ['exam', 'holiday', 'event', 'deadline', 'meeting'];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    if (Math.random() > 0.7) { // 30% chance of having an event
      const event = {
        id: events.length + 1,
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        title: faker.lorem.words({ min: 2, max: 5 }),
        description: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(eventTypes),
        time: faker.helpers.maybe(() => `${faker.number.int({ min: 9, max: 17 })}:${faker.helpers.arrayElement(['00', '30'])}`, { probability: 0.7 })
      };
      events.push(event);
    }
  }
  
  return {
    year,
    month,
    events: events.sort((a, b) => new Date(a.date) - new Date(b.date))
  };
};

// Generate all fake data
export const generateAllFakeData = () => {
  const students = generateStudents(50);
  const faculty = generateFaculty(20);
  const courses = generateCourses(30);
  const announcements = generateAnnouncements(15);
  const attendance = generateAttendance(50, 30);
  const grades = generateGrades(50, 30);
  const timetable = generateTimetable();
  const calendar = generateCalendarEvents();
  
  return {
    students: { students },
    faculty: { faculty },
    courses: { courses },
    announcements: { announcements },
    attendance: { attendance },
    grades: { grades },
    timetable,
    calendar
  };
};
