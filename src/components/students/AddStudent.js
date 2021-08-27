import React, { useEffect, useState, Component } from "react";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { queryFetch } from "../../helper/graphqlQuery";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const animatedComponents = makeAnimated();

const AddStudent = () => {
  const initData = {
    studentName: "",
    email: "",
    phone: "",
    dateOfBirth: new Date(),
    takenSubjects: "",
  };

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const fetchAllStudents = () => {
    queryFetch(`query{
        getAllStudent{
          id
          name
          email
          phone
          dateOfBirth
          takenSubjects{
            value
            label
          }
        }
        }`).then((data) => setStudents(data.data.getAllStudent));
  };

  const saveNewStudent = (values) => {
    const stringifySubject = values.takenSubjects.map(
      (item) => `{value:"${item.value}", label:"${item.label}"},`
    );
    queryFetch(`
    mutation{
        createStudent(student:{ name: "${values.studentName}"
          email: "${values.email}",phone:"${values.phone}", dateOfBirth:"${values.dateOfBirth}",
          takenSubjects:[${stringifySubject}]}){
         name
          takenSubjects{
            label
          }
        }
      }
      `).then((data) => console.log("saved data for ", data));
  };

  const deleteSingleStudent = (studentId) => {
    queryFetch(`
      mutation{
        deleteStudent(id:"${studentId}")
      }
      `).then((data) => {
      console.log(data);
      fetchAllStudents();
    });
  };
  useEffect(() => {
    //   subject query for options
    queryFetch(`query{
    getAllSubjects{
      id
      value
      label
    }
  }`).then((data) => setSubjectOptions(data.data.getAllSubjects));
  }, []);

  const getubjectSummaryCount=(students)=>{
    const counts={}
    const temp = [];
    students.map((item) =>
      item.takenSubjects.forEach((sub) => temp.push(sub.label))
    );
    temp.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; })
    return counts;
  }
  return (
    <div>
      <button className="btn primary" onClick={() => fetchAllStudents()}>
        Get all Student and subjects taken
      </button>
      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          /* and other goodies */
        }) => (
          <Form>
            <Field type="text" name="studentName" />
            <ErrorMessage name="studentName" component="div" />
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="number" name="phone" />
            <ErrorMessage name="phone" component="div" />
            {/* <Field type="dateOfBirth" name="dateOfBirth" /> */}
            <DatePicker
              name="dateOfBirth"
              selected={values.dateOfBirth}
              placeholder="Select Date"
              onChange={(date) => setFieldValue("dateOfBirth", date)}
            />
            <ErrorMessage name="dateOfBirth" component="div" />
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[subjectOptions[0]]}
              isMulti
              options={subjectOptions}
              onChange={(v) => setFieldValue("takenSubjects", v)}
            />
            <button type="button" onClick={() => saveNewStudent(values)}>
              Submit
            </button>
          </Form>
        )}
      </Formik>

      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Subjects Taken</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.dateOfBirth}</td>
                <td>{item.takenSubjects.map((sub) => `- ${sub.label} `)}</td>
                <td>
                  <button
                    onClick={() => {
                      setModalShow(true);
                      setModalData(item);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteSingleStudent(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <MydModalWithGrid
        student={modalData}
        subjects={subjectOptions}
        show={modalShow}
        fetchAllStudents={fetchAllStudents}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

function MydModalWithGrid(props) {
  const { name, takenSubjects } = props.student;

  console.log(name);

  const updateSingleStudent = (values) => {
    const stringifySubject = values.takenSubjects.map(
      (item) => `{value:"${item.value}", label:"${item.label}"},`
    );
    queryFetch(`
      mutation{
        updateStudent(id:"${values.id}",student:{
              name:"${values.name}",
              email: "${values.email}",
              phone: "${values.phone}",
              dateOfBirth: "${values.dateOfBirth}",
              takenSubjects: [${stringifySubject}]
            })
        {
          name
          takenSubjects{
            value
            label
          }
        }
      }
      `).then((data) => {
      console.log(data);
      props.fetchAllStudents();
      props.onHide();
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit info of {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={props.student}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <Field type="name" name="name" />
              <ErrorMessage name="name" component="div" />
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <Field type="phone" name="phone" />
              <ErrorMessage name="phone" component="div" />
              <Field type="dateOfBirth" name="dateOfBirth" />
              <ErrorMessage name="dateOfBirth" component="div" />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={takenSubjects}
                isMulti
                options={props.subjects}
                onChange={(v) => setFieldValue("takenSubjects", v)}
              />
              <button type="button" onClick={() => updateSingleStudent(values)}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddStudent;
