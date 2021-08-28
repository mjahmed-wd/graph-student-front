import React, { useEffect, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  createSubject,
  deleteSubject,
  fetchAllSubject,
} from "../../helper/graphqlQuery";
import SubjectList from "./SubjectList";
import FormikInput from "../../helper/_inputField";
import Button from "@material-ui/core/Button";
import { useGithubBtnStyles } from "@mui-treasury/styles/button/github";
import { usePushingGutterStyles } from "@mui-treasury/styles/gutter/pushing";

const AddSubject = () => {
  const styles = useGithubBtnStyles();
  const gutterStyles = usePushingGutterStyles();
  const initData = {
    // value: "",
    label: "",
  };
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    //   subject query for options
    fetchAllSubject(setSubjectOptions);
  }, []);

  return (
    <div>
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
            {/* <Field type="value" name="value" />
            <ErrorMessage name="value" component="div" /> */}
            <div className="d-flex justify-content-center">
              <div>
                <FormikInput
                  type="label"
                  name="label"
                  placeholder="Subject Name"
                  onChange={(e) => setFieldValue("label", e?.target?.value)}
                />
                <ErrorMessage name="label" component="div" />
              </div>
              <div className={gutterStyles.parent}>
                <Button
                  classes={styles}
                  variant={"contained"}
                  color={"primary"}
                  onClick={() =>
                    createSubject(
                      values,
                      subjectOptions,
                      fetchAllSubject,
                      setSubjectOptions
                    )
                  }
                >
                  Submit
                </Button>
              </div>
            </div>
            {/* <button
              type="button"
              onClick={() =>
                createSubject(
                  values,
                  subjectOptions,
                  fetchAllSubject,
                  setSubjectOptions
                )
              }
            >
              Submit
            </button> */}
          </Form>
        )}
      </Formik>
      {subjectOptions.length > 0 && (
        <SubjectList
          subjectOptions={subjectOptions}
          objProps={{
            deleteSubject,
            fetchAllSubject,
            setSubjectOptions,
          }}
        />
      )}
    </div>
  );
};

export default AddSubject;
