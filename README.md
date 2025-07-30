# 🏥 **MedFlow**  
*A Role-Based Hospital Management System*

---

## 📌 **Project Overview**

**MedFlow** is a full-stack hospital management system built to optimize clinical workflows.  
It features secure role-based access, appointment tracking, patient records, prescriptions, and administrative tools — all in one unified system.

---

## 🔐 **User Roles & Access**

| Role            | Access Description                                                                 |
|-----------------|-------------------------------------------------------------------------------------|
| **Admin**       | Full access to all features and user management                                     |
| **Doctor**      | Access to all medical features (appointments, history, prescriptions, requests)     |
| **Front Desk**  | Register patients, manage/view appointments, print sick leave/referrals             |
| **Pharmacist**  | View prescriptions, manage dispensing, view schedule                                |
| **Lab Technician** | View and fulfill lab test requests                                              |
| **Radiologist** | View and fulfill imaging requests                                                   |

---

## 📅 **Appointment System**

- Interactive calendar view
- View appointments by **date** or **doctor**
- Color/status indicators: `booked`, `arrived`, `in session`, `finished`, `missed`
- **Live progress bar**: horizontal line moves with time
- Appointment tab **expands downward** if treatment exceeds scheduled time
- Filter by doctor to easily schedule or coordinate care

---

## 👤 **Patient Management**

- Register new patients  
- Search by **name** or **CPR (national ID)**  
- Detailed patient history includes:
  - Subjective symptoms
  - Diagnosis and doctor’s notes
  - Lab/X-ray/imaging requests and past results
  - Treatment plan (with checkbox when completed)
  - Blacklist checkbox for troublesome patients
  - Payment and deposit history
  - Prescription history
  - **Sick leave records** with print options
  - **Referral letters** with print options

---

## 💊 **Pharmacy System**

- Doctor fills:  
  - Drug name  
  - Dose  
  - Administration route  
  - Frequency  
  - Duration  
- Prescription includes **price**
- Patient must pay at the pharmacy
- Save favorite prescriptions (e.g., *RCT Pain Meds*)
  - Example: Amoxicillin 500mg, orally, 3x/day, 5 days

---

## 💰 **Payments & Billing**

- Check patient’s previous deposits
- Show amount to pay after visit
- Payment types: `Insurance` or `Cash`

---

## 📝 **Printable Documents**

- **Sick Leave** (doctor, front desk, admin access)
  - Accessed via patient page  
  - Includes date, reason, and duration
- **Referral Letter**
  - To refer to another doctor or hospital
  - Auto-filled with patient details  
- Both are **printable**

---

## 👁️ **Visibility Enhancements**

- Front desk can filter appointments by doctor
- See full schedules of all doctors or one at a time
- Patient registration page supports:
  - Selecting or searching doctor by name

---

## 🛠️ **Technologies Used**

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT  
- **Frontend**: JSX (React Views)  
- **Styling**: CSS  
- **Testing**: Jest, MongoMemoryServer  
- **Dev Tools**: dotenv, method-override

---

## 🚀 **Installation**

```bash
git clone https://github.com/your-username/medflow.git
cd medflow
npm install

[trello](https://trello.com/invite/b/688a0dc6e23fd2ef696076f3/ATTIf3a0f4bcbfefd56ee812642ea935679e73A26229/medflow)

### 🛣️ Route Table – MedFlow

#### 🔐 Authentication

| Method | Route       | Description              | Access             |
|--------|-------------|--------------------------|--------------------|
| GET    | `/`         | Home/Login page          | Public             |
| GET    | `/register` | Registration form        | Public             |
| POST   | `/register` | Handle registration      | Public             |
| GET    | `/login`    | Login form               | Public             |
| POST   | `/login`    | Handle login             | Public             |
| POST   | `/logout`   | Logout user              | Authenticated users |

#### 👥 User & Role Management

| Method | Route              | Description           | Access |
|--------|--------------------|-----------------------|--------|
| GET    | `/users`           | List all users        | Admin  |
| PATCH  | `/users/:id/role`  | Change user role      | Admin  |
| DELETE | `/users/:id`       | Delete a user         | Admin  |

#### 🧑‍⚕️ Patient Management

| Method | Route                          | Description                          | Access              |
|--------|---------------------------------|--------------------------------------|---------------------|
| GET    | `/patients`                    | Search patients                      | All roles           |
| GET    | `/patients/:id`                | View patient medical history         | Doctor, Front Desk  |
| POST   | `/patients/new`                | Register new patient                 | Front Desk, Doctor  |
| PATCH  | `/patients/:id/edit`           | Update patient information           | Doctor              |
| PATCH  | `/patients/:id/blacklist`      | Mark patient as blacklisted          | Doctor, Admin       |

#### 📅 Appointment Scheduling

| Method | Route                                | Description                          | Access             |
|--------|---------------------------------------|--------------------------------------|--------------------|
| GET    | `/appointments`                      | View all appointments                | All roles          |
| GET    | `/appointments/future`               | View future appointments             | Doctor, Front Desk |
| GET    | `/appointments/calendar`             | Filter appointments by date/doctor   | All roles          |
| POST   | `/appointments/new`                  | Create new appointment               | Front Desk         |
| PATCH  | `/appointments/:id/status`           | Update appointment status            | Doctor, Front Desk |
| GET    | `/appointments/:id`                  | View appointment details             | All roles          |

#### 🩺 Medical Records

| Method | Route                             | Description                        | Access     |
|--------|------------------------------------|------------------------------------|------------|
| GET    | `/records/:patientId`             | View patient records               | Doctor, Admin, Front Desk |
| POST   | `/records/:patientId/new`         | Add new record                     | Doctor     |

#### 💊 Pharmacy

| Method | Route                                 | Description                                      | Access     |
|--------|----------------------------------------|--------------------------------------------------|------------|
| GET    | `/pharmacy`                           | Search patient prescription by CPR              | Pharmacist |
| POST   | `/prescriptions/:patientId/new`       | Doctor creates prescription                     | Doctor     |
| GET    | `/prescriptions/:id`                  | View prescription details                       | Pharmacist |
| GET    | `/prescriptions/favorites`            | View favorite prescriptions                     | Doctor     |
| POST   | `/prescriptions/favorites`            | Save favorite prescription                      | Doctor     |

#### 🧾 Billing & Payments

| Method | Route                        | Description                               | Access         |
|--------|-------------------------------|-------------------------------------------|----------------|
| GET    | `/billing/:patientId`        | Show payment info, deposits               | All roles      |
| POST   | `/billing/:patientId/pay`    | Pay with insurance or cash                | Front Desk     |

#### 🧪 Lab & Imaging

| Method | Route                          | Description                     | Access              |
|--------|---------------------------------|----------------------------------|---------------------|
| POST   | `/requests/new`                | Create lab/X-ray request         | Doctor              |
| GET    | `/requests`                    | View all lab/imaging requests   | Lab Tech, Radiologist |
| PATCH  | `/requests/:id`                | Upload result                   | Lab Tech, Radiologist |

#### 📄 Sick Leave & Referral Letters

| Method | Route                                    | Description                           | Access                    |
|--------|-------------------------------------------|---------------------------------------|---------------------------|
| GET    | `/print/sick-leave/:patientId`           | Print sick leave                      | Doctor, Front Desk, Admin |
| GET    | `/sick-leaves/:patientId`                | View sick leave history               | Doctor, Admin             |
| GET    | `/print/referral/:patientId`             | Print referral letter                 | Doctor, Admin             |

#### ⚙️ Admin Panel

| Method | Route              | Description         | Access |
|--------|--------------------|---------------------|--------|
| GET    | `/admin/dashboard` | System overview     | Admin  |
| GET    | `/admin/logs`      | View logs & metrics | Admin  |
