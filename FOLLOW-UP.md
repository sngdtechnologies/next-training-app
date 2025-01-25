## Implementation:

**Q) What libraries did you add to the frontend? What are they used for?**  
(Explain any additional libraries or tools you included and their purpose.)

- Day.js (dayjs) : Date and time manipulation.
 
**Q) What libraries did you add to the backend? What are they used for?**  
(Explain any additional libraries or tools for backend functionality and what they are for.)

- Sequelize (sequelize, sequelize-test-helpers) : ORM (Object-Relational Mapping), simplifies database management by mapping tables and relationships to JavaScript/TypeScript models.
- MySQL2 (mysql2) : Connector used in conjunction with Sequelize to execute optimized queries.
- NextAuth (next-auth) : Authentication management within the application.
- Nodemailer (nodemailer, @types/nodemailer) : Send notifications (e.g. when a trainer is assigned to a course) via SMTP (Mailhog in development).
- Yup (yup) : Used to validate data entered by users or transmitted via APIs.
- Jest and Supertest (jest, supertest) : 
    - Jest: Framework for writing unit or integration tests.
    - Supertest: Allows you to test API routes by simulating HTTP requests.
- BCrypt (bcrypt) : Password hashing for users.
- Day.js (dayjs) : Date and time manipulation.

**Q) How does the application handle the assignment of trainers and the email notification feature?**  
(Describe the implementation of the email functionality and how Mailhog was used for testing.)

When assigning a trainer, select the trainer and click on the “Assign Trainer” button. The list starts with trainers matching the same availability and expertise criteria as the course, followed by the rest of the trainers.  Once a trainer has been selected, a check is made to ensure that he or she is available on the course date. The same check is performed when the “Assign Trainer” button is clicked.

**Q) What command do you use to start the application locally?**  
`(Provide the command, e.g., docker-compose up, npm start)`

npm start

and

docker compose up -d --build 'mailhog'

Il faut exécuter le endpoint POST : http://localhost:3000/api/syncDb, pour initialiser la base de donnée

---

## General:

**Q) If you had more time, what improvements or new features would you add?**  
(Discuss any potential enhancements, such as improved UI, new functionalities, etc.)

Here are a few ideas for improvements or new features I could add to this application if I had more time:

### **Potential improvements**

#### **1. User interface (UI)** improvements
- **Full dark mode:**  
  Enhance dark mode to include smooth transitions and accessible colors.
- **Reusable components:**  
  Create a library of reusable UI components (e.g. buttons, forms, cards) with **Tailwind CSS**.
- **Advanced responsiveness:**  
  Test and optimize the application for different devices (mobiles, tablets, computers).
- **Animations and transitions:**  
  Add animations with libraries such as **Framer Motion** to enhance the user experience.

#### **2. Enhanced user functionality**
- **User dashboard:**  
  A personalized dashboard that allows trainers and participants to see:
  - Assigned courses.
  - Course history.
  - Important notifications.
- **User role management:**  
  Implement specific roles (e.g. **Admin**, **Trainer**, **Participant**) with permissions tailored to each role.

#### **3. New features** **Payment management**
- **Payment management:**  
  Integrate a payment solution such as **Stripe** or **PayPal** to enable users to pay directly for their courses.
- **Advanced course planning:**  
  - Add an interactive calendar to display scheduled courses.
  - Automatic email or SMS notifications for reminders.
- **Feedback and evaluations:**  
  Allow participants to evaluate courses and trainers, with a rating system.

#### **4. Backend enhancements**
- **GraphQL API:**  
  Replace or complement REST APIs with a **GraphQL** API for greater request flexibility.
- **WebSockets for real-time notifications:**  
  Use WebSockets or **Pusher** to provide instant notifications (for example, when a trainer is assigned to a course).
- **Better error management:**  
  Add a logging service, such as **Sentry**, to capture and track errors in production.

#### **5. Testing and performance**
- **Comprehensive testing:**  
  - Write integration and end-to-end tests with tools like **Cypress**.
  - Ensure high test coverage to avoid regression.
- **Performance optimization:**  
  - Server-side caching with **Redis** or **Varnish**.
  - Optimize database queries to minimize response times.

#### **6. Internationalization (i18n)**
- **Multilingual support:**  
  Add translations for different languages (e.g. English, French) using **next-i18next**.

**Q) Which parts of the project are you most proud of? Why?**  
(Highlight the parts of the code that you think are most well-written or efficient.)

### **1. Sequelize** model and relationship management
#### Why?
- I used **Sequelize** to model and manage relationships between application entities (such as `Course` and `Trainer`).  
- The code is well structured, clear and maintainable:
  - Use of relationships like `hasMany` and `belongsTo` to model dependencies.
  - Management of foreign key constraints to guarantee data integrity.

#### Example:
```javascript
Trainer.hasMany(Course, { foreignKey: 'trainerId', onDelete: 'CASCADE' });
Course.belongsTo(Trainer, { foreignKey: 'trainerId' });
```
#### Why is this a good thing?
- This design makes complex queries easy to manage (e.g. retrieving a trainer with all his courses).
- Facilitates the transition between local development and production (MySQL or other relational database).

### **2. Robust validation with Yup**
#### Why?
- I integrated **Yup** to manage server-side validations, ensuring that only valid data is processed.
- Use of reusable validation schemas to standardize business logic.

#### Example:
```javascript
export const VCourse = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(5, 'Name must be at least 5 characters long'),
    date: Yup.date().required('Date is required'),
    subject: Yup.string().required('Subject is required'),
    location: Yup.string().required('Location is required'),
    notes: Yup.string()
        .required('Notes is required')
        .min(0, 'Notes must be at least 0 characters long'),
    participants: Yup.number()
        .required('Participants are required'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be at least 0'),
    trainerId: Yup.number().nullable()
});
```

#### Why is this a good thing?
- Simplifies error management (error messages are centralized).
- Improves user experience by returning clear, specific messages.

### **3. Nodemailer** email notifications
#### Why?
- I've implemented logic to send emails when trainers are assigned to courses.
- Used **Mailhog** in development to test emails locally with no impact in production.

#### Example:
```javascript
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
});

export const sendAssignmentEmail = async (trainerEmail: string, courseDetails: any) => {
  const { name, date, location, subject } = courseDetails;

  const mailOptions = {
    from: '"Training Management" <noreply@example.com>',
    to: trainerEmail,
    subject: 'You have been assigned to a course',
    text: `Hello,\n\nYou have been assigned to the following course:\n\nName: ${name}\nDate: ${date}\nLocation: ${location}\nSubject: ${subject}\n\nThank you.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${trainerEmail}`);
};
```

#### Why is this a good thing?
- It's a key feature that enhances the user (trainer) experience.
- The system is scalable to real services like SendGrid in production.

### **4. NextAuth integration for authentication
#### Why?
- I used **NextAuth** to manage authentication with `credentials`.
- The configuration is simple but robust, with JWT-based sessions.

#### Example:
```javascript
async authorize(credentials, req) {
    if (credentials === undefined || !credentials.username || !credentials.password)
        return null;

    try {
        const user = await User.findOne({ where: { username: credentials.username } }) as unknown as IUser;

        if (!user?.password) {
            return null;
        }

        const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (isCorrectPassword) {
            const newUser = {
                ...user
            };
            return newUser as any
        }

        return null;
    } catch (error) {
        return null;
    } finally {
        await sequelize.close();
    }
}
```

#### Why is this a good thing?
- Provides out-of-the-box security and session management.
- Easy to extend for OAuth integration (e.g. Google, GitHub).

#### Why is this a good thing?
- The interface is aesthetically pleasing, responsive and easy to maintain.
- Tailwind CSS's utilitarian approach has reduced the amount of custom CSS required.

**Q) Which parts did you spend the most time on? What did you find most challenging?**  
(Describe any difficulties or complexities you encountered during development.)

### **1. Validation and error handling with Yup**.
#### **Time spent:**
A lot of time was spent dealing with scenarios where invalid data was sent by users.

#### **Challenges encountered:**
- Complex validation with several dependent fields:** 
  Some validations required several fields to be checked at the same time.
- Detailed error feedback:**
  Ensure that the user receives clear messages for each invalid field (e.g. “Name is required”, “Email is invalid”, etc.).

#### **Solution implemented:**
- Use of `abortEarly: false` in Yup to list all errors instead of stopping at the first problem.
- Implemented middleware in Next.js APIs to capture validation errors and return them in a standard format.

### **2. Sending emails using Nodemailer**.
#### **Time spent:**
Configuring **Nodemailer** and integrating it with Mailhog was a critical but time-consuming step.

#### **Difficulties encountered:**
- Connection refused on Mailhog:**
  Initially, the SMTP server (port `1025`) was not accessible, requiring extensive troubleshooting.
- Environment management:**
  Configuring a development solution with Mailhog and providing a different SMTP service for production (like SendGrid) added complexity.

#### **Solution implemented:**
- Local tests with Mailhog to validate functionality.

### **3. Implemented authentication with NextAuth**.
#### **Time spent:**
Integration of NextAuth to manage authentication required in-depth exploration.

#### **Difficulties encountered:**
- Configuring the credentials provider:** 
  Ensure that credentials (username and password) are correctly validated on the server side.
- Authentication error handling:**
  For example, return clear errors for “Invalid username or password” and manage JWT session status.

#### **Implemented solution:**
- Added a custom `authorize` function to validate credentials.
- Implemented simple login functionality with error handling.

**Q) How did you find the test overall? Did you encounter any issues or difficulties completing it?**  
(Provide feedback on the test’s difficulty and any areas that could be clarified or improved.)

I found the test very instructive, and was able to touch on several aspects of backend and frontend development. However, I had difficulty understanding what was required for certain functionalities. With a little thought, I was able to do the best I could.

**Q) Do you have any suggestions on how we can improve the test?**  
(We welcome suggestions to improve the interview process or the structure of the test.)

I suggest a further clarification of the requirements:

- Problem identified: Some parts of the requirements lack precision, which can be confusing, especially for candidates with little experience in specific tools.
- Suggestion: Provide a clear, concise list of the main features expected, e.g.:
    - Mandatory API endpoints.
    - Exact entities to be modeled (e.g. database schema, specific relationships).