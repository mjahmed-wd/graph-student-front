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
import StudentList from "./StudentList";
import FormikInput from "../../helper/_inputField";
import { Button } from "@material-ui/core";
import { useGithubBtnStyles } from "@mui-treasury/styles/button/github";

const animatedComponents = makeAnimated();

let schema = yup.object().shape({
  studentName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  dateOfBirth: yup.date().required(),
});

const AddStudent = ({ setSubjectCount }) => {
  const styles = useGithubBtnStyles();
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
            <div className="d-flex justify-content-center m-3">
              <div className="w-25 text-center">
                <FormikInput
                  type="text"
                  name="studentName"
                  placeholder="Student"
                  onClick={(e) => setFieldValue("studentName", e.target.value)}
                />
                <ErrorMessage name="studentName" component="div" />
                <FormikInput
                  type="email"
                  placeholder="Email"
                  name="email"
                  onClick={(e) => setFieldValue("email", e.target.value)}
                />
                <ErrorMessage name="email" component="div" />
                <FormikInput
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  onClick={(e) => setFieldValue("phone", e.target.value)}
                />
                <ErrorMessage name="phone" component="div" />
                {/* <Field type="dateOfBirth" name="dateOfBirth" /> */}
                <div className="m-2">
                  <DatePicker
                    name="dateOfBirth"
                    selected={values.dateOfBirth}
                    placeholder="Select Date"
                    className="date_field"
                    onChange={(date) => setFieldValue("dateOfBirth", date)}
                  />
                  <ErrorMessage name="dateOfBirth" component="div" />
                </div>
                <div className="m-2">
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={[subjectOptions[0]]}
                    isMulti
                    options={subjectOptions}
                    onChange={(v) => setFieldValue("takenSubjects", v)}
                  />
                </div>
                <div className="mb-2">
                  <Button
                    classes={styles}
                    variant={"contained"}
                    color={"primary"}
                    disabled={!dirty || !isValid}
                    onClick={() =>
                      saveNewStudent(values, fetchAllStudents, setStudents)
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
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
