import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  deleteSingleStudent,
  fetchAllStudents,
  getSubjectSummaryCount,
  queryFetch,
  saveNewStudent,
  updateSingleStudent,
} from "../../helper/graphqlQuery";
import * as yup from "yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import StudentList from "./StudentList";

const animatedComponents = makeAnimated();

let schema = yup.object().shape({
  // studentName:  yup.string().required(),
  // email: yup.string().email().required(),
  // phone: yup.string().required(),
  // dateOfBirth: yup.date().required(),
});

const AddStudent = ({ setSubjectCount }) => {
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

  useEffect(() => {
    fetchAllStudents(setStudents);
    //   subject query for options
    queryFetch(`query{
    getAllSubjects{
      id
      value
      label
    }
  }`).then((data) => setSubjectOptions(data.data.getAllSubjects));
  }, []);

  useEffect(() => {
    getSubjectSummaryCount(students, setSubjectCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);
  return (
    <div>
      <Formik
        initialValues={initData}
        validationSchema={schema}
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
          dirty,
          isValid,
          setFieldValue,
          /* and other goodies */
        }) => (
          <Form>
            <Field type="text" name="studentName" />
            <ErrorMessage name="studentName" component="div" />
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="text" name="phone" />
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
            <button
              type="button"
              disabled={!dirty || !isValid}
              onClick={() =>
                saveNewStudent(values, fetchAllStudents, setStudents)
              }
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <StudentList
        students={students}
        propsObj={{
          fetchAllStudents,
          setStudents,
          deleteSingleStudent,
          setModalShow,
          setModalData,
        }}
      />
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
                <td>{moment(item.dateOfBirth).format("MMM Do YY")}</td>
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
                  <button
                    onClick={() =>
                      deleteSingleStudent(
                        item.id,
                        fetchAllStudents,
                        setStudents
                      )
                    }
                  >
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
        setStudents={setStudents}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

function MydModalWithGrid(props) {
  const { name, takenSubjects } = props.student;
  const { setStudents, fetchAllStudents, onHide } = props;

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
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            // console.log(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            dirty,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" />
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <Field type="text" name="phone" />
              <ErrorMessage name="phone" component="div" />
              <DatePicker
                name="dateOfBirth"
                selected={new Date(values.dateOfBirth)}
                placeholder="Select Date"
                onChange={(date) => setFieldValue("dateOfBirth", date)}
              />
              <ErrorMessage name="dateOfBirth" component="div" />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={takenSubjects}
                isMulti
                options={props.subjects}
                onChange={(v) => setFieldValue("takenSubjects", v)}
              />
              <button
                type="button"
                disabled={!dirty || !isValid}
                onClick={() =>
                  updateSingleStudent(
                    values,
                    fetchAllStudents,
                    setStudents,
                    onHide
                  )
                }
              >
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
